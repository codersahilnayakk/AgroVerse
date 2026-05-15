const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Advisory = require('./models/advisoryModel');

dotenv.config({ path: './.env' });

mongoose.connect('mongodb://localhost:27017/agroverse', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const advisoryData = [
  {
    soilType: 'Black',
    season: 'Kharif',
    waterLevel: 'Medium',
    recommendedCrops: ['Cotton', 'Soybean', 'Maize'],
    fertilizerTips: 'Add phosphorus and potassium as these soils are rich in nitrogen but poor in these nutrients. Ensure good drainage as black soils can become waterlogged.',
    soilManagementTips: 'Add organic matter to improve soil structure. Practice contour farming. Use cover crops during fallow periods.',
    sowingHarvestingCalendar: 'Sowing: June-July, Harvesting: October-December'
  },
  {
    soilType: 'Alluvial',
    season: 'Rabi',
    waterLevel: 'Medium',
    recommendedCrops: ['Wheat', 'Mustard', 'Maize'],
    fertilizerTips: 'Apply balanced NPK fertilizers. Add compost before sowing for best results. Less frequent but deeper watering is recommended.',
    soilManagementTips: 'Add organic matter regularly. Maintain optimal soil moisture. Use balanced fertilization. Implement crop rotation.',
    sowingHarvestingCalendar: 'Sowing: October-November, Harvesting: March-April'
  },
  {
    soilType: 'Sandy',
    season: 'Kharif',
    waterLevel: 'Low',
    recommendedCrops: ['Pearl Millet', 'Groundnut'],
    fertilizerTips: 'Apply fertilizers in small, frequent doses as sandy soil leaches nutrients quickly. Use organic manures to improve retention.',
    soilManagementTips: 'Add clay and organic compost to improve water retention. Use drought-resistant cover crops. Practice contour farming.',
    sowingHarvestingCalendar: 'Sowing: June-July, Harvesting: September-October'
  },
  {
    soilType: 'Clay',
    season: 'Kharif',
    waterLevel: 'High',
    recommendedCrops: ['Rice', 'Sugarcane'],
    fertilizerTips: 'Use nitrogen-rich fertilizers in split doses. Add organic matter to improve drainage. Avoid over-watering.',
    soilManagementTips: 'Implement raised beds for better drainage. Add coarse sand and organic matter to improve soil structure.',
    sowingHarvestingCalendar: 'Sowing: June-July, Harvesting: November-December'
  },
  {
    soilType: 'Loamy',
    season: 'Zaid',
    waterLevel: 'Medium',
    recommendedCrops: ['Maize', 'Groundnut'],
    fertilizerTips: 'Apply balanced NPK fertilizers as loamy soil supports most crops well. Add compost before sowing.',
    soilManagementTips: 'Practice crop rotation to prevent nutrient depletion. Maintain organic matter levels with regular compost.',
    sowingHarvestingCalendar: 'Sowing: January-February, Harvesting: April-May'
  },
  {
    soilType: 'Red',
    season: 'Kharif',
    waterLevel: 'Low',
    recommendedCrops: ['Groundnut', 'Pearl Millet'],
    fertilizerTips: 'Apply lime if soil is acidic. Use fertilizers rich in phosphorus. Consider micronutrient supplements.',
    soilManagementTips: 'Apply mulch to conserve moisture. Practice water harvesting techniques. Use drought-resistant cover crops.',
    sowingHarvestingCalendar: 'Sowing: June-July, Harvesting: October-November'
  }
];

const seedData = async () => {
  try {
    // We do NOT clear existing advisories to prevent breaking anything, we just add the defaults
    const count = await Advisory.countDocuments();
    if (count === 0) {
      await Advisory.insertMany(advisoryData);
      console.log('Advisory Templates Data Seeded!');
    } else {
      console.log(`Database already has ${count} advisories.`);
    }
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
