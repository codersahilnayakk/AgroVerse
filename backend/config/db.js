const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Connect to local MongoDB as the primary option
    try {
      const conn = await mongoose.connect('mongodb://localhost:27017/agriconnect', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      return conn;
    } catch (error) {
      console.error(`MongoDB Connection Error: ${error.message}`);
      process.exit(1);
    }
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB; 