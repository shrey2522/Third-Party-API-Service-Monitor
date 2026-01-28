require('dotenv').config();
const mongoose = require('mongoose');
const Vendor = require('../models/Vendor');

const resetAlerts = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        const result = await Vendor.updateMany({}, { 
            $set: { 
                isAlertSent: false,
                consecutiveFailures: 2 // Set to 2 so next fail triggers alert (Threshold is 3)
            } 
        });

        console.log(`✨ Reset alerts for ${result.modifiedCount} vendors.`);
        console.log('👉 Next failure will trigger an email attempt.');

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await mongoose.connection.close();
        process.exit(0);
    }
};

resetAlerts();
