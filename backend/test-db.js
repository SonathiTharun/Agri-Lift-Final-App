require('dotenv').config();
const mongoose = require('mongoose');

const testConnection = async () => {
  try {
    console.log('Testing MongoDB connection...');
    console.log('URI:', process.env.MONGODB_URI?.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@'));
    
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: process.env.DB_NAME || 'agri-lift-soil-insight'
    });
    
    console.log('✅ MongoDB connection successful!');
    
    // Test basic operations
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📊 Available collections:', collections.map(c => c.name));
    
    // Test seeding
    const { seedDatabase, checkSeedingNeeded } = require('./src/database/seedData');
    const needsSeeding = await checkSeedingNeeded();
    
    if (needsSeeding) {
      console.log('🌱 Seeding database...');
      const result = await seedDatabase();
      console.log('✅ Seeding completed:', result);
    } else {
      console.log('📊 Database already contains data');
    }
    
    await mongoose.disconnect();
    console.log('✅ Test completed successfully');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Database test failed:', error.message);
    process.exit(1);
  }
};

testConnection();
