const asyncHandler = require('express-async-handler');
const { validationResult } = require('express-validator');
const Advisory = require('../models/advisoryModel');
const Scheme = require('../models/schemeModel');

// @desc    Create a new advisory
// @route   POST /api/advisory
// @access  Private
const createAdvisory = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(errors.array()[0].msg);
  }

  const { soilType, season, waterLevel } = req.body;

  if (!soilType || !season || !waterLevel) {
    res.status(400);
    throw new Error('Please provide soil type, season, and water level');
  }

  // Generate recommendations based on inputs
  const recommendedCrops = generateRecommendations(soilType, season, waterLevel);
  const fertilizerTips = generateFertilizerTips(soilType, recommendedCrops);
  const soilManagementTips = generateSoilManagementTips(soilType, waterLevel);
  const irrigationStrategy = generateIrrigationStrategy(soilType, waterLevel, season);
  const cropVarieties = await generateCropVarieties(recommendedCrops, soilType);
  const sowingHarvestingCalendar = generateSowingHarvestingCalendar(recommendedCrops, season);
  const applicableSchemes = await findApplicableSchemes(soilType, waterLevel);
  const marketPriceTrends = generateMarketPriceTrends(recommendedCrops);
  const soilTestingRecommendations = generateSoilTestingRecommendations(soilType);

  const advisory = await Advisory.create({
    soilType,
    season,
    waterLevel,
    recommendedCrops,
    fertilizerTips,
    soilManagementTips,
    irrigationStrategy,
    cropVarieties,
    sowingHarvestingCalendar,
    applicableSchemes,
    marketPriceTrends,
    soilTestingRecommendations,
    userId: req.user.id
  });

  if (advisory) {
    res.status(201).json(advisory);
  } else {
    res.status(400);
    throw new Error('Invalid advisory data');
  }
});

// @desc    Get all advisories for a user
// @route   GET /api/advisory
// @access  Private
const getAdvisories = asyncHandler(async (req, res) => {
  const advisories = await Advisory.find({ userId: req.user.id })
    .populate('applicableSchemes', 'name department')
    .sort({ createdAt: -1 });

  res.status(200).json(advisories);
});

// @desc    Get advisory by ID
// @route   GET /api/advisory/:id
// @access  Private
const getAdvisoryById = asyncHandler(async (req, res) => {
  const advisory = await Advisory.findById(req.params.id)
    .populate('applicableSchemes', 'name department');

  if (!advisory) {
    res.status(404);
    throw new Error('Advisory not found');
  }

  // Make sure the user owns the advisory
  if (advisory.userId.toString() !== req.user.id) {
    res.status(401);
    throw new Error('Not authorized to access this advisory');
  }

  res.status(200).json(advisory);
});

// @desc    Update advisory by ID
// @route   PUT /api/advisory/:id
// @access  Private
const updateAdvisory = asyncHandler(async (req, res) => {
  const advisory = await Advisory.findById(req.params.id);

  if (!advisory) {
    res.status(404);
    throw new Error('Advisory not found');
  }

  // Make sure the user owns the advisory
  if (advisory.userId.toString() !== req.user.id) {
    res.status(401);
    throw new Error('Not authorized to update this advisory');
  }

  const updatedAdvisory = await Advisory.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.status(200).json(updatedAdvisory);
});

// @desc    Delete advisory by ID
// @route   DELETE /api/advisory/:id
// @access  Private
const deleteAdvisory = asyncHandler(async (req, res) => {
  const advisory = await Advisory.findById(req.params.id);

  if (!advisory) {
    res.status(404);
    throw new Error('Advisory not found');
  }

  // Make sure the user owns the advisory
  if (advisory.userId.toString() !== req.user.id) {
    res.status(401);
    throw new Error('Not authorized to delete this advisory');
  }

  await advisory.deleteOne();

  res.status(200).json({ id: req.params.id });
});

// Recommendation generation functions
const generateRecommendations = (soilType, season, waterLevel) => {
  // Crop database organized by soil type, season, and water level
  const cropRecommendations = {
    clay: {
      kharif: {
        high: ['Rice', 'Jute', 'Sugarcane'],
        medium: ['Cotton', 'Soybean', 'Maize'],
        low: ['Black gram', 'Green gram', 'Pigeon pea']
      },
      rabi: {
        high: ['Wheat', 'Barley', 'Mustard'],
        medium: ['Gram', 'Peas', 'Lentil'],
        low: ['Safflower', 'Linseed', 'Chickpea']
      },
      summer: {
        high: ['Green gram', 'Rice', 'Vegetables'],
        medium: ['Okra', 'Cucumber', 'Pumpkin'],
        low: ['Sesame', 'Sunflower', 'Cluster beans']
      }
    },
    sandy: {
      kharif: {
        high: ['Maize', 'Groundnut', 'Vegetables'],
        medium: ['Millet', 'Cowpea', 'Cluster beans'],
        low: ['Pearl millet', 'Cluster beans', 'Sesame']
      },
      rabi: {
        high: ['Potato', 'Carrot', 'Radish'],
        medium: ['Groundnut', 'Gram', 'Coriander'],
        low: ['Chickpea', 'Cumin', 'Mustard']
      },
      summer: {
        high: ['Watermelon', 'Muskmelon', 'Cucumber'],
        medium: ['Watermelon', 'Gourds', 'Vegetable crops'],
        low: ['Watermelon', 'Millet', 'Groundnut']
      }
    },
    loamy: {
      kharif: {
        high: ['Rice', 'Maize', 'Sugarcane', 'Vegetables'],
        medium: ['Cotton', 'Soybean', 'Groundnut', 'Pulses'],
        low: ['Millet', 'Black gram', 'Pigeon pea']
      },
      rabi: {
        high: ['Wheat', 'Barley', 'Potato', 'Vegetables'],
        medium: ['Wheat', 'Barley', 'Mustard', 'Peas'],
        low: ['Gram', 'Safflower', 'Linseed']
      },
      summer: {
        high: ['Rice', 'Vegetables', 'Watermelon'],
        medium: ['Cucumber', 'Pumpkin', 'Gourds', 'Okra'],
        low: ['Sesame', 'Sunflower', 'Millet']
      }
    },
    black: {
      kharif: {
        high: ['Cotton', 'Soybean', 'Pigeon pea'],
        medium: ['Cotton', 'Sorghum', 'Maize'],
        low: ['Sorghum', 'Millet', 'Pulses']
      },
      rabi: {
        high: ['Wheat', 'Gram', 'Sunflower'],
        medium: ['Wheat', 'Chickpea', 'Safflower'],
        low: ['Gram', 'Safflower', 'Linseed']
      },
      summer: {
        high: ['Sesame', 'Millet', 'Vegetables'],
        medium: ['Sesame', 'Sunflower', 'Okra'],
        low: ['Sesame', 'Cluster beans', 'Millet']
      }
    },
    red: {
      kharif: {
        high: ['Rice', 'Sugarcane', 'Vegetables'],
        medium: ['Sorghum', 'Pulses', 'Groundnut'],
        low: ['Millet', 'Pulses', 'Oilseeds']
      },
      rabi: {
        high: ['Wheat', 'Vegetables', 'Pulses'],
        medium: ['Wheat', 'Gram', 'Oilseeds'],
        low: ['Gram', 'Safflower', 'Mustard']
      },
      summer: {
        high: ['Vegetables', 'Fruits', 'Pulses'],
        medium: ['Groundnut', 'Vegetable crops', 'Sunflower'],
        low: ['Sesame', 'Cluster beans', 'Millet']
      }
    }
  };

  // Return recommended crops based on parameters
  if (cropRecommendations[soilType] && 
      cropRecommendations[soilType][season] && 
      cropRecommendations[soilType][season][waterLevel]) {
    return cropRecommendations[soilType][season][waterLevel];
  }
  
  // Fallback to a default if the specific combination is not found
  return ['Millet', 'Pulses', 'Oilseeds'];
};

const generateFertilizerTips = (soilType, crops) => {
  const fertilizerTips = {
    clay: 'Add organic matter to improve drainage. Use nitrogen-rich fertilizers in split doses. Consider gypsum application for very heavy clay soils. Avoid over-watering which can lead to waterlogging.',
    sandy: 'Use organic manures and composts extensively to improve water retention. Apply fertilizers in small, frequent doses as sandy soil leaches nutrients quickly. Consider micronutrient supplements as sandy soils are often deficient.',
    loamy: 'Apply balanced NPK fertilizers as loamy soil supports most crops well. Add compost before sowing for best results. Less frequent but deeper watering is recommended. Crop rotation is highly effective in this soil type.',
    black: 'Add phosphorus and potassium as these soils are often rich in nitrogen but poor in these nutrients. Ensure good drainage as black soils can become waterlogged. Use less nitrogen for leguminous crops. Consider zinc supplements for certain crops.',
    red: 'Add organic matter to improve water retention. Apply lime if soil is acidic. Use fertilizers rich in phosphorus. Consider micronutrient supplements, especially iron and manganese.'
  };

  return fertilizerTips[soilType] || 'Apply balanced NPK fertilizers based on soil testing results. Use organic manures to improve soil health.';
};

const generateSoilManagementTips = (soilType, waterLevel) => {
  const managementTips = {
    clay: {
      high: 'Implement raised beds for better drainage. Add coarse sand and organic matter to improve soil structure. Avoid tilling when soil is too wet.',
      medium: 'Add organic matter regularly to improve soil structure. Practice minimum tillage to avoid compaction. Consider cover crops during fallow periods.',
      low: 'Mulch heavily to conserve moisture. Add organic matter to improve water-holding capacity. Consider no-till farming practices.'
    },
    sandy: {
      high: 'Add clay and organic matter to improve nutrient retention. Use mulch to prevent water loss. Implement windbreaks to prevent soil erosion.',
      medium: 'Add compost and manure regularly. Use mulch to conserve moisture. Consider green manure crops during fallow periods.',
      low: 'Add clay and organic compost to improve water retention. Use drought-resistant cover crops. Practice contour farming to retain moisture.'
    },
    loamy: {
      high: 'Practice crop rotation to prevent nutrient depletion. Maintain organic matter levels with regular addition of compost. Implement contour farming in sloped areas.',
      medium: 'Add organic matter regularly. Practice crop rotation. Use cover crops during fallow periods.',
      low: 'Mulch extensively to conserve moisture. Practice minimal tillage. Use drought-resistant cover crops.'
    },
    black: {
      high: 'Ensure proper drainage during rainy season. Form ridges and furrows for better water management. Avoid deep tillage when soil is very dry.',
      medium: 'Add organic matter to improve soil structure. Practice contour farming. Use cover crops during fallow periods.',
      low: 'Apply mulch to reduce evaporation. Practice minimum tillage. Consider trench farming for moisture conservation.'
    },
    red: {
      high: 'Add lime if soil is acidic. Implement terracing on sloped land. Add organic matter to improve soil structure.',
      medium: 'Add organic matter regularly. Practice contour farming. Use cover crops to prevent erosion.',
      low: 'Apply mulch to conserve moisture. Practice water harvesting techniques. Use drought-resistant cover crops.'
    }
  };

  return managementTips[soilType]?.[waterLevel] || 'Add organic matter regularly to improve soil health. Practice crop rotation. Implement soil conservation measures appropriate for your land topography.';
};

const generateIrrigationStrategy = (soilType, waterLevel, season) => {
  const baseStrategies = {
    clay: {
      high: 'Use furrow or basin irrigation for optimal results. Implement proper drainage to prevent waterlogging. Monitor soil moisture to avoid over-irrigation.',
      medium: 'Consider sprinkler irrigation for even water distribution. Schedule irrigation based on crop growth stages. Implement water conservation practices.',
      low: 'Use drip irrigation for efficient water use. Practice deficit irrigation during less critical growth stages. Implement rainwater harvesting.'
    },
    sandy: {
      high: 'Use frequent but light irrigation as sandy soils drain quickly. Consider drip irrigation for efficient water use. Add organic matter to improve water retention.',
      medium: 'Implement drip irrigation. Use mulch to reduce evaporation. Schedule irrigation for early morning or evening to reduce evaporation losses.',
      low: 'Use micro-irrigation systems for maximum efficiency. Apply water-retaining soil amendments. Practice strict irrigation scheduling based on soil moisture sensors.'
    },
    loamy: {
      high: 'Most irrigation methods work well. Schedule irrigation based on crop needs. Use soil moisture monitoring for optimal results.',
      medium: 'Use sprinkler or drip irrigation for efficient water distribution. Implement irrigation scheduling based on evapotranspiration rates.',
      low: 'Implement drip irrigation. Use mulch to reduce evaporation. Consider deficit irrigation techniques.'
    },
    black: {
      high: 'Implement proper drainage systems to prevent waterlogging. Use furrow irrigation with proper field leveling. Monitor soil moisture to avoid over-irrigation.',
      medium: 'Use basin or sprinkler irrigation. Implement irrigation scheduling based on soil moisture status.',
      low: 'Consider drip irrigation for water conservation. Implement water harvesting techniques. Practice deficit irrigation during less critical growth stages.'
    },
    red: {
      high: 'Use sprinkler or basin irrigation. Schedule irrigation based on crop water requirements. Implement soil moisture monitoring.',
      medium: 'Consider drip or sprinkler irrigation. Use mulch to reduce evaporation. Implement irrigation scheduling.',
      low: 'Use micro-irrigation systems. Implement water harvesting techniques. Practice deficit irrigation strategically.'
    }
  };

  // Season-specific adjustments
  const seasonalAdjustments = {
    kharif: ' During monsoon, focus on drainage management and supplemental irrigation as needed.',
    rabi: ' Schedule irrigation based on critical crop growth stages to maximize yield with available water.',
    summer: ' Implement efficient water use technologies and practices to minimize evaporation losses.'
  };

  return (baseStrategies[soilType]?.[waterLevel] || 'Implement irrigation based on crop water requirements and soil moisture status.') + seasonalAdjustments[season];
};

const generateCropVarieties = async (recommendedCrops, soilType) => {
  // This would ideally come from a database, but we'll hardcode for now
  const varietiesDatabase = {
    'Rice': {
      default: ['IR-36', 'MTU-7029', 'MTU-1010'],
      clay: ['Swarna', 'IR-64', 'MTU-7029'],
      loamy: ['IR-36', 'Pusa Basmati-1', 'HMT']
    },
    'Wheat': {
      default: ['HD-2967', 'PBW-550', 'WH-542'],
      black: ['GW-322', 'HD-2967', 'LOK-1'],
      loamy: ['HD-3086', 'PBW-723', 'WH-1105']
    },
    'Maize': {
      default: ['DHM-117', 'Ganga Safed-2', 'Pusa HM-4'],
      loamy: ['DHM-117', 'PRO-311', 'DKC-9081'],
      red: ['NAH-2049', 'COH(M)-5', 'HQPM-1']
    },
    'Groundnut': {
      default: ['GG-20', 'TAG-24', 'JL-24'],
      sandy: ['TG-37A', 'GJG-9', 'GG-20'],
      red: ['K-6', 'TAG-24', 'TMV-7']
    },
    'Cotton': {
      default: ['Suraj', 'NH-615', 'H-1098'],
      black: ['Suraj', 'Ajeet-155', 'RCH-659'],
      loamy: ['DCH-32', 'LH-1556', 'NHH-44']
    },
    'Millet': {
      default: ['HHB-67', 'ICTP-8203', 'ICMV-221'],
      sandy: ['ICTP-8203', 'HHB-67 Improved', 'Pusa-383'],
      red: ['CO-9', 'HHB-67', 'ICMV-221']
    },
    'Sugarcane': {
      default: ['CO-86032', 'CoC-671', 'BO-91'],
      clay: ['CO-86032', 'CoM-0265', 'CO-99004'],
      loamy: ['CoC-671', 'PI-96603', 'CO-86032']
    },
    'Vegetables': {
      default: ['Local varieties']
    }
  };

  const result = [];
  
  for (const crop of recommendedCrops) {
    const cropEntry = {
      cropName: crop,
      varieties: varietiesDatabase[crop]?.[soilType] || varietiesDatabase[crop]?.default || ['Local varieties']
    };
    result.push(cropEntry);
  }
  
  return result;
};

const generateSowingHarvestingCalendar = (recommendedCrops, season) => {
  // Calendar database
  const calendar = {
    'Rice': {
      kharif: 'Sowing: June-July, Harvesting: November-December',
      rabi: 'Sowing: November-December, Harvesting: April-May',
      summer: 'Sowing: February-March, Harvesting: May-June'
    },
    'Wheat': {
      rabi: 'Sowing: October-November, Harvesting: March-April'
    },
    'Maize': {
      kharif: 'Sowing: June-July, Harvesting: September-October',
      rabi: 'Sowing: October-November, Harvesting: February-March',
      summer: 'Sowing: January-February, Harvesting: April-May'
    },
    'Groundnut': {
      kharif: 'Sowing: June-July, Harvesting: October-November',
      rabi: 'Sowing: November-December, Harvesting: March-April',
      summer: 'Sowing: January-February, Harvesting: April-May'
    },
    'Cotton': {
      kharif: 'Sowing: May-June, Harvesting: November-February'
    },
    'Millet': {
      kharif: 'Sowing: June-July, Harvesting: September-October',
      summer: 'Sowing: February-March, Harvesting: May-June'
    },
    'Sugarcane': {
      general: 'Sowing: October-February, Harvesting: After 12-18 months of planting'
    },
    'Jute': {
      kharif: 'Sowing: March-May, Harvesting: July-September'
    },
    'Soybean': {
      kharif: 'Sowing: June-July, Harvesting: September-October'
    },
    'Chickpea': {
      rabi: 'Sowing: October-November, Harvesting: February-March'
    },
    'Mustard': {
      rabi: 'Sowing: October-November, Harvesting: February-March'
    },
    'Watermelon': {
      summer: 'Sowing: January-February, Harvesting: April-May'
    },
    'Vegetables': {
      general: 'Varies by specific vegetable type, consult local agricultural extension'
    }
  };

  let calendarText = '';
  
  for (const crop of recommendedCrops) {
    if (calendar[crop]) {
      if (calendar[crop][season]) {
        calendarText += `${crop}: ${calendar[crop][season]}\n`;
      } else if (calendar[crop]['general']) {
        calendarText += `${crop}: ${calendar[crop]['general']}\n`;
      }
    }
  }
  
  return calendarText || 'Consult your local agricultural extension for specific sowing and harvesting dates for your region.';
};

const findApplicableSchemes = async (soilType, waterLevel) => {
  // In a real application, this would query the Scheme model
  // For now, we'll return some relevant scheme IDs if they exist
  try {
    let relevantSchemes = [];
    
    // Find schemes related to irrigation for low water level
    if (waterLevel === 'low') {
      const irrigationSchemes = await Scheme.find({
        $or: [
          { name: { $regex: 'irrigation', $options: 'i' } },
          { name: { $regex: 'water', $options: 'i' } },
          { description: { $regex: 'drought', $options: 'i' } }
        ]
      }).limit(3);
      
      relevantSchemes = [...relevantSchemes, ...irrigationSchemes.map(scheme => scheme._id)];
    }
    
    // Add general agricultural schemes
    const generalSchemes = await Scheme.find({
      $or: [
        { name: { $regex: 'kisan', $options: 'i' } },
        { name: { $regex: 'farm', $options: 'i' } }
      ]
    }).limit(2);
    
    relevantSchemes = [...relevantSchemes, ...generalSchemes.map(scheme => scheme._id)];
    
    // Add soil-specific schemes if available
    const soilSchemes = await Scheme.find({
      description: { $regex: soilType, $options: 'i' }
    }).limit(2);
    
    relevantSchemes = [...relevantSchemes, ...soilSchemes.map(scheme => scheme._id)];
    
    return relevantSchemes;
  } catch (error) {
    console.error('Error finding applicable schemes:', error);
    return [];
  }
};

const generateMarketPriceTrends = (crops) => {
  // In a real application, this would call an API or query a database
  // For now, we'll generate some mock data
  const mockPriceData = [
    { crop: 'Rice', price: 2200, unit: 'quintal', trend: 'up' },
    { crop: 'Wheat', price: 2100, unit: 'quintal', trend: 'stable' },
    { crop: 'Maize', price: 1800, unit: 'quintal', trend: 'down' },
    { crop: 'Cotton', price: 6500, unit: 'quintal', trend: 'up' },
    { crop: 'Groundnut', price: 5500, unit: 'quintal', trend: 'up' },
    { crop: 'Millet', price: 2300, unit: 'quintal', trend: 'stable' },
    { crop: 'Soybean', price: 4000, unit: 'quintal', trend: 'up' },
    { crop: 'Sugarcane', price: 320, unit: 'quintal', trend: 'stable' },
    { crop: 'Chickpea', price: 4800, unit: 'quintal', trend: 'up' },
    { crop: 'Mustard', price: 4500, unit: 'quintal', trend: 'up' },
    { crop: 'Jute', price: 4200, unit: 'quintal', trend: 'down' },
    { crop: 'Watermelon', price: 1800, unit: 'quintal', trend: 'stable' }
  ];

  const relevantPrices = [];
  for (const crop of crops) {
    const matchingPrice = mockPriceData.find(item => item.crop === crop);
    if (matchingPrice) {
      relevantPrices.push(matchingPrice);
    }
  }
  
  return relevantPrices.length > 0 ? relevantPrices : [
    { crop: 'Generic', price: 0, unit: 'quintal', trend: 'stable', note: 'Check local Mandi prices or agricultural department for current rates' }
  ];
};

const generateSoilTestingRecommendations = (soilType) => {
  const recommendations = {
    clay: 'Recommended tests: pH, organic matter content, CEC (Cation Exchange Capacity), and nutrient levels (NPK). Clay soils often have high CEC but may have drainage issues. Test for micronutrients like zinc and iron.',
    sandy: 'Recommended tests: organic matter content, water-holding capacity, pH, and complete nutrient profile. Sandy soils often have low nutrient retention, so regular testing is important. Focus on micronutrient levels, especially zinc, iron, and manganese.',
    loamy: 'Recommended tests: standard nutrient analysis (NPK), pH, organic matter content. Loamy soils are generally balanced but regular testing helps maintain optimal fertility. Consider seasonal testing to adjust fertilizer applications.',
    black: 'Recommended tests: pH, calcium and magnesium levels, zinc deficiency, and salinity. Black soils can develop salinity issues and often have micronutrient deficiencies despite high fertility.',
    red: 'Recommended tests: pH (often acidic), iron content, phosphorus fixation capacity, and aluminum toxicity. Red soils may need lime application based on pH test results. Check for micronutrient deficiencies.'
  };

  return recommendations[soilType] || 'Recommended tests: pH, NPK levels, organic matter content, and micronutrients. Contact your nearest Krishi Vigyan Kendra (KVK) or agricultural university for soil testing services.';
};

module.exports = {
  createAdvisory,
  getAdvisories,
  getAdvisoryById,
  updateAdvisory,
  deleteAdvisory
}; 