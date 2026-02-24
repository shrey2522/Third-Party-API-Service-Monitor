require('dotenv').config();
const mongoose = require('mongoose');
const Vendor = require('../models/Vendor');
const Log = require('../models/Log');

const removeDuplicateVendors = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        const vendors = await Vendor.find({ isActive: true });
        
        // Group by URL
        const urlMap = {};
        vendors.forEach(vendor => {
            if (!urlMap[vendor.url]) {
                urlMap[vendor.url] = [];
            }
            urlMap[vendor.url].push(vendor);
        });

        let removedCount = 0;

        for (const [url, vendorList] of Object.entries(urlMap)) {
            if (vendorList.length > 1) {
                console.log(`🔍 Found ${vendorList.length} duplicates for URL: ${url}`);
                
                // Sort by createdAt (keep the newest one)
                vendorList.sort((a, b) => b.createdAt - a.createdAt);
                
                console.log(`   ✅ Keeping: "${vendorList[0].name}" (ID: ${vendorList[0]._id}) - Created: ${vendorList[0].createdAt}`);
                
                // Remove the rest
                for (let i = 1; i < vendorList.length; i++) {
                    const vendorToRemove = vendorList[i];
                    console.log(`   ❌ Removing: "${vendorToRemove.name}" (ID: ${vendorToRemove._id}) - Created: ${vendorToRemove.createdAt}`);
                    
                    // Delete associated logs
                    const deletedLogs = await Log.deleteMany({ vendorId: vendorToRemove._id });
                    console.log(`      Deleted ${deletedLogs.deletedCount} associated logs`);
                    
                    // Delete the vendor
                    await Vendor.deleteOne({ _id: vendorToRemove._id });
                    removedCount++;
                }
                console.log('');
            }
        }

        if (removedCount === 0) {
            console.log('✅ No duplicates found to remove!');
        } else {
            console.log(`\n✅ Successfully removed ${removedCount} duplicate vendor(s)!`);
            console.log('🔄 Your monitoring logs should now have single entries per check.');
        }

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('\n✅ Disconnected');
    }
};

removeDuplicateVendors();
