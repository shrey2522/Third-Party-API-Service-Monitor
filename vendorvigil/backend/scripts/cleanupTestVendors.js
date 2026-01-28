require('dotenv').config();
const mongoose = require('mongoose');
const Vendor = require('../models/Vendor');

/**
 * Clean up test vendors and keep only your custom vendors
 */
const cleanupTestVendors = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        // List of test vendor names to delete
        const testVendorNames = [
            'Google',
            'GitHub API',
            'JSONPlaceholder API',
            'Invalid URL (Test Failure)',
            'My Backend API'  // Placeholder from template
        ];

        console.log('🗑️  Deleting test vendors...\n');

        // Delete test vendors
        const result = await Vendor.deleteMany({
            name: { $in: testVendorNames }
        });

        console.log(`✅ Deleted ${result.deletedCount} test vendor(s)\n`);

        // Show remaining vendors
        const remainingVendors = await Vendor.find({});
        console.log(`📊 Remaining Vendors: ${remainingVendors.length}\n`);

        if (remainingVendors.length > 0) {
            remainingVendors.forEach(vendor => {
                console.log(`   ✓ ${vendor.name}`);
                console.log(`     URL: ${vendor.url}`);
                console.log(`     Active: ${vendor.isActive}\n`);
            });
        } else {
            console.log('   No vendors remaining. Add your vendors using scripts/addMyVendors.js\n');
        }

        console.log('🎉 Cleanup complete!');

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await mongoose.connection.close();
        console.log('👋 Disconnected from MongoDB');
        process.exit(0);
    }
};

cleanupTestVendors();
