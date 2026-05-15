const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Advisory = require('../models/advisoryModel');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/agroverse', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected for advisory format correction'))
.catch(err => console.error('MongoDB connection error:', err));

const fixAdvisoryFormats = async () => {
  try {
    console.log('Checking advisory data formats...');

    // Get all advisories
    const advisories = await Advisory.find({});
    console.log(`Found ${advisories.length} advisories in the database.`);

    // Count of fixed advisories
    let fixedCount = 0;

    // Process each advisory
    for (const advisory of advisories) {
      let needsUpdate = false;

      // Check if certain fields need to be preserved as arrays
      const fieldsToCheck = [
        { name: 'soilManagementTips', isArray: Array.isArray(advisory.soilManagementTips) },
        { name: 'irrigationStrategy', isArray: Array.isArray(advisory.irrigationStrategy) },
      ];

      // Convert string fields to arrays if needed
      for (const field of fieldsToCheck) {
        if (!field.isArray && typeof advisory[field.name] === 'string' && advisory[field.name].includes('\n')) {
          advisory[field.name] = advisory[field.name].split('\n').filter(line => line.trim());
          needsUpdate = true;
          console.log(`Converting ${field.name} to array format for advisory ${advisory._id}`);
        }
      }

      // Ensure fertilizerTips and fertilizerRecommendations are synchronized
      if (advisory.fertilizerRecommendations && !advisory.fertilizerTips) {
        advisory.fertilizerTips = advisory.fertilizerRecommendations;
        needsUpdate = true;
      } else if (advisory.fertilizerTips && !advisory.fertilizerRecommendations) {
        advisory.fertilizerRecommendations = advisory.fertilizerTips;
        needsUpdate = true;
      }

      // Save if changes were made
      if (needsUpdate) {
        try {
          // Use updateOne instead of save to avoid validation issues
          await Advisory.updateOne(
            { _id: advisory._id },
            { 
              $set: {
                soilManagementTips: advisory.soilManagementTips,
                irrigationStrategy: advisory.irrigationStrategy,
                fertilizerTips: advisory.fertilizerTips,
                fertilizerRecommendations: advisory.fertilizerRecommendations
              }
            }
          );
          fixedCount++;
          console.log(`Successfully updated advisory ${advisory._id}`);
        } catch (updateError) {
          console.error(`Error updating advisory ${advisory._id}:`, updateError);
        }
      }
    }

    console.log(`Fixed ${fixedCount} advisories. Format correction complete.`);
    process.exit(0);
  } catch (error) {
    console.error('Error fixing advisory formats:', error);
    process.exit(1);
  }
};

fixAdvisoryFormats(); 