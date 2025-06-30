const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

async function testHealth() {
  try {
    const response = await axios.get(`${API_BASE.replace('/api', '')}/health`);
    console.log('✅ Health check passed:', response.data);
    return true;
  } catch (error) {
    console.error('❌ Health check failed:', error.message);
    return false;
  }
}

async function testRegistration() {
  try {
    const userData = {
      name: 'Test Farmer',
      email: 'testfarmer@example.com',
      password: 'Test123',
      phone: '+1234567890',
      role: 'farmer'
    };

    const response = await axios.post(`${API_BASE}/auth/register`, userData, {
      headers: {
        'Content-Type': 'application/json',
      }
    });

    console.log('✅ Registration successful:', response.data);
    return response.data.data?.token;
  } catch (error) {
    console.error('❌ Registration failed:', error.response?.data || error.message);
    return null;
  }
}

async function testLogin() {
  try {
    const loginData = {
      email: 'testfarmer@example.com',
      password: 'Test123'
    };

    const response = await axios.post(`${API_BASE}/auth/login`, loginData, {
      headers: {
        'Content-Type': 'application/json',
      }
    });

    console.log('✅ Login successful:', response.data);
    return response.data.data?.token;
  } catch (error) {
    console.error('❌ Login failed:', error.response?.data || error.message);
    return null;
  }
}

async function testProfile(token) {
  if (!token) {
    console.log('⚠️ No token provided, skipping profile test');
    return;
  }

  try {
    const response = await axios.get(`${API_BASE}/auth/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });

    console.log('✅ Profile test successful:', response.data);
  } catch (error) {
    console.error('❌ Profile test failed:', error.response?.data || error.message);
  }
}

async function runTests() {
  console.log('🧪 Testing Authentication Endpoints...\n');

  // Test health check
  console.log('1. Testing health check...');
  const healthOk = await testHealth();
  if (!healthOk) {
    console.log('❌ Server health check failed, stopping tests');
    return;
  }

  // Test registration
  console.log('\n2. Testing user registration...');
  const regToken = await testRegistration();

  // Test login
  console.log('\n3. Testing user login...');
  const loginToken = await testLogin();

  // Test profile with token
  console.log('\n4. Testing profile access...');
  await testProfile(loginToken || regToken);

  console.log('\n🏁 Authentication tests completed!');
}

// Run the tests
runTests().catch(console.error); 