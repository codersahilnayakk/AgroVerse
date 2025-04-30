const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Try to connect to MongoDB Atlas first
    const mongoUri = process.env.MONGO_URI;
    
    if (!mongoUri) {
      console.warn('No MongoDB URI found in environment variables. Using local MongoDB instead.');
    }
    
    let conn;
    try {
      // Try to connect to the configured URI (Atlas)
      if (mongoUri) {
        conn = await mongoose.connect(mongoUri, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
        console.log(`MongoDB Atlas Connected: ${conn.connection.host}`);
      } else {
        throw new Error('No MongoDB URI provided');
      }
    } catch (atlasError) {
      // If Atlas connection fails, try local MongoDB
      console.warn(`MongoDB Atlas connection failed: ${atlasError.message}`);
      console.warn('Attempting to connect to local MongoDB...');
      
      try {
        conn = await mongoose.connect('mongodb://localhost:27017/agriconnect', {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
        console.log(`Local MongoDB Connected: ${conn.connection.host}`);
      } catch (localError) {
        console.error(`Local MongoDB connection failed: ${localError.message}`);
        throw new Error('Failed to connect to both MongoDB Atlas and local MongoDB');
      }
    }
    
    return conn;
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB; 