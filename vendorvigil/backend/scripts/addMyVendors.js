require('dotenv').config();
const mongoose = require('mongoose');
const Vendor = require('../models/Vendor');

/**
 * Add your personal API endpoints to monitor
 * Customize the vendors array below with your own URLs
 */
const addMyVendors = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        // 🔧 CUSTOMIZE THIS ARRAY WITH YOUR API ENDPOINTS
        const myVendors = [
            {
                name: 'RudraInc Website',
                url: 'https://www.rudraenviro.com/',
                checkFrequency: 5,
                timeoutDuration: 4,
                latencyThreshold: 500,
                alertThreshold: 3,
                isActive: true
            },
            {
                name: 'Razorpay Checkout Service',
                url: 'https://checkout-static-next.razorpay.com/build/chunks/v2-entry-5d98217c.modern.js',
                checkFrequency: 5,
                timeoutDuration: 10,
                latencyThreshold: 2000,
                alertThreshold: 3,
                isActive: true
            },

            {
                name: 'WeatherStack API',
                url: '',
                checkFrequency: 5,
                timeoutDuration: 8,
                latencyThreshold: 1500,
                alertThreshold: 3,
                isActive: true
            },
            {
                name: 'MalDatabase API',
                url: 'https://api.maldatabase.com/download?apikey=9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
                checkFrequency: 5,
                timeoutDuration: 10,
                latencyThreshold: 2000,
                alertThreshold: 3,
                isActive: true
            }
        ];

        // Insert vendors
        const inserted = await Vendor.insertMany(myVendors);
        console.log(`✅ Added ${inserted.length} vendor(s):\n`);

        inserted.forEach(vendor => {
            console.log(`   ✓ ${vendor.name}`);
            console.log(`     URL: ${vendor.url}\n`);
        });

        console.log('🎉 Your vendors have been added successfully!');
        console.log('💡 The monitoring service will start checking them automatically.\n');

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await mongoose.connection.close();
        console.log('👋 Disconnected from MongoDB');
        process.exit(0);
    }
};

addMyVendors();
