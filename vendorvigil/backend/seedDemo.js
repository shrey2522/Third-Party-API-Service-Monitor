const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User.js');
const Vendor = require('./models/Vendor.js');

dotenv.config();

const seedDemo = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Delete existing demo user and their vendors
        const demoEmail = 'demo@vendorvigil.com';
        const existingUser = await User.findOne({ email: demoEmail });
        
        if (existingUser) {
            await Vendor.deleteMany({ userId: existingUser._id });
            await User.deleteOne({ email: demoEmail });
            console.log('Cleaned up old demo data');
        }

        // Create new demo user
        const demoUser = await User.create({
            name: 'Demo Admin',
            email: demoEmail,
            password: 'demo123'
        });

        // Create demo vendors
        const demoVendors = [
            {
                user: demoUser._id,
                name: 'GitHub API (Stable)',
                url: 'https://api.github.com/zen',
                method: 'GET',
                frequency: 1,
                isActive: true
            },
            {
                user: demoUser._id,
                name: 'PokeAPI (Stable)',
                url: 'https://pokeapi.co/api/v2/pokemon/ditto',
                method: 'GET',
                frequency: 2,
                isActive: true
            },
            {
                user: demoUser._id,
                name: 'Fake Stripe (Simulated Failure)',
                url: 'https://api.stripe.com/v1/bad-endpoint-that-fails',
                method: 'GET',
                frequency: 1,
                isActive: true
            },
            {
                user: demoUser._id,
                name: 'Legacy Service (Paused)',
                url: 'https://jsonplaceholder.typicode.com/posts/1',
                method: 'GET',
                frequency: 5,
                isActive: false // paused
            }
        ];

        await Vendor.insertMany(demoVendors);
        console.log('Successfully seeded Sandbox Demo Data!');

        process.exit();
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedDemo();
