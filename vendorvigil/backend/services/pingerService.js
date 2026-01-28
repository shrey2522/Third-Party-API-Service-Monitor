const axios = require('axios');
const Vendor = require('../models/Vendor');
const Log = require('../models/Log');
const Incident = require('../models/Incident');
const sendEmail = require('./emailService');
const sendSlackAlert = require('./slackService');

/**
 * Main function to ping all active vendors
 */
const pingAllVendors = async () => {
    try {
        console.log('🔍 Starting vendor health checks...');

        // Fetch all active vendors and populate user email
        const vendors = await Vendor.find({ isActive: true }).populate('user');

        if (vendors.length === 0) {
            console.log('⚠️  No active vendors to monitor');
            return;
        }

        const now = new Date();
        const pingPromises = [];

        for (const vendor of vendors) {
            // Check if it's time to ping based on frequency
            const lastChecked = vendor.lastCheckedAt ? new Date(vendor.lastCheckedAt) : new Date(0);
            const nextCheckTime = new Date(lastChecked.getTime() + vendor.checkFrequency * 60000); // min to ms

            if (now >= nextCheckTime || !vendor.lastCheckedAt) {
                pingPromises.push(pingVendor(vendor));
            } else {
                 // Debug log (optional, disable in prod to reduce noise)
                 // console.log(`Skipping ${vendor.name}: Next check at ${nextCheckTime.toLocaleTimeString()}`);
            }
        }

        if (pingPromises.length > 0) {
             const results = await Promise.allSettled(pingPromises);
             const fulfilled = results.filter(r => r.status === 'fulfilled').length;
             const rejected = results.filter(r => r.status === 'rejected').length;
             
             if (rejected > 0) {
                 console.warn(`⚠️  ${rejected} health checks failed to complete.`);
                 results.filter(r => r.status === 'rejected').forEach(r => console.error('  Error:', r.reason));
             }
             
             console.log(`✅ Completed health checks: ${fulfilled} successful, ${rejected} failed (Skipped ${vendors.length - pingPromises.length})\n`);
        } else {
             console.log('✅ No vendors due for check\n');
        }

    } catch (error) {
        console.error('❌ Error in pingAllVendors:', error.message);
    }
};

/**
 * Ping individual vendor and log results
 * @param {Object} vendor - Vendor document from MongoDB
 */
const pingVendor = async (vendor) => {
    const startTime = Date.now();
    let logData = {
        vendorId: vendor._id,
        timestamp: new Date()
    };

    try {
        // Make HTTP request with user-defined timeout
        const response = await axios.get(vendor.url, {
            timeout: vendor.timeoutDuration * 1000, // Convert seconds to milliseconds
            validateStatus: (status) => status < 500 // Don't throw on 4xx errors
        });

        const endTime = Date.now();
        const latency = endTime - startTime;

        // Determine if service is healthy
        const isHealthy = response.status >= 200 && response.status < 300;

        logData = {
            ...logData,
            latency,
            status: isHealthy ? 'Healthy' : 'Down',
            statusCode: response.status,
            errorMessage: isHealthy ? null : `HTTP ${response.status}`
        };

        console.log(`✓ ${vendor.name}: ${latency}ms (${response.status})`);

    } catch (error) {
        const endTime = Date.now();
        const latency = endTime - startTime;

        // Handle various error types
        let errorMessage = error.message;
        if (error.code === 'ECONNABORTED') {
            errorMessage = `Timeout after ${vendor.timeoutDuration}s`;
        } else if (error.code === 'ENOTFOUND') {
            errorMessage = 'DNS resolution failed';
        } else if (error.code === 'ECONNREFUSED') {
            errorMessage = 'Connection refused';
        }

        logData = {
            ...logData,
            latency,
            status: 'Down',
            statusCode: error.response?.status || null,
            errorMessage
        };

        console.log(`✗ ${vendor.name}: FAILED (${errorMessage})`);
    }

    // Save log to database
    try {
        await Log.create(logData);

        // Update lastCheckedAt
        vendor.lastCheckedAt = new Date();
        await vendor.save();

        // Check if alert is needed based on consecutive failures
        await checkAndAlert(vendor, logData.status);
    } catch (dbError) {
        console.error(`❌ Failed to save log/vendor for ${vendor.name}:`, dbError.message);
        throw dbError; // Re-throw to be caught by Promise.allSettled
    }
};

/**
 * Check for consecutive failures and trigger alerts
 * @param {Object} vendor - Vendor document
 * @param {String} currentStatus - Current ping status ('Healthy' or 'Down')
 */
const checkAndAlert = async (vendor, currentStatus) => {
    if (currentStatus === 'Healthy') {
        // Resolve any open incidents when service recovers
        const activeIncidents = await Incident.find({
            vendorId: vendor._id,
            resolved: false
        });

        for (const incident of activeIncidents) {
            const duration = Math.round((new Date() - incident.startTime) / 60000); // minutes
            incident.resolved = true;
            incident.endTime = new Date();
            incident.duration = duration;
            await incident.save();
        }

        if (activeIncidents.length > 0) {
            console.log(`✅ ${vendor.name}: Service recovered, incident resolved`);
            
            // Send Recovery Alert
            const recoveryMessage = `✅ Service Recovered: ${vendor.name} is back online after ${activeIncidents[0].duration} minutes.`;
            
            // Send Slack
            const webhookUrl = vendor.slackWebhook || process.env.SLACK_WEBHOOK_URL;
            if (webhookUrl) {
                await sendSlackAlert(webhookUrl, recoveryMessage);
            }

            // Send Email (Default to vendor.user.email if alertEmail is empty)
            const emailToSend = vendor.alertEmail || (vendor.user && vendor.user.email);
            if (emailToSend) {
                await sendEmail({
                    to: emailToSend,
                    subject: `✅ Service Recovered: ${vendor.name}`,
                    html: `<h3>Service Recovered</h3><p><strong>${vendor.name}</strong> is back online.</p><p>URL: ${vendor.url}</p><p>Downtime: ${activeIncidents[0].duration} minutes</p>`
                });
            }
            
            // Reset alert sent flag
            vendor.isAlertSent = false;
            vendor.consecutiveFailures = 0;
            await vendor.save();
        }
        return;
    }

    // Get last N logs (where N = alertThreshold)
    const recentLogs = await Log.find({ vendorId: vendor._id })
        .sort({ timestamp: -1 })
        .limit(vendor.alertThreshold);

    // Check if all recent logs are failures
    const allFailed = recentLogs.every(log => log.status === 'Down');
    const hasEnoughLogs = recentLogs.length === vendor.alertThreshold;

    if (allFailed && hasEnoughLogs) {
        // Check if there's already an active incident
        const activeIncident = await Incident.findOne({
            vendorId: vendor._id,
            resolved: false
        });

        if (!activeIncident) {
            // Create new incident
            await Incident.create({
                vendorId: vendor._id,
                startTime: new Date(),
                consecutiveFailures: vendor.alertThreshold,
                alertSent: false
            });

            console.log(`🚨 ALERT: ${vendor.name} has failed ${vendor.alertThreshold} consecutive times!`);
        } else {
            // Update existing incident with new failure count
            activeIncident.consecutiveFailures += 1;
            await activeIncident.save();
        }

        // Send DOWN Alert if not already sent (Check this regardless of whether incident is new or existing)
        if (!vendor.isAlertSent) {
            const alertMessage = `🚨 Service Down: ${vendor.name} has failed ${vendor.alertThreshold} consecutive checks. URL: ${vendor.url}`;
            
            // Send Slack
            const webhookUrl = vendor.slackWebhook || process.env.SLACK_WEBHOOK_URL;
            if (webhookUrl) {
               await sendSlackAlert(webhookUrl, alertMessage);
            }

            // Send Email (Default to vendor.user.email if alertEmail is empty)
            const emailToSend = vendor.alertEmail || (vendor.user && vendor.user.email);
            if (emailToSend) {
                await sendEmail({
                    to: emailToSend,
                    subject: `🚨 Service Down: ${vendor.name}`,
                    html: `<h3>Service Critical</h3><p><strong>${vendor.name}</strong> is DOWN.</p><p>URL: ${vendor.url}</p><p>Threshold Reached: ${vendor.alertThreshold} consecutive failures.</p>`
                });
            }

            vendor.isAlertSent = true;
            await vendor.save();
        }
    } else {
        // Just increment failures if threshold not reached yet
        if (!allFailed) {
            // If we have some successes mixed in (flapping), maybe resetting failures is safer depending on logic
            // But here we rely on streak. If the recent log was DOWN, we are building a streak.
            // Actually, we should fundamentally track consecutive failures on the vendor object itself for simplicity instead of just logs.
            // But sticking to the current `recentLogs` logic:
             // If NOT all failed, we don't alert.
        }
        
    }
    
    // Update simple counter on vendor for quick access
    if (currentStatus === 'Down') {
         vendor.consecutiveFailures += 1;
    } else {
         vendor.consecutiveFailures = 0;
    }
    await vendor.save();
};

module.exports = {
    pingAllVendors,
    pingVendor
};
