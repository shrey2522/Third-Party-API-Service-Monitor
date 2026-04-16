const axios = require('axios');
const Vendor = require('../models/Vendor');
const Log = require('../models/Log');
const Incident = require('../models/Incident');
const sendEmail = require('./emailService');
const sendSlackAlert = require('./slackService');
const { decrypt } = require('../utils/cryptoUtils');

// Cap concurrent outbound HTTP pings — prevents memory spike when 100s of
// vendors are all due for checking at the same moment
const PING_CONCURRENCY_LIMIT = 50;
// p-limit v6+ is ESM-only; in a CommonJS project we must use dynamic import
// We initialise it once at startup via an async IIFE so it's ready before any
// cron job fires.
let limit;
(async () => {
    const { default: pLimit } = await import('p-limit');
    limit = pLimit(PING_CONCURRENCY_LIMIT);
})();

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
                pingPromises.push(limit(() => pingVendor(vendor)));
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
        // Process headers (decrypt secrets)
        const requestHeaders = {};
        if (vendor.headers && vendor.headers.length > 0) {
            vendor.headers.forEach(h => {
                requestHeaders[h.key] = h.isSecret ? decrypt(h.value) : h.value;
            });
        }

        // Make HTTP request with user-defined timeout and custom headers
        const response = await axios.get(vendor.url, {
            headers: requestHeaders,
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

        // Update lastCheckedAt on vendor, then run the alert check.
        // NOTE: vendor.save() is intentionally NOT called here.
        // checkAndAlert() is responsible for making all final mutations
        // to the vendor document and calling vendor.save() exactly ONCE,
        // eliminating the previous double-save bug.
        vendor.lastCheckedAt = new Date();
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

            const recoveryMessage = `✅ Service Recovered: ${vendor.name} is back online after ${activeIncidents[0].duration} minutes.`;

            // Send Slack
            const webhookUrl = vendor.slackWebhook || process.env.SLACK_WEBHOOK_URL;
            if (webhookUrl) {
                await sendSlackAlert(webhookUrl, recoveryMessage);
            }

            // Send Email
            const emailToSend = vendor.alertEmail || (vendor.user && vendor.user.email);
            if (emailToSend) {
                await sendEmail({
                    to: emailToSend,
                    subject: `✅ Service Recovered: ${vendor.name}`,
                    html: `<h3>Service Recovered</h3><p><strong>${vendor.name}</strong> is back online.</p><p>URL: ${vendor.url}</p><p>Downtime: ${activeIncidents[0].duration} minutes</p>`
                });
            }

            // Reset flags
            vendor.isAlertSent = false;
            vendor.consecutiveFailures = 0;
        }

        // Single save — covers lastCheckedAt + any reset flags above
        await vendor.save();
        return;
    }

    // ── DOWN / FAILURE PATH ──────────────────────────────────────────────
    // Update consecutive failures counter
    vendor.consecutiveFailures = (vendor.consecutiveFailures || 0) + 1;

    // Get last N logs (where N = alertThreshold)
    const recentLogs = await Log.find({ vendorId: vendor._id })
        .sort({ timestamp: -1 })
        .limit(vendor.alertThreshold);

    const allFailed = recentLogs.every(log => log.status === 'Down');
    const hasEnoughLogs = recentLogs.length === vendor.alertThreshold;

    if (allFailed && hasEnoughLogs) {
        // Check if there's already an active incident
        const activeIncident = await Incident.findOne({
            vendorId: vendor._id,
            resolved: false
        });

        if (!activeIncident) {
            await Incident.create({
                vendorId: vendor._id,
                startTime: new Date(),
                consecutiveFailures: vendor.alertThreshold,
                alertSent: false
            });
            console.log(`🚨 ALERT: ${vendor.name} has failed ${vendor.alertThreshold} consecutive times!`);
        } else {
            activeIncident.consecutiveFailures += 1;
            await activeIncident.save();
        }

        // Send alert only once per downtime event
        if (!vendor.isAlertSent) {
            const alertMessage = `🚨 Service Down: ${vendor.name} has failed ${vendor.alertThreshold} consecutive checks. URL: ${vendor.url}`;

            const webhookUrl = vendor.slackWebhook || process.env.SLACK_WEBHOOK_URL;
            if (webhookUrl) {
               await sendSlackAlert(webhookUrl, alertMessage);
            }

            const emailToSend = vendor.alertEmail || (vendor.user && vendor.user.email);
            if (emailToSend) {
                await sendEmail({
                    to: emailToSend,
                    subject: `🚨 Service Down: ${vendor.name}`,
                    html: `<h3>Service Critical</h3><p><strong>${vendor.name}</strong> is DOWN.</p><p>URL: ${vendor.url}</p><p>Threshold Reached: ${vendor.alertThreshold} consecutive failures.</p>`
                });
            }

            vendor.isAlertSent = true;
        }
    }

    // Single guaranteed save — covers lastCheckedAt + consecutiveFailures + isAlertSent
    await vendor.save();
};

module.exports = {
    pingAllVendors,
    pingVendor
};
