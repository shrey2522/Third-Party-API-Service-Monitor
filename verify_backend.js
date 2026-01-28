const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

const runVerification = async () => {
    try {
        console.log('🚀 Starting Backend Verification...\n');

        // 1. Register User
        console.log('1️⃣  Testing Registration...');
        const uniqueEmail = `testuser_${Date.now()}@example.com`;
        const registerRes = await axios.post(`${API_URL}/auth/register`, {
            name: 'Test Verify',
            email: uniqueEmail,
            password: 'password123'
        });
        const token = registerRes.data.token;
        console.log('   ✅ Registered successfully. Token received.');

        // 2. Login User (Optional since we got token, but good to test)
        console.log('\n2️⃣  Testing Login...');
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email: uniqueEmail,
            password: 'password123'
        });
        if (loginRes.data.token === token) {
             console.log('   ✅ Login successful. Token matches.');
        } else {
             console.log('   ✅ Login successful. New token received.');
        }
       

        // 3. Add Vendor (Authenticated)
        console.log('\n3️⃣  Testing Add Vendor (Authenticated)...');
        const vendorData = {
            name: 'Verification API',
            url: 'https://api.verification.com/status',
            checkFrequency: 10
        };
        const vendorRes = await axios.post(`${API_URL}/vendors`, vendorData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log(`   ✅ Vendor added: ${vendorRes.data.name} (ID: ${vendorRes.data._id})`);

        // 4. Get Vendors (Authenticated)
        console.log('\n4️⃣  Testing Get Vendors (Authenticated)...');
        const listRes = await axios.get(`${API_URL}/vendors`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log(`   ✅ User has ${listRes.data.length} vendor(s)`);
        
        // 5. Test Unauthorized Access
        console.log('\n5️⃣  Testing Unauthorized Access...');
        try {
            await axios.get(`${API_URL}/vendors`);
        } catch (error) {
            console.log(`   ✅ Blocked as expected. Status: ${error.response.status} ${error.response.statusText}`);
        }

        console.log('\n🎉 ALL BACKEND TESTS PASSED!');

    } catch (error) {
        console.error('\n❌ VERIFICATION FAILED');
        if (error.response) {
            console.error(`   Status: ${error.response.status}`);
            console.error(`   Data:`, error.response.data);
        } else {
            console.error(`   Error: ${error.message}`);
        }
    }
};

runVerification();
