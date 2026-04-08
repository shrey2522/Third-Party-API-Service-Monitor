const cron = require('node-cron');
const pingerService = require('../services/pingerService');

/**
 * Initialize cron jobs for monitoring
 * Default: Runs every 5 minutes
 * Note: In future versions, this can be made dynamic per vendor
 */
const initializeCronJobs = () => {
    // Cron expression: */5 * * * * = every 5 minutes
    // Format: minute hour day month weekday
    const cronExpression = '*/30 * * * * *';

    cron.schedule(cronExpression, async () => {
        const timestamp = new Date().toISOString();
        console.log(`\n⏰ [${timestamp}] Cron job triggered`);
        await pingerService.pingAllVendors();
    });

    console.log('✅ Cron scheduler initialized (every 5 minutes)');
    console.log('📋 Monitoring will run automatically in the background\n');

    // Run initial health check after 2 seconds (give DB time to connect)
    setTimeout(() => {
        console.log('🚀 Running initial health check...\n');
        pingerService.pingAllVendors();
    }, 2000);
};

module.exports = { initializeCronJobs };
