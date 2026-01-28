require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User'); // Register User model
const Vendor = require('../models/Vendor');

const debugVendors = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        const vendors = await Vendor.find({}).populate('user');
        console.log('--- VENDOR DUMP ---');
        vendors.forEach(v => {
            console.log(`\nName: ${v.name}`);
            console.log(`URL: ${v.url}`);
            console.log(`User Email: ${v.user ? v.user.email : 'NULL USER'}`);
            console.log(`Active: ${v.isActive}`);
            console.log(`Freq: ${v.checkFrequency} min`);
            console.log(`Last Checked: ${v.lastCheckedAt}`);
            console.log(`Consecutive Failures: ${v.consecutiveFailures}`);
            console.log(`Alert Sent: ${v.isAlertSent}`);
            console.log(`Alert Threshold: ${v.alertThreshold}`);
        });

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await mongoose.connection.close();
        process.exit(0);
    }
};

debugVendors();
