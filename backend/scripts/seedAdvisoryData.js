const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Advisory = require('../models/advisoryModel');
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/agriconnect', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected for seeding comprehensive advisory data'))
.catch(err => console.error('MongoDB connection error:', err));

const seedComprehensiveData = async () => {
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

    // Process the raw data from user input
    const rawAdvisoryData = [
      {
        "soilType": "Alluvial",
        "season": "Kharif",
        "waterLevel": "High",
        "recommendedCrops": ["Rice (Paddy)", "Sugarcane", "Jute"],
        "soilManagementTips": [
          "Ensure proper field drainage to prevent waterlogging, especially for non-rice crops.",
          "Incorporate green manure crops like Sesbania before paddy transplanting to improve soil organic matter."
        ],
        "irrigationStrategy": [
          "For Rice: Practice intermittent flooding or Alternate Wetting and Drying (AWD) to save water.",
          "For Sugarcane/Jute: Utilize furrow irrigation efficiently, avoiding excessive water application."
        ],
        "fertilizerRecommendations": "Rice: N:P:K @ 50:24:24 kg/acre. Sugarcane: N:P:K @ 100-120:30-40:24 kg/acre. Add Zinc Sulphate @ 10 kg/acre based on soil test.",
        "sowingHarvestingCalendar": "Sowing: June-July, Harvesting: October-December (Rice), October-March (Sugarcane)",
        "marketPriceTrends": "Rice: ₹2200-2800/quintal, Sugarcane: ₹300-400/quintal (FRP dependent), Jute: ₹4500-5500/quintal",
        "governmentSchemes": ["PM-KISAN", "PMFBY (Pradhan Mantri Fasal Bima Yojana)"],
        "soilTestingRecommendations": "Test for pH, EC, Organic Carbon, NPK, and Zinc."
      },
      {
        "soilType": "Alluvial",
        "season": "Kharif",
        "waterLevel": "Medium",
        "recommendedCrops": ["Maize", "Cotton", "Pulses (Arhar/Tur)"],
        "soilManagementTips": [
          "Maintain optimal soil moisture; avoid both water stress and waterlogging.",
          "Practice crop rotation with legumes (like Arhar) to improve soil nitrogen."
        ],
        "irrigationStrategy": [
          "Adopt sprinkler or furrow irrigation for efficient water use.",
          "Utilize rainwater harvesting structures to supplement irrigation during dry spells."
        ],
        "fertilizerRecommendations": "Maize: N:P:K @ 60:25:20 kg/acre. Cotton: N:P:K @ 40:20:20 kg/acre. Arhar: N:P:K @ 8:16:12 kg/acre (starter dose).",
        "sowingHarvestingCalendar": "Sowing: June-July, Harvesting: September-November (Maize), October-January (Cotton, Arhar)",
        "marketPriceTrends": "Maize: ₹2100-2500/quintal, Cotton: ₹6500-7500/quintal, Arhar: ₹7000-8500/quintal",
        "governmentSchemes": ["PMFBY", "National Food Security Mission (NFSM) - Pulses"],
        "soilTestingRecommendations": "Test for NPK, Organic Carbon, pH, and Sulphur."
      },
      {
        "soilType": "Alluvial",
        "season": "Kharif",
        "waterLevel": "Low",
        "recommendedCrops": ["Bajra (Pearl Millet)", "Moong (Green Gram)", "Sesame"],
        "soilManagementTips": [
          "Incorporate organic matter (FYM, compost) to improve water holding capacity.",
          "Use mulching (straw or plastic) to conserve soil moisture."
        ],
        "irrigationStrategy": [
          "Drip irrigation is highly recommended for efficient water use.",
          "Practice deficit irrigation or critical stage irrigation if water is extremely scarce."
        ],
        "fertilizerRecommendations": "Bajra: N:P:K @ 30:16:12 kg/acre. Moong: N:P:K @ 8:12:8 kg/acre. Sesame: N:P:K @ 20:12:12 kg/acre.",
        "sowingHarvestingCalendar": "Sowing: June-July, Harvesting: September-October",
        "marketPriceTrends": "Bajra: ₹2500-3000/quintal, Moong: ₹8000-9000/quintal, Sesame: ₹8500-10000/quintal",
        "governmentSchemes": ["PMKSY (Per Drop More Crop)", "Soil Health Card Scheme"],
        "soilTestingRecommendations": "Focus on Organic Carbon, pH, available NPK, and water holding capacity analysis."
      },
      {
        "soilType": "Alluvial",
        "season": "Rabi",
        "waterLevel": "High",
        "recommendedCrops": ["Wheat", "Potato", "Mustard"],
        "soilManagementTips": [
          "Ensure good tilth for sowing; avoid excessive tillage.",
          "Manage crop residues effectively, either incorporate or use for mulching."
        ],
        "irrigationStrategy": [
          "Use sprinkler irrigation for Wheat and Mustard for uniformity.",
          "For Potato, use furrow irrigation carefully to avoid waterlogging near tubers."
        ],
        "fertilizerRecommendations": "Wheat: N:P:K @ 50:24:16 kg/acre. Potato: N:P:K @ 60:30:40 kg/acre. Mustard: N:P:K @ 40:20:15 kg/acre. Apply Sulphur for Mustard.",
        "sowingHarvestingCalendar": "Sowing: October-November, Harvesting: March-April",
        "marketPriceTrends": "Wheat: ₹2300-2700/quintal, Potato: ₹1000-2500/quintal (variable), Mustard: ₹5500-6500/quintal",
        "governmentSchemes": ["PM-KISAN", "e-NAM (National Agriculture Market)"],
        "soilTestingRecommendations": "Standard NPK, pH, EC, Organic Carbon. Check Sulphur for oilseeds."
      },
      {
        "soilType": "Alluvial",
        "season": "Rabi",
        "waterLevel": "Medium",
        "recommendedCrops": ["Wheat", "Gram (Chickpea)", "Barley"],
        "soilManagementTips": [
          "Practice zero or minimum tillage for wheat after rice to conserve moisture and time.",
          "Incorporate pulse residues (Gram) to improve soil health."
        ],
        "irrigationStrategy": [
          "Schedule irrigation at critical growth stages (CRI, flowering, grain filling for Wheat; pre-flowering, pod development for Gram).",
          "Use check basin or border strip irrigation methods."
        ],
        "fertilizerRecommendations": "Wheat: N:P:K @ 45:20:15 kg/acre. Gram: N:P:K @ 8:18:10 kg/acre + Rhizobium culture. Barley: N:P:K @ 30:16:12 kg/acre.",
        "sowingHarvestingCalendar": "Sowing: October-November, Harvesting: February-April",
        "marketPriceTrends": "Wheat: ₹2300-2700/quintal, Gram: ₹5500-6500/quintal, Barley: ₹1800-2200/quintal",
        "governmentSchemes": ["NFSM (Pulses/Wheat)", "PMFBY"],
        "soilTestingRecommendations": "Test NPK, pH, Organic Carbon. Test for Boron if deficiency suspected."
      },
      {
        "soilType": "Alluvial",
        "season": "Rabi",
        "waterLevel": "Low",
        "recommendedCrops": ["Gram (Chickpea)", "Lentil (Masur)", "Mustard (Taramira/Toria varieties)"],
        "soilManagementTips": [
          "Deep ploughing once in 2-3 years can help improve water infiltration.",
          "Apply organic mulch (straw, stubble) post-sowing to conserve residual moisture."
        ],
        "irrigationStrategy": [
          "Protective/Life-saving irrigation using harvested rainwater or drip system if available.",
          "Focus irrigation only at the most critical stage (e.g., flowering/podding for pulses)."
        ],
        "fertilizerRecommendations": "Gram: N:P:K @ 8:16:8 kg/acre + Rhizobium. Lentil: N:P:K @ 8:16:8 kg/acre + Rhizobium. Mustard: N:P:K @ 30:15:10 kg/acre.",
        "sowingHarvestingCalendar": "Sowing: October-November, Harvesting: February-March",
        "marketPriceTrends": "Gram: ₹5500-6500/quintal, Lentil: ₹6000-7000/quintal, Mustard: ₹5500-6500/quintal",
        "governmentSchemes": ["PMKSY (Per Drop More Crop)", "NFSM (Pulses/Oilseeds)"],
        "soilTestingRecommendations": "Check for residual moisture, Organic Carbon, NPK, and Sulphur (for Mustard)."
      },
      {
        "soilType": "Alluvial",
        "season": "Zaid",
        "waterLevel": "High",
        "recommendedCrops": ["Moong (Green Gram)", "Vegetables (Cucumber, Pumpkin)", "Fodder Crops (Maize, Sorghum)"],
        "soilManagementTips": [
          "Ensure quick land preparation after Rabi harvest.",
          "Maintain good drainage as pre-monsoon showers can coincide."
        ],
        "irrigationStrategy": [
          "Frequent but light irrigation using sprinklers or furrows.",
          "Utilize available canal water or tube well judiciously."
        ],
        "fertilizerRecommendations": "Moong: N:P:K @ 8:12:8 kg/acre. Vegetables: N:P:K @ 30:20:20 kg/acre (split N). Fodder: N:P:K @ 40:20:15 kg/acre.",
        "sowingHarvestingCalendar": "Sowing: March-April, Harvesting: May-June",
        "marketPriceTrends": "Moong: ₹8000-9000/quintal, Vegetables: ₹1500-4000/quintal (highly variable)",
        "governmentSchemes": ["PM-KISAN", "Market Intervention Scheme (MIS) for vegetables"],
        "soilTestingRecommendations": "Quick NPK test, check pH and EC."
      },
      {
        "soilType": "Alluvial",
        "season": "Zaid",
        "waterLevel": "Medium",
        "recommendedCrops": ["Moong (Green Gram)", "Urad (Black Gram)", "Groundnut (early variety)"],
        "soilManagementTips": [
          "Apply light dose of FYM or compost during land preparation.",
          "Mulching is beneficial to conserve moisture and control weeds."
        ],
        "irrigationStrategy": [
          "Sprinkler or drip irrigation preferred for efficiency.",
          "Schedule irrigation based on crop needs and weather conditions, usually every 7-10 days."
        ],
        "fertilizerRecommendations": "Moong/Urad: N:P:K @ 8:12:8 kg/acre. Groundnut: N:P:K @ 10:16:12 kg/acre + Gypsum @ 100 kg/acre at pegging stage.",
        "sowingHarvestingCalendar": "Sowing: March-April, Harvesting: May-June",
        "marketPriceTrends": "Moong: ₹8000-9000/quintal, Urad: ₹7000-8000/quintal, Groundnut: ₹6000-7000/quintal",
        "governmentSchemes": ["NFSM (Pulses/Oilseeds)", "Soil Health Card"],
        "soilTestingRecommendations": "Test for NPK, Organic Carbon, and Sulphur/Calcium for Groundnut."
      },
      {
        "soilType": "Alluvial",
        "season": "Zaid",
        "waterLevel": "Low",
        "recommendedCrops": ["Cowpea (Lobhia)", "Cluster Bean (Guar)", "Sesame"],
        "soilManagementTips": [
          "Focus on moisture conservation techniques like mulching and minimum tillage.",
          "Select heat and drought-tolerant varieties."
        ],
        "irrigationStrategy": [
          "Drip irrigation is the most suitable method.",
          "If drip is not available, provide critical life-saving irrigation only."
        ],
        "fertilizerRecommendations": "Cowpea/Guar: N:P:K @ 8:12:8 kg/acre. Sesame: N:P:K @ 20:12:12 kg/acre.",
        "sowingHarvestingCalendar": "Sowing: March-April, Harvesting: May-June",
        "marketPriceTrends": "Cowpea/Guar/Sesame: Prices vary based on quality and demand, approx. ₹5000-9000/quintal",
        "governmentSchemes": ["PMKSY (Per Drop More Crop)", "Contingency planning funds"],
        "soilTestingRecommendations": "Assess water holding capacity, Organic Carbon, basic NPK levels."
      },
      // Many more entries would follow...
    ];
    
    // Convert the raw data to match the MongoDB schema format
    const advisoryData = rawAdvisoryData.map(item => {
      return {
        soilType: item.soilType,
        season: item.season,
        waterLevel: item.waterLevel,
        recommendedCrops: item.recommendedCrops,
        soilManagementTips: Array.isArray(item.soilManagementTips) ? item.soilManagementTips.join('\n') : item.soilManagementTips,
        irrigationStrategy: Array.isArray(item.irrigationStrategy) ? item.irrigationStrategy.join('\n') : item.irrigationStrategy,
        fertilizerTips: item.fertilizerRecommendations,
        sowingHarvestingCalendar: item.sowingHarvestingCalendar,
        // Parse market price trends from string to expected object format
        marketPriceTrends: item.marketPriceTrends.split(',').map(priceInfo => {
          // Example format: "Rice: ₹2200-2800/quintal"
          const match = priceInfo.trim().match(/([^:]+):\s*₹([0-9]+)-([0-9]+)\/([^,]+)/);
          if (match) {
            const crop = match[1].trim();
            const avgPrice = Math.floor((parseInt(match[2]) + parseInt(match[3])) / 2);
            const unit = match[4].trim();
            return {
              crop,
              price: avgPrice,
              unit,
              trend: 'stable' // Default to stable as trend is not explicitly defined
            };
          }
          return null;
        }).filter(Boolean),
        soilTestingRecommendations: item.soilTestingRecommendations,
        userId: testUser._id
      };
    });

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

seedComprehensiveData(); 