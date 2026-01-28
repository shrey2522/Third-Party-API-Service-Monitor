require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Vendor = require('../models/Vendor');
const { pingVendor } = require('../services/pingerService');

const forceCheck = async () => {
    await connectDB();
    const vendor = await Vendor.findOne({ name: 'abc' });
    
    if (vendor) {
        console.log('--- STARTING FORCE CHECK ---');
        console.log(`Current Failures: ${vendor.consecutiveFailures}`);
        console.log(`Alert Threshold: ${vendor.alertThreshold}`);
        
        // Force a ping
        await pingVendor(vendor);
        
        // Fetch again to see changes
        const updatedVendor = await Vendor.findById(vendor._id);
        console.log('--- AFTER CHECK ---');
        console.log(`Failures: ${updatedVendor.consecutiveFailures}`);
        console.log(`AlertSent: ${updatedVendor.isAlertSent}`);
    } else {
        console.log('Vendor not found');
    }
    process.exit();
};

forceCheck();
