require('dotenv').config();
const mongoose = require('mongoose');

console.log('Testing MongoDB Connection...\n');
console.log('Connection String:', process.env.MONGODB_URI?.replace(/:[^:@]+@/, ':****@')); // Hide password

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('\n✅ SUCCESS! MongoDB Connected:', mongoose.connection.host);
        process.exit(0);
    })
    .catch((error) => {
        console.log('\n❌ CONNECTION FAILED!');
        console.log('Error:', error.message);
        console.log('\nFull Error:', error);
        process.exit(1);
    });
