require('dotenv').config();
const mongoose = require('mongoose');
const Vendor = require('../models/Vendor');

/**
 * Remove duplicate vendors (keep only one of each unique URL)
 */
const removeDuplicates = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        // Get all vendors
        const vendors = await Vendor.find({});
        console.log(`📊 Total vendors before cleanup: ${vendors.length}\n`);

        // Track seen URLs
        const seenUrls = new Set();
        const duplicateIds = [];

        for (const vendor of vendors) {
            if (seenUrls.has(vendor.url)) {
                // This is a duplicate
                duplicateIds.push(vendor._id);
                console.log(`🗑️  Found duplicate: ${vendor.name} (${vendor.url})`);
            } else {
                seenUrls.add(vendor.url);
            }
        }

        if (duplicateIds.length > 0) {
            const result = await Vendor.deleteMany({ _id: { $in: duplicateIds } });
            console.log(`\n✅ Removed ${result.deletedCount} duplicate(s)\n`);
        } else {
            console.log('✅ No duplicates found!\n');
        }

        // Show final vendors
        const finalVendors = await Vendor.find({});
        console.log(`📊 Final Vendor Count: ${finalVendors.length}\n`);

        finalVendors.forEach(vendor => {
            console.log(`   ✓ ${vendor.name}`);
            console.log(`     URL: ${vendor.url}`);
            console.log(`     Check Frequency: ${vendor.checkFrequency} min`);
            console.log(`     Timeout: ${vendor.timeoutDuration}s\n`);
        });

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await mongoose.connection.close();
        console.log('👋 Disconnected from MongoDB');
        process.exit(0);
    }
};

removeDuplicates();
