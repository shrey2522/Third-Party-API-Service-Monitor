require('dotenv').config();
const mongoose = require('mongoose');
const Vendor = require('../models/Vendor');

const checkDuplicates = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        const vendors = await Vendor.find({ isActive: true });
        
        console.log(`📊 Found ${vendors.length} active vendors:\n`);
        
        // Group by URL to find duplicates
        const urlMap = {};
        vendors.forEach(vendor => {
            if (!urlMap[vendor.url]) {
                urlMap[vendor.url] = [];
            }
            urlMap[vendor.url].push({
                id: vendor._id,
                name: vendor.name,
                user: vendor.user
            });
        });

        // Find duplicates
        let hasDuplicates = false;
        for (const [url, vendorList] of Object.entries(urlMap)) {
            if (vendorList.length > 1) {
                hasDuplicates = true;
                console.log(`🔴 DUPLICATE FOUND for URL: ${url}`);
                vendorList.forEach((v, idx) => {
                    console.log(`   ${idx + 1}. Name: "${v.name}" | ID: ${v.id} | User: ${v.user}`);
                });
                console.log('');
            } else {
                console.log(`✅ ${vendorList[0].name} - ${url}`);
            }
        }

        if (!hasDuplicates) {
            console.log('\n✅ No duplicates found!');
        } else {
            console.log('\n⚠️  Duplicates detected! This causes double entries in logs.');
            console.log('Run the cleanup script to remove duplicates.');
        }

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('\n✅ Disconnected');
    }
};

checkDuplicates();
