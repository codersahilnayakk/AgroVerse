const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('../models/categoryModel');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const categories = [
  { name: 'Income Support', type: 'scheme', icon: '💰', description: 'Financial assistance and direct benefit transfers' },
  { name: 'Crop Insurance', type: 'scheme', icon: '🛡️', description: 'Insurance against crop loss' },
  { name: 'Equipment Subsidy', type: 'scheme', icon: '🚜', description: 'Subsidies for buying farm equipment' },
  { name: 'Irrigation', type: 'scheme', icon: '💧', description: 'Water management and irrigation systems' },
  { name: 'Soil Health', type: 'scheme', icon: '🌱', description: 'Soil testing and improvement' },
  { name: 'Organic Farming', type: 'scheme', icon: '🌿', description: 'Support for organic cultivation' },
  { name: 'Women Farmers', type: 'scheme', icon: '👩‍🌾', description: 'Schemes specifically for women farmers' },
  { name: 'Livestock', type: 'scheme', icon: '🐄', description: 'Animal husbandry and dairy' },
  { name: 'Loan Assistance', type: 'scheme', icon: '🏦', description: 'Credit and loan facilities' },
  { name: 'Infrastructure', type: 'scheme', icon: '🏗️', description: 'Farm infrastructure development' },
  { name: 'Sustainability', type: 'scheme', icon: '♻️', description: 'Sustainable agriculture practices' },
  { name: 'Other', type: 'general', icon: '📌', description: 'Miscellaneous' },
];

const seedCategories = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('MongoDB Connected...');

    await Category.deleteMany();
    console.log('Existing categories removed...');

    await Category.insertMany(categories);
    console.log('New categories seeded successfully!');

    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedCategories();
