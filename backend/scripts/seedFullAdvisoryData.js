const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Advisory = require('../models/advisoryModel');
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/agriconnect', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected for seeding comprehensive advisory data'))
.catch(err => console.error('MongoDB connection error:', err));

const seedFullAdvisoryData = async () => {
  try {
    // Find or create test user
    let testUser = await User.findOne({ email: 'test@example.com' });
    
    if (!testUser) {
      // Create a test user if doesn't exist
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('password123', salt);
      
      testUser = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: hashedPassword,
        phone: '9876543210',
        location: 'Test Location',
      });
      
      console.log('Test user created');
    }

    // Save raw data to a file first
    const rawAdvisoryData = require('./fullAdvisoryData.json');
    
    // Convert the raw data to match the MongoDB schema format
    const advisoryData = rawAdvisoryData.map(item => {
      try {
        return {
          soilType: item.soilType,
          season: item.season,
          waterLevel: item.waterLevel,
          recommendedCrops: item.recommendedCrops || [],
          // Preserve arrays for soilManagementTips and irrigationStrategy
          soilManagementTips: item.soilManagementTips || '',
          irrigationStrategy: item.irrigationStrategy || '',
          // Map fertilizerRecommendations to fertilizerTips
          fertilizerTips: item.fertilizerRecommendations || '',
          sowingHarvestingCalendar: item.sowingHarvestingCalendar || '',
          // Handle marketPriceTrends as string since that's how it's stored in JSON
          marketPriceTrends: item.marketPriceTrends || '',
          soilTestingRecommendations: item.soilTestingRecommendations || '',
          governmentSchemes: item.governmentSchemes || [],
          userId: testUser._id
        };
      } catch (error) {
        console.error('Error processing item:', item);
        console.error('Error details:', error);
        return null;
      }
    }).filter(Boolean);

    // Check if you want to clear existing data
    console.log('Do you want to clear existing advisory data? (yes/no)');
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });

    readline.question('', async (answer) => {
      if (answer.toLowerCase() === 'yes') {
        await Advisory.deleteMany({});
        console.log('Existing advisory data cleared.');
      }

      // Insert all the data
      await Advisory.insertMany(advisoryData);
      
      console.log(`${advisoryData.length} comprehensive advisory records created for test user`);
      console.log('Seeding completed successfully!');
      
      readline.close();
      process.exit(0);
    });
  } catch (error) {
    console.error('Error seeding comprehensive advisory data:', error);
    process.exit(1);
  }
};

seedFullAdvisoryData(); 