require('dotenv').config();
const mongoose = require('mongoose');
const Vendor = require('../models/Vendor');

/**
 * Delete ALL vendors from database
 * Use this to start fresh
 */
const deleteAllVendors = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        // Show current vendors
        const vendors = await Vendor.find({});
        console.log(`📊 Current vendors in database: ${vendors.length}\n`);

        vendors.forEach((vendor, index) => {
            console.log(`${index + 1}. ${vendor.name}`);
            console.log(`   URL: ${vendor.url}`);
            console.log(`   Active: ${vendor.isActive}\n`);
        });

        // Delete all
        const result = await Vendor.deleteMany({});
        console.log(`🗑️  Deleted ${result.deletedCount} vendor(s)\n`);
        console.log('✅ Database is now clean!');
        console.log('💡 Run: node scripts/addMyVendors.js to add your vendors\n');

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await mongoose.connection.close();
        console.log('👋 Disconnected from MongoDB');
        process.exit(0);
    }
};

deleteAllVendors();
