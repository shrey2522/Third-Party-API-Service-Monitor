require('dotenv').config();
const mongoose = require('mongoose');
const Vendor = require('../models/Vendor');
const Log = require('../models/Log');

/**
 * Script to check current vendors and recent logs
 */
const checkStatus = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        // Get all vendors
        const vendors = await Vendor.find({});
        console.log(`📊 Total Vendors: ${vendors.length}\n`);

        if (vendors.length > 0) {
            vendors.forEach(vendor => {
                console.log(`${vendor.isActive ? '🟢' : '🔴'} ${vendor.name}`);
                console.log(`   URL: ${vendor.url}`);
                console.log(`   Active: ${vendor.isActive}`);
                console.log(`   Check Frequency: ${vendor.checkFrequency} min`);
                console.log(`   Timeout: ${vendor.timeoutDuration}s\n`);
            });

            // Get recent logs
            const recentLogs = await Log.find({})
                .sort({ timestamp: -1 })
                .limit(10)
                .populate('vendorId', 'name');

            console.log(`📝 Recent Logs (Last 10):\n`);
            if (recentLogs.length > 0) {
                recentLogs.forEach(log => {
                    const status = log.status === 'Healthy' ? '✅' : '❌';
                    console.log(`${status} ${log.vendorId?.name || 'Unknown'}: ${log.latency}ms (${log.statusCode || 'N/A'})`);
                    if (log.errorMessage) {
                        console.log(`   Error: ${log.errorMessage}`);
                    }
                });
            } else {
                console.log('   No logs yet. Wait for the cron job to run.');
            }
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await mongoose.connection.close();
        process.exit(0);
    }
};

checkStatus();
