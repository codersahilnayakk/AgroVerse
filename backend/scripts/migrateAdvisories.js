const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Advisory = require('../models/advisoryModel');
const UserAdvisory = require('../models/userAdvisoryModel');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/agriconnect', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected for advisory migration'))
.catch(err => console.error('MongoDB connection error:', err));

const migrateUserAdvisories = async () => {
  try {
    console.log('Starting advisory migration from Advisory to UserAdvisory...');

    // Find all user-specific advisories with userId field
    const userSpecificAdvisories = await Advisory.find({ 
      userId: { $exists: true, $ne: null } 
    });

    console.log(`Found ${userSpecificAdvisories.length} user-specific advisories to migrate`);
    
    if (userSpecificAdvisories.length === 0) {
      console.log('No user-specific advisories found. Migration not needed.');
      process.exit(0);
    }

    let migratedCount = 0;
    let errorCount = 0;
    let skippedCount = 0;

    // Process each advisory
    for (const advisory of userSpecificAdvisories) {
      try {
        // Check if already migrated
        const existing = await UserAdvisory.findOne({
          userId: advisory.userId,
          soilType: advisory.soilType,
          season: advisory.season,
          waterLevel: advisory.waterLevel,
          createdAt: advisory.createdAt
        });

        if (!existing) {
          // Create new user advisory
          await UserAdvisory.create({
            soilType: advisory.soilType,
            season: advisory.season,
            waterLevel: advisory.waterLevel,
            recommendedCrops: advisory.recommendedCrops,
            fertilizerTips: advisory.fertilizerTips,
            fertilizerRecommendations: advisory.fertilizerRecommendations,
            soilManagementTips: advisory.soilManagementTips,
            irrigationStrategy: advisory.irrigationStrategy,
            cropVarieties: advisory.cropVarieties,
            sowingHarvestingCalendar: advisory.sowingHarvestingCalendar,
            applicableSchemes: advisory.applicableSchemes,
            governmentSchemes: advisory.governmentSchemes,
            marketPriceTrends: advisory.marketPriceTrends,
            soilTestingRecommendations: advisory.soilTestingRecommendations,
            userId: advisory.userId,
            createdAt: advisory.createdAt,
            updatedAt: advisory.updatedAt
          });
          migratedCount++;
          console.log(`Migrated advisory ${advisory._id} for user ${advisory.userId}`);
        } else {
          skippedCount++;
          console.log(`Skipped advisory ${advisory._id} - already exists in UserAdvisory`);
        }
      } catch (err) {
        console.error(`Error migrating advisory ${advisory._id}:`, err);
        errorCount++;
      }
    }

    console.log(`
Migration summary:
- Total user advisories found: ${userSpecificAdvisories.length}
- Successfully migrated: ${migratedCount}
- Skipped (already migrated): ${skippedCount}
- Errors: ${errorCount}
    `);

    console.log('Migration completed.');
    
    // Ask if user wants to delete migrated advisories from the original collection
    if (migratedCount > 0) {
      console.log('You can now run the seedPredefinedAdvisories script to properly seed the reference data.');
      console.log('Make sure to back up your database before proceeding with any cleanup operations.');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  }
};

migrateUserAdvisories(); 