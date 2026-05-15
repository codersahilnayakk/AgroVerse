const mongoose = require('mongoose');

const connectDB = async () => {
  const MAX_RETRIES = 5;
  let retries = 0;

  while (retries < MAX_RETRIES) {
    try {
      const conn = await mongoose.connect(
        process.env.MONGO_URI || 'mongodb://localhost:27017/agroverse',
        {
          // Mongoose 7+ handles these automatically, but explicit for clarity
          serverSelectionTimeoutMS: 10000,
          socketTimeoutMS: 45000,
        }
      );

      console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host}`);
      console.log(`📦 Database: ${conn.connection.name}`);

      // Handle connection events
      mongoose.connection.on('error', (err) => {
        console.error(`❌ MongoDB connection error: ${err.message}`);
      });

      mongoose.connection.on('disconnected', () => {
        console.warn('⚠️  MongoDB disconnected. Attempting reconnection...');
      });

      mongoose.connection.on('reconnected', () => {
        console.log('✅ MongoDB reconnected successfully');
      });

      return conn;
    } catch (error) {
      retries++;
      console.error(
        `❌ MongoDB Connection Attempt ${retries}/${MAX_RETRIES} Failed: ${error.message}`
      );

      if (retries === MAX_RETRIES) {
        console.error('💀 All MongoDB connection retries exhausted. Exiting...');
        process.exit(1);
      }

      // Exponential backoff: 1s, 2s, 4s, 8s, 16s
      const delay = Math.pow(2, retries) * 1000;
      console.log(`⏳ Retrying in ${delay / 1000}s...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
};

module.exports = connectDB;