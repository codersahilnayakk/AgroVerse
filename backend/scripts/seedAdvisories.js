const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Advisory = require('../models/advisoryModel');
const User = require('../models/userModel');
const Scheme = require('../models/schemeModel');
const bcrypt = require('bcryptjs');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected for seeding advisories'))
.catch(err => console.error('MongoDB connection error:', err));

const seedAdvisories = async () => {
  try {
    // Clear existing data
    await Advisory.deleteMany({});
    
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
    
    // Get some schemes for reference
    const schemes = await Scheme.find().limit(3);
    const schemeIds = schemes.map(scheme => scheme._id);
    
    // Create advisories for the test user
    const advisories = [
      {
        soilType: 'alluvial',
        season: 'kharif',
        waterLevel: 'high',
        recommendedCrops: ['Rice', 'Jute', 'Sugarcane', 'Maize'],
        fertilizerTips: 'Use nitrogen-rich fertilizers like Urea (80-100 kg/acre) and maintain proper water levels. Add organic matter like Farmyard Manure (4-5 tons/acre) to improve soil structure.',
        soilManagementTips: 'Alluvial soils are highly fertile but need good drainage. Add organic matter regularly and avoid overwatering. Implement crop rotation with legumes to maintain fertility.',
        irrigationStrategy: 'Maintain 5cm water level for rice during critical growth stages. For other crops, provide frequent but measured irrigation, especially during flowering and grain filling stages.',
        cropVarieties: [
          {
            cropName: 'Rice',
            varieties: ['Pusa Basmati 1121', 'MTU 7029', 'Swarna Sub-1']
          },
          {
            cropName: 'Maize',
            varieties: ['DHM 121', 'Vivek QPM 9', 'Pusa HM-4']
          }
        ],
        sowingHarvestingCalendar: 'Rice: Sow in June-July, harvest in October-November. Jute: Sow in March-April, harvest in July-August. Sugarcane: Plant in February-March, harvest after 12 months.',
        applicableSchemes: schemeIds,
        marketPriceTrends: [
          {
            crop: 'Rice',
            price: 1950,
            unit: 'quintal',
            trend: 'up'
          },
          {
            crop: 'Jute',
            price: 4500,
            unit: 'quintal',
            trend: 'stable'
          },
          {
            crop: 'Maize',
            price: 1850,
            unit: 'quintal',
            trend: 'down'
          }
        ],
        soilTestingRecommendations: 'Test for pH, organic carbon, and available NPK. Alluvial soils may need zinc supplementation. For rice cultivation, test for iron to prevent deficiency.',
        userId: testUser._id
      },
      {
        soilType: 'black',
        season: 'rabi',
        waterLevel: 'medium',
        recommendedCrops: ['Wheat', 'Chickpea', 'Safflower', 'Mustard'],
        fertilizerTips: 'Black soils are rich in calcium, magnesium, and potassium but may be deficient in nitrogen and phosphorus. Apply DAP (50 kg/acre) at sowing and urea (40 kg/acre) 30 days after sowing.',
        soilManagementTips: 'These soils have high clay content. Practice deep plowing during summer to improve soil structure. Add organic matter to improve drainage. Use mulching to prevent evaporation.',
        irrigationStrategy: 'Black soils have good water holding capacity. Schedule irrigation at critical stages: crown root initiation, tillering, flowering, and milking stage for wheat. Avoid waterlogging.',
        cropVarieties: [
          {
            cropName: 'Wheat',
            varieties: ['HD 2967', 'PBW 550', 'DBW 17']
          },
          {
            cropName: 'Chickpea',
            varieties: ['JG 11', 'JAKI 9218', 'Pusa 372']
          }
        ],
        sowingHarvestingCalendar: 'Wheat: Sow in October-November, harvest in March-April. Chickpea: Sow in October-November, harvest in February-March. Safflower: Sow in October, harvest in February.',
        applicableSchemes: schemeIds.slice(0, 2),
        marketPriceTrends: [
          {
            crop: 'Wheat',
            price: 2100,
            unit: 'quintal',
            trend: 'up'
          },
          {
            crop: 'Chickpea',
            price: 5200,
            unit: 'quintal',
            trend: 'up'
          },
          {
            crop: 'Mustard',
            price: 5500,
            unit: 'quintal',
            trend: 'stable'
          }
        ],
        soilTestingRecommendations: 'Check for EC, pH, and organic carbon. These soils might need gypsum application if sodium content is high. Monitor calcium to magnesium ratio for optimal nutrient uptake.',
        userId: testUser._id
      },
      {
        soilType: 'red',
        season: 'zaid',
        waterLevel: 'low',
        recommendedCrops: ['Watermelon', 'Muskmelon', 'Sesame', 'Groundnut'],
        fertilizerTips: 'Red soils are generally low in nitrogen, phosphorus and organic matter. Apply SSP (40 kg/acre) as basal and vermicompost (2 tons/acre). Add micronutrients like zinc and boron.',
        soilManagementTips: 'These soils are prone to erosion. Implement contour bunding and terracing. Add well-decomposed organic matter to improve water retention and nutrient availability.',
        irrigationStrategy: 'Use drip irrigation for melons. Schedule frequent but light irrigation due to low water retention capacity. Apply mulch to conserve moisture. Practice deficit irrigation during fruit development.',
        cropVarieties: [
          {
            cropName: 'Watermelon',
            varieties: ['Sugar Baby', 'Arka Jyoti', 'Durgapura Kesar']
          },
          {
            cropName: 'Sesame',
            varieties: ['GT 10', 'HT 1', 'RT 346']
          }
        ],
        sowingHarvestingCalendar: 'Watermelon: Sow in January-February, harvest in April-May. Muskmelon: Sow in January-February, harvest in April. Sesame: Sow in February, harvest in May.',
        applicableSchemes: schemeIds.slice(1, 3),
        marketPriceTrends: [
          {
            crop: 'Watermelon',
            price: 1500,
            unit: 'quintal',
            trend: 'up'
          },
          {
            crop: 'Sesame',
            price: 9800,
            unit: 'quintal',
            trend: 'up'
          },
          {
            crop: 'Groundnut',
            price: 5600,
            unit: 'quintal',
            trend: 'stable'
          }
        ],
        soilTestingRecommendations: 'Test for acidity (pH), available phosphorus, and micronutrients. Red soils often require lime application to correct pH. Monitor iron levels as these soils may have excess iron.',
        userId: testUser._id
      }
    ];
    
    await Advisory.insertMany(advisories);
    
    console.log(`${advisories.length} advisories created for test user`);
    console.log('Seeding completed successfully!');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding advisories:', error);
    process.exit(1);
  }
};

seedAdvisories(); 