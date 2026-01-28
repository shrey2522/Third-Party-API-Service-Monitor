require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Vendor = require('../models/Vendor');

const inspectVendor = async () => {
    try {
        await connectDB();
        const vendor = await Vendor.findOne({ name: 'abc' });

        if (!vendor) {
            console.log('OUTPUT: Vendor Not Found');
        } else {
            console.log('OUTPUT: Vendor Found');
            console.log(`OUTPUT: Name: ${vendor.name}`);
            console.log(`OUTPUT: Failures: ${vendor.consecutiveFailures} / Threshold: ${vendor.alertThreshold}`);
            console.log(`OUTPUT: AlertSent: ${vendor.isAlertSent}`);
            console.log(`OUTPUT: Webhook: ${vendor.slackWebhook ? 'Specific URL Set' : 'Using Global'}`);
        }
    } catch (err) {
        console.error(err);
    }
    process.exit();
};
inspectVendor();
