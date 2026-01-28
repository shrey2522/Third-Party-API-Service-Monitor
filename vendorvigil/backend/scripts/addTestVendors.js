require('dotenv').config();
const mongoose = require('mongoose');
const Vendor = require('../models/Vendor');

/**
 * Script to add test vendors for monitoring
 */
const addTestVendors = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        // Sample vendors to monitor
        const testVendors = [
            {
                name: 'rudraenviro',
                url: 'https://www.rudraenviro.com/',
                checkFrequency: 5,
                timeoutDuration: 4,
                latencyThreshold: 500,
                alertThreshold: 3,
                isActive: true
            },
            {
                name: 'GitHub API',
                url: 'https://api.github.com',
                checkFrequency: 5,
                timeoutDuration: 4,
                latencyThreshold: 1000,
                alertThreshold: 3,
                isActive: true
            },
            {
                name: 'JSONPlaceholder API',
                url: 'https://jsonplaceholder.typicode.com/posts/1',
                checkFrequency: 5,
                timeoutDuration: 4,
                latencyThreshold: 800,
                alertThreshold: 3,
                isActive: true
            },
            {
                name: 'Invalid URL (Test Failure)',
                url: 'https://this-url-does-not-exist-12345.com',
                checkFrequency: 5,
                timeoutDuration: 4,
                latencyThreshold: 500,
                alertThreshold: 3,
                isActive: true
            }
        ];

        // Clear existing vendors (optional - comment out if you want to keep existing)
        await Vendor.deleteMany({});
        console.log('🗑️  Cleared existing vendors\n');

        // Insert test vendors
        const inserted = await Vendor.insertMany(testVendors);
        console.log(`✅ Added ${inserted.length} test vendors:\n`);

        inserted.forEach(vendor => {
            console.log(`   - ${vendor.name}`);
            console.log(`     URL: ${vendor.url}`);
            console.log(`     Timeout: ${vendor.timeoutDuration}s`);
            console.log(`     Check Frequency: ${vendor.checkFrequency} min\n`);
        });

        console.log('🎉 Test vendors added successfully!');
        console.log('💡 The monitoring service will check these vendors every 5 minutes.\n');

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await mongoose.connection.close();
        console.log('👋 Disconnected from MongoDB');
        process.exit(0);
    }
};

addTestVendors();
