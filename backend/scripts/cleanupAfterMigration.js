const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Advisory = require('../models/advisoryModel');
const UserAdvisory = require('../models/userAdvisoryModel');
const readline = require('readline');

// Load environment variables
dotenv.config();

// Create readline interface for confirmation
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/agroverse', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected for advisory cleanup'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

const cleanupOriginalAdvisories = async () => {
  try {
    console.log('Checking migration status...');

    // Count user advisories in both collections
    const originalUserAdvisories = await Advisory.find({ 
      userId: { $exists: true, $ne: null } 
    }).countDocuments();
    
    const migratedUserAdvisories = await UserAdvisory.countDocuments();
    
    console.log(`Found ${originalUserAdvisories} user-specific advisories in original collection`);
    console.log(`Found ${migratedUserAdvisories} user advisories in the new collection`);
    
    if (originalUserAdvisories === 0) {
      console.log('No user-specific advisories found in original collection. No cleanup needed.');
      process.exit(0);
    }
    
    if (migratedUserAdvisories === 0) {
      console.log('WARNING: No user advisories found in the new collection!');
      console.log('Run the migration script first: node scripts/migrateAdvisories.js');
      process.exit(1);
    }

    // Ask for confirmation before deleting
    rl.question(
      `WARNING: This will delete ${originalUserAdvisories} user-specific advisories from the original collection.\n` +
      'Make sure you have run the migration script and verified data integrity first.\n\n' +
      'Do you want to proceed? (yes/no): ', 
      async (answer) => {
        if (answer.toLowerCase() === 'yes') {
          console.log('Proceeding with cleanup...');
          
          // Delete user-specific advisories from original collection
          const result = await Advisory.deleteMany({ 
            userId: { $exists: true, $ne: null } 
          });
          
          console.log(`Deleted ${result.deletedCount} user-specific advisories from original collection`);
          console.log('Cleanup completed successfully!');
          
          rl.close();
          process.exit(0);
        } else {
          console.log('Cleanup cancelled.');
          rl.close();
          process.exit(0);
        }
      }
    );
  } catch (error) {
    console.error('Cleanup error:', error);
    rl.close();
    process.exit(1);
  }
};

cleanupOriginalAdvisories(); 