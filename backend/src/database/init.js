const mongoose = require('mongoose');

// MongoDB connection configuration
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/agri-lift-soil-insight';
const DB_NAME = process.env.DB_NAME || 'agri-lift-soil-insight';

// Connection options
const connectionOptions = {
  maxPoolSize: 10, // Maintain up to 10 socket connections
  serverSelectionTimeoutMS: 30000, // Keep trying to send operations for 30 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  connectTimeoutMS: 30000, // Give up initial connection after 30 seconds
  family: 4, // Use IPv4, skip trying IPv6
  retryWrites: true,
  w: 'majority'
};

// Global connection variable
let isConnected = false;

// Initialize database connection
const initializeDatabase = async () => {
  try {
    if (isConnected) {
      console.log('MongoDB already connected');
      return;
    }

    console.log('Connecting to MongoDB...');
    console.log('URI:', MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@')); // Hide credentials in logs

    await mongoose.connect(MONGODB_URI, connectionOptions);

    isConnected = true;
    console.log('✅ MongoDB connected successfully');
    console.log('📊 Database:', DB_NAME);

    // Set up connection event listeners
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
      isConnected = false;
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB disconnected');
      isConnected = false;
    });

    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected');
      isConnected = true;
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      try {
        await mongoose.connection.close();
        console.log('MongoDB connection closed through app termination');
        process.exit(0);
      } catch (err) {
        console.error('Error closing MongoDB connection:', err);
        process.exit(1);
      }
    });

    // Create indexes for better performance
    await createIndexes();

    // Seed database with initial data if needed
    await seedInitialData();

  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error);
    throw error;
  }
};

// Create database indexes
const createIndexes = async () => {
  try {
    console.log('Creating database indexes...');

    // Import models to ensure indexes are created
    require('../models/User');
    require('../models/SoilReport');
    require('../models/CropRecommendation');
    require('../models/UserSession');
    require('../models/Product');
    require('../models/Order');
    require('../models/Cart');
    require('../models/WeatherData');
    require('../models/MarketPrice');

    console.log('✅ Database indexes created successfully');
  } catch (error) {
    console.error('❌ Error creating indexes:', error);
    throw error;
  }
};

// Get database connection
const getDatabase = () => {
  if (!isConnected) {
    throw new Error('Database not connected. Call initializeDatabase() first.');
  }
  return mongoose.connection;
};

// Check connection status
const isConnectedToDatabase = () => {
  return isConnected && mongoose.connection.readyState === 1;
};

// Get connection stats
const getConnectionStats = () => {
  const connection = mongoose.connection;
  return {
    readyState: connection.readyState,
    host: connection.host,
    port: connection.port,
    name: connection.name,
    collections: Object.keys(connection.collections),
    isConnected: isConnectedToDatabase()
  };
};

// Health check function
const healthCheck = async () => {
  try {
    if (!isConnectedToDatabase()) {
      throw new Error('Database not connected');
    }

    // Ping the database
    await mongoose.connection.db.admin().ping();

    return {
      status: 'healthy',
      connection: getConnectionStats(),
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
};

// Close database connection
const closeDatabase = async () => {
  try {
    if (isConnected) {
      await mongoose.connection.close();
      isConnected = false;
      console.log('MongoDB connection closed');
    }
  } catch (error) {
    console.error('Error closing MongoDB connection:', error);
    throw error;
  }
};

// Seed initial data
const seedInitialData = async () => {
  try {
    const { seedDatabase, checkSeedingNeeded } = require('./seedData');

    const needsSeeding = await checkSeedingNeeded();
    if (needsSeeding) {
      console.log('🌱 Seeding database with initial data...');
      const result = await seedDatabase();
      console.log('✅ Database seeding completed:', result);
    } else {
      console.log('📊 Database already contains data, skipping seeding');
    }
  } catch (error) {
    console.error('⚠️ Database seeding failed:', error.message);
    // Don't throw error to prevent server startup failure
  }
};

module.exports = {
  initializeDatabase,
  getDatabase,
  isConnectedToDatabase,
  getConnectionStats,
  healthCheck,
  closeDatabase,
  MONGODB_URI: MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@'), // Hide credentials
  DB_NAME
};
