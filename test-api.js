// Simple test script to verify API endpoints
const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:5000/api';

async function testEndpoints() {
  console.log('🧪 Testing API endpoints...\n');

  const tests = [
    {
      name: 'Health Check',
      url: 'http://localhost:5000/health',
      method: 'GET'
    },
    {
      name: 'Product Categories',
      url: `${BASE_URL}/products/categories`,
      method: 'GET'
    },
    {
      name: 'Featured Products',
      url: `${BASE_URL}/products/featured`,
      method: 'GET'
    },
    {
      name: 'Latest Market Prices',
      url: `${BASE_URL}/market-prices/latest?limit=5`,
      method: 'GET'
    },
    {
      name: 'Weather Data (Delhi)',
      url: `${BASE_URL}/weather/current?city=Delhi&state=Delhi`,
      method: 'GET'
    }
  ];

  for (const test of tests) {
    try {
      console.log(`Testing: ${test.name}`);
      const response = await fetch(test.url, { method: test.method });
      
      if (response.ok) {
        const data = await response.json();
        console.log(`✅ ${test.name}: Success`);
        console.log(`   Status: ${response.status}`);
        if (data.data) {
          if (Array.isArray(data.data)) {
            console.log(`   Data: Array with ${data.data.length} items`);
          } else if (typeof data.data === 'object') {
            console.log(`   Data: Object with keys: ${Object.keys(data.data).join(', ')}`);
          }
        }
      } else {
        console.log(`❌ ${test.name}: Failed`);
        console.log(`   Status: ${response.status}`);
        const errorText = await response.text();
        console.log(`   Error: ${errorText.substring(0, 100)}...`);
      }
    } catch (error) {
      console.log(`❌ ${test.name}: Error`);
      console.log(`   Error: ${error.message}`);
    }
    console.log('');
  }
}

// Test if server is running
async function checkServer() {
  try {
    const response = await fetch('http://localhost:5000/health');
    if (response.ok) {
      console.log('✅ Server is running on port 5000\n');
      return true;
    }
  } catch (error) {
    console.log('❌ Server is not running on port 5000');
    console.log('   Please start the backend server first: cd backend && node server.js\n');
    return false;
  }
}

async function main() {
  console.log('🚀 API Testing Tool\n');
  
  const serverRunning = await checkServer();
  if (serverRunning) {
    await testEndpoints();
  }
  
  console.log('🏁 Testing completed');
}

main().catch(console.error);
