const asyncHandler = require('express-async-handler');
const { validationResult } = require('express-validator');
const Advisory = require('../models/advisoryModel');
const UserAdvisory = require('../models/userAdvisoryModel');
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

  // First, try to find a matching advisory from existing pre-defined data
  const existingAdvisory = await Advisory.findOne({
    soilType: { $regex: new RegExp(soilType, 'i') }, // Case-insensitive match
    season: { $regex: new RegExp(season, 'i') },
    waterLevel: { $regex: new RegExp(waterLevel, 'i') },
  });

  let userAdvisory;

  if (existingAdvisory) {
    // If found, create a new user advisory using the existing data for this user
    userAdvisory = await UserAdvisory.create({
      soilType,
      season,
      waterLevel,
      recommendedCrops: existingAdvisory.recommendedCrops,
      // Handle both field name formats and keep the original format (array or string)
      fertilizerTips: existingAdvisory.fertilizerRecommendations || existingAdvisory.fertilizerTips,
      fertilizerRecommendations: existingAdvisory.fertilizerRecommendations || existingAdvisory.fertilizerTips,
      soilManagementTips: existingAdvisory.soilManagementTips,
      irrigationStrategy: existingAdvisory.irrigationStrategy,
      cropVarieties: existingAdvisory.cropVarieties,
      sowingHarvestingCalendar: existingAdvisory.sowingHarvestingCalendar,
      marketPriceTrends: existingAdvisory.marketPriceTrends,
      soilTestingRecommendations: existingAdvisory.soilTestingRecommendations,
      governmentSchemes: existingAdvisory.governmentSchemes,
      userId: req.user.id,
      baseAdvisoryId: existingAdvisory._id
    });
  } else {
    // If no match found, fall back to generating recommendations
    const recommendedCrops = generateRecommendations(soilType, season, waterLevel);
    const fertilizerTips = generateFertilizerTips(soilType, recommendedCrops);
    const soilManagementTips = generateSoilManagementTips(soilType, waterLevel);
    const irrigationStrategy = generateIrrigationStrategy(soilType, waterLevel, season);
    const cropVarieties = await generateCropVarieties(recommendedCrops, soilType);
    const sowingHarvestingCalendar = generateSowingHarvestingCalendar(recommendedCrops, season);
    const applicableSchemes = await findApplicableSchemes(soilType, waterLevel);
    const marketPriceTrends = generateMarketPriceTrends(recommendedCrops);
    const soilTestingRecommendations = generateSoilTestingRecommendations(soilType);

    userAdvisory = await UserAdvisory.create({
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
  }

  if (userAdvisory) {
    // Populate the scheme data before returning
    const populatedAdvisory = await UserAdvisory.findById(userAdvisory._id)
      .populate('applicableSchemes', 'name department');
    
    res.status(201).json(populatedAdvisory);
  } else {
    res.status(400);
    throw new Error('Invalid advisory data');
  }
});

// @desc    Get all advisories for a user
// @route   GET /api/advisory
// @access  Private
const getAdvisories = asyncHandler(async (req, res) => {
  const userAdvisories = await UserAdvisory.find({ userId: req.user.id })
    .populate('applicableSchemes', 'name department')
    .sort({ createdAt: -1 });

  res.status(200).json(userAdvisories);
});

// @desc    Get advisory by ID
// @route   GET /api/advisory/:id
// @access  Private
const getAdvisoryById = asyncHandler(async (req, res) => {
  const userAdvisory = await UserAdvisory.findById(req.params.id)
    .populate('applicableSchemes', 'name department');

  if (!userAdvisory) {
    res.status(404);
    throw new Error('Advisory not found');
  }

  // Make sure the user owns the advisory
  if (userAdvisory.userId.toString() !== req.user.id) {
    res.status(401);
    throw new Error('Not authorized to access this advisory');
  }

  res.status(200).json(userAdvisory);
});

// @desc    Update advisory by ID
// @route   PUT /api/advisory/:id
// @access  Private
const updateAdvisory = asyncHandler(async (req, res) => {
  const userAdvisory = await UserAdvisory.findById(req.params.id);

  if (!userAdvisory) {
    res.status(404);
    throw new Error('Advisory not found');
  }

  // Make sure the user owns the advisory
  if (userAdvisory.userId.toString() !== req.user.id) {
    res.status(401);
    throw new Error('Not authorized to update this advisory');
  }

  const updatedAdvisory = await UserAdvisory.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  ).populate('applicableSchemes', 'name department');

  res.status(200).json(updatedAdvisory);
});

// @desc    Delete advisory by ID
// @route   DELETE /api/advisory/:id
// @access  Private
const deleteAdvisory = asyncHandler(async (req, res) => {
  const userAdvisory = await UserAdvisory.findById(req.params.id);

  if (!userAdvisory) {
    res.status(404);
    throw new Error('Advisory not found');
  }

  // Make sure the user owns the advisory
  if (userAdvisory.userId.toString() !== req.user.id) {
    res.status(401);
    throw new Error('Not authorized to delete this advisory');
  }

  await userAdvisory.deleteOne();

  res.status(200).json({ id: req.params.id });
});

// @desc    Get all available advisory combinations
// @route   GET /api/advisory/combinations
// @access  Public
const getAdvisoryCombinations = asyncHandler(async (req, res) => {
  // Get unique combinations of soil type, season, and water level from pre-defined data
  const combinations = await Advisory.aggregate([
    {
      $group: {
        _id: {
          soilType: "$soilType",
          season: "$season",
          waterLevel: "$waterLevel"
        }
      }
    },
    {
      $project: {
        _id: 0,
        soilType: "$_id.soilType",
        season: "$_id.season",
        waterLevel: "$_id.waterLevel"
      }
    },
    {
      $sort: {
        soilType: 1,
        season: 1,
        waterLevel: 1
      }
    }
  ]);

  // Get unique soil types, seasons, and water levels
  const soilTypes = [...new Set(combinations.map(item => item.soilType))].sort();
  const seasons = [...new Set(combinations.map(item => item.season))].sort();
  const waterLevels = [...new Set(combinations.map(item => item.waterLevel))].sort();

  res.status(200).json({
    combinations,
    soilTypes,
    seasons,
    waterLevels,
    total: combinations.length
  });
});

// @desc    Migrate existing user-specific advisories from Advisory to UserAdvisory
// @route   POST /api/advisory/migrate
// @access  Private (Admin only)
const migrateUserAdvisories = asyncHandler(async (req, res) => {
  // This should be protected by an admin middleware
  // For now, we're just checking if the requesting user has admin rights
  if (!req.user.isAdmin) {
    res.status(401);
    throw new Error('Not authorized to perform this operation');
  }

  try {
    // Find all user-specific advisories (excluding seed data)
    const userSpecificAdvisories = await Advisory.find({ 
      userId: { $exists: true, $ne: null } 
    });

    console.log(`Found ${userSpecificAdvisories.length} user-specific advisories to migrate`);
    
    let migratedCount = 0;
    let errorCount = 0;

    // Migrate each advisory
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
        }
      } catch (err) {
        console.error(`Error migrating advisory ${advisory._id}:`, err);
        errorCount++;
      }
    }

    res.status(200).json({
      message: `Migration completed. Migrated ${migratedCount} advisories with ${errorCount} errors.`
    });
  } catch (error) {
    console.error('Migration error:', error);
    res.status(500);
    throw new Error('Error during migration: ' + error.message);
  }
});

// Recommendation generation functions - used as fallback if no matching data is found
const generateRecommendations = (soilType, season, waterLevel) => {
  // Convert to lowercase for consistent matching
  const soil = soilType.toLowerCase();
  const seasonLC = season.toLowerCase();
  const water = waterLevel.toLowerCase();
  
  // Convert zaid to summer for back-compatibility
  const adjustedSeason = seasonLC === 'zaid' ? 'summer' : seasonLC;

  // Crop database organized by soil type, season, and water level
  const cropRecommendations = {
    alluvial: {
      kharif: {
        high: ['Rice', 'Jute', 'Sugarcane', 'Maize'],
        medium: ['Cotton', 'Soybean', 'Maize', 'Pulses'],
        low: ['Millets', 'Pulses', 'Groundnut', 'Sesame']
      },
      rabi: {
        high: ['Wheat', 'Barley', 'Mustard', 'Potato'],
        medium: ['Wheat', 'Gram', 'Peas', 'Lentil'],
        low: ['Barley', 'Safflower', 'Linseed', 'Chickpea']
      },
      summer: {
        high: ['Rice', 'Vegetables', 'Maize', 'Cucumber'],
        medium: ['Okra', 'Cucumber', 'Pumpkin', 'Bitter Gourd'],
        low: ['Muskmelon', 'Watermelon', 'Sesame', 'Sunflower']
      }
    },
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
    },
    laterite: {
      kharif: {
        high: ['Rice', 'Turmeric', 'Ginger'],
        medium: ['Groundnut', 'Pulses', 'Sweet potato'],
        low: ['Millet', 'Cowpea', 'Horse gram']
      },
      rabi: {
        high: ['Vegetables', 'Tapioca', 'Sweet potato'],
        medium: ['Pulses', 'Mustard', 'Groundnut'],
        low: ['Horse gram', 'Minor millets', 'Safflower']
      },
      summer: {
        high: ['Vegetables', 'Cucurbits', 'Sweet potato'],
        medium: ['Groundnut', 'Green gram', 'Cowpea'],
        low: ['Sesame', 'Minor millets', 'Amaranth']
      }
    },
    mountainous: {
      kharif: {
        high: ['Rice', 'Maize', 'Soybean'],
        medium: ['Millets', 'Pulses', 'Vegetables'],
        low: ['Buckwheat', 'Amaranth', 'Minor millets']
      },
      rabi: {
        high: ['Wheat', 'Barley', 'Vegetables'],
        medium: ['Peas', 'Potatoes', 'Mustard'],
        low: ['Buckwheat', 'Lentil', 'Barley']
      },
      summer: {
        high: ['Vegetables', 'Beans', 'Maize'],
        medium: ['Vegetables', 'Beans', 'Cucurbits'],
        low: ['Buckwheat', 'Amaranth', 'Beans']
      }
    },
    desert: {
      kharif: {
        high: ['Cotton', 'Groundnut', 'Castor'],
        medium: ['Pearl millet', 'Cluster beans', 'Moth bean'],
        low: ['Pearl millet', 'Cluster beans', 'Sesame']
      },
      rabi: {
        high: ['Wheat', 'Gram', 'Mustard'],
        medium: ['Barley', 'Cumin', 'Isabgol'],
        low: ['Barley', 'Cumin', 'Chickpea']
      },
      summer: {
        high: ['Bottle gourd', 'Ridge gourd', 'Watermelon'],
        medium: ['Watermelon', 'Muskmelon', 'Cucumber'],
        low: ['Cluster beans', 'Bottle gourd', 'Pearl millet']
      }
    },
    saline: {
      kharif: {
        high: ['Rice (salt tolerant)', 'Cotton', 'Sugarbeet'],
        medium: ['Sorghum', 'Pearl millet', 'Sesbania'],
        low: ['Pearl millet', 'Cluster beans', 'Sesbania']
      },
      rabi: {
        high: ['Barley', 'Mustard', 'Beet'],
        medium: ['Barley', 'Safflower', 'Spinach'],
        low: ['Barley', 'Mustard', 'Safflower']
      },
      summer: {
        high: ['Salt tolerant grasses', 'Palmarosa', 'Asparagus'],
        medium: ['Salt tolerant grasses', 'Cluster beans', 'Sesbania'],
        low: ['Salt tolerant grasses', 'Cluster beans', 'Palmarosa']
      }
    }
  };

  // Try to find recommendations for the given soil type, season, and water level
  try {
    // First check if we have exact matches
    if (cropRecommendations[soil] && 
        cropRecommendations[soil][adjustedSeason] && 
        cropRecommendations[soil][adjustedSeason][water]) {
      return cropRecommendations[soil][adjustedSeason][water];
    }
    
    // If not, provide generic fallback
    return ['Please consult with local agricultural extension office for specific recommendations'];
  } catch (error) {
    console.error('Error generating crop recommendations:', error);
    return ['Error generating recommendations. Please try again.'];
  }
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
    alluvial: {
      high: 'Ensure good drainage. Implement raised beds during monsoon. Incorporate green manure for soil health. Practice crop rotation to maintain fertility.',
      medium: 'Add organic matter regularly. Maintain optimal soil moisture. Use balanced fertilization. Implement crop rotation with legumes.',
      low: 'Use mulch extensively to conserve moisture. Add organic matter to improve water retention. Practice minimal tillage. Use windbreaks if erosion is a concern.'
    },
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
    },
    laterite: {
      high: 'Add lime to correct acidity. Implement contour bunding to prevent erosion. Add organic manure to improve fertility and water retention.',
      medium: 'Add organic matter and lime regularly. Implement terracing on slopes. Use green manures to improve soil fertility.',
      low: 'Use heavy mulching to prevent moisture loss. Add organic matter to improve water retention. Practice contour farming to reduce runoff.'
    },
    mountainous: {
      high: 'Implement terracing to prevent soil erosion. Maintain vegetation cover. Add organic matter to improve soil structure.',
      medium: 'Practice contour farming. Maintain vegetative cover on slopes. Use organic mulch to prevent erosion and conserve moisture.',
      low: 'Use drought-resistant cover crops. Implement water harvesting techniques. Add organic matter to improve moisture retention.'
    },
    desert: {
      high: 'Add organic matter extensively. Use windbreaks to prevent erosion. Practice mulching to reduce evaporation.',
      medium: 'Add organic matter to improve water retention. Use windbreaks. Practice minimum tillage.',
      low: 'Implement micro-catchment water harvesting. Add organic matter extensively. Use drought-resistant cover crops.'
    },
    saline: {
      high: 'Implement proper drainage to leach salts. Add organic matter to improve soil structure. Consider growing salt-tolerant crops.',
      medium: 'Add gypsum to reclaim sodic soils. Practice proper leaching. Add organic matter to improve soil health.',
      low: 'Use mulch to reduce evaporation and salt accumulation. Practice minimum tillage. Add organic matter to improve soil health.'
    }
  };

  return managementTips[soilType]?.[waterLevel] || 'Add organic matter regularly to improve soil health. Practice crop rotation. Implement soil conservation measures appropriate for your land topography.';
};

const generateIrrigationStrategy = (soilType, waterLevel, season) => {
  // Convert zaid to summer for back-compatibility
  if (season === 'zaid') season = 'summer';
  
  const baseStrategies = {
    alluvial: {
      high: 'Implement proper drainage systems. Use furrow irrigation for most crops. Consider raised beds for sensitive crops. Monitor soil moisture to avoid waterlogging.',
      medium: 'Use sprinkler or basin irrigation methods. Implement irrigation scheduling based on crop stage. Use mulch to conserve moisture.',
      low: 'Consider drip irrigation for efficient water use. Use mulch extensively. Practice deficit irrigation during less critical growth stages.'
    },
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
    },
    laterite: {
      high: 'Use sprinkler or drip irrigation. Implement drainage during heavy rainfall periods. Add organic matter to improve water retention.',
      medium: 'Use drip irrigation systems. Apply mulch to reduce evaporation. Schedule irrigation based on crop growth stage.',
      low: 'Use micro-irrigation systems. Implement water harvesting techniques. Add organic matter to improve water retention capacity.'
    },
    mountainous: {
      high: 'Use gravity-based irrigation systems where possible. Implement proper drainage on slopes. Consider contour farming with irrigation channels.',
      medium: 'Use drip or sprinkler systems. Implement water harvesting on slopes. Schedule irrigation based on growth stages.',
      low: 'Use micro-irrigation systems. Harvest rainwater efficiently. Practice deficit irrigation based on critical growth stages.'
    },
    desert: {
      high: 'Use highly efficient drip irrigation. Schedule irrigation for evening or early morning. Use mulch extensively to prevent evaporation.',
      medium: 'Use drip irrigation with precise scheduling. Apply mulch extensively. Consider subsurface irrigation where feasible.',
      low: 'Use sub-surface drip irrigation. Implement extensive water harvesting systems. Practice regulated deficit irrigation.'
    },
    saline: {
      high: 'Use furrow irrigation with proper drainage to leach salts. Add organic matter to improve water penetration. Monitor salinity levels regularly.',
      medium: 'Use sprinkler or drip systems with slightly excess water for leaching. Schedule irrigation to maintain optimal soil moisture.',
      low: 'Use highly efficient drip systems. Practice leaching irrigation occasionally. Add mulch to reduce evaporation and salt accumulation.'
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
      alluvial: ['Pusa Basmati-1', 'MTU-7029', 'Swarna Sub-1'],
      clay: ['Swarna', 'IR-64', 'MTU-7029'],
      loamy: ['IR-36', 'Pusa Basmati-1', 'HMT'],
      red: ['ADT 43', 'CO 51', 'BPT 5204'],
      laterite: ['Jaya', 'Jyothi', 'Uma']
    },
    'Wheat': {
      default: ['HD-2967', 'PBW-550', 'WH-542'],
      alluvial: ['HD-3086', 'DBW-187', 'PBW-550'],
      black: ['GW-322', 'HD-2967', 'LOK-1'],
      loamy: ['HD-3086', 'PBW-723', 'WH-1105'],
      red: ['HI-1544', 'HW-2044', 'HD-2967']
    },
    'Maize': {
      default: ['DHM-117', 'Ganga Safed-2', 'Pusa HM-4'],
      alluvial: ['DHM-121', 'Vivek QPM 9', 'Pusa HM-4'],
      loamy: ['DHM-117', 'PRO-311', 'DKC-9081'],
      red: ['NAH-2049', 'COH(M)-5', 'HQPM-1'],
      laterite: ['NAH-1137', 'COH(M)-6', 'Vivek Hybrid 45']
    },
    'Groundnut': {
      default: ['GG-20', 'TAG-24', 'JL-24'],
      sandy: ['TG-37A', 'GJG-9', 'GG-20'],
      red: ['K-6', 'TAG-24', 'TMV-7'],
      laterite: ['TAG-24', 'TG-37A', 'VRI-6']
    },
    'Cotton': {
      default: ['Suraj', 'NH-615', 'H-1098'],
      black: ['Suraj', 'Ajeet-155', 'RCH-659'],
      loamy: ['DCH-32', 'LH-1556', 'NHH-44'],
      alluvial: ['LH-2076', 'H-1236', 'RS-875'],
      red: ['Suraj', 'MCU-5', 'Bunny BG-II']
    },
    'Millet': {
      default: ['HHB-67', 'ICTP-8203', 'ICMV-221'],
      sandy: ['ICTP-8203', 'HHB-67 Improved', 'Pusa-383'],
      red: ['CO-9', 'HHB-67', 'ICMV-221'],
      laterite: ['CO 10', 'GPU 28', 'PR 202'],
      desert: ['HHB-67 Improved', 'RHB-173', 'MPMH-17']
    },
    'Sugarcane': {
      default: ['CO-86032', 'CoC-671', 'BO-91'],
      alluvial: ['CO-0238', 'CoS-767', 'CoJ-64'],
      clay: ['CO-86032', 'CoM-0265', 'CO-99004'],
      loamy: ['CoC-671', 'PI-96603', 'CO-86032'],
      red: ['CO-86032', 'CoC 24', 'CO 8371']
    },
    'Vegetables': {
      default: ['Local varieties appropriate for the season']
    },
    'Pulses': {
      default: ['Local varieties appropriate for the region'],
      alluvial: ['Urdbean (IPU-94-1)', 'Moongbean (IPM-02-03)', 'Pigeonpea (UPAS-120)'],
      black: ['Pigeonpea (BDN-711)', 'Chickpea (JG-11)', 'Lentil (L-4147)'],
      red: ['Blackgram (T-9)', 'Greengram (CO-8)', 'Pigeonpea (LRG-41)'],
      laterite: ['Cowpea (Pusa Komal)', 'Horsegram (PHG-9)', 'Blackgram (LBG 752)']
    },
    'Watermelon': {
      default: ['Sugar Baby', 'Durgapura Kesar', 'Arka Jyoti'],
      sandy: ['Sugar Baby', 'Charleston Gray', 'Arka Manik'],
      desert: ['Sugar Baby', 'A-1', 'Durgapura Meetha']
    },
    'Jute': {
      default: ['JRO-524', 'JRO-204', 'IRA'],
      alluvial: ['JRO-524', 'JRO-204', 'JRO-8432'],
      clay: ['JRO-524', 'S-19', 'JRO-632']
    },
    'Soybean': {
      default: ['JS-335', 'JS-9305', 'JS-9560'],
      black: ['JS-335', 'JS-9560', 'NRC-37'],
      alluvial: ['JS 97-52', 'Pusa 16', 'JS-335']
    },
    'Chickpea': {
      default: ['JG-11', 'JAKI 9218', 'KAK 2'],
      black: ['JG-11', 'JAKI 9218', 'Pusa 372'],
      loamy: ['Pusa 372', 'HC-1', 'GNG-1581'],
      alluvial: ['Pusa 362', 'DCP 92-3', 'GNG-1581'],
      red: ['JG-74', 'ICCV 10', 'CO 4']
    },
    'Mustard': {
      default: ['Pusa Bold', 'Varuna', 'RH-749'],
      alluvial: ['Pusa Bold', 'RH-749', 'PM-30'],
      black: ['Varuna', 'Pusa Bold', 'GM-2'],
      loamy: ['RH-749', 'Pusa Bold', 'Kranti']
    },
    'Sunflower': {
      default: ['KBSH-53', 'KBSH-44', 'DRSH-1'],
      black: ['KBSH-44', 'DRSH-1', 'NDSH-1'],
      red: ['CO 4', 'KBSH-1', 'KBSH-53']
    },
    'Sesame': {
      default: ['GT-10', 'HT-1', 'RT-346'],
      red: ['TMV 7', 'CO 1', 'VRI 1'],
      black: ['GT-10', 'HT-1', 'RT-346'],
      laterite: ['VRI 3', 'TMV 3', 'SVPR 1']
    }
  };

  const result = [];
  
  for (const crop of recommendedCrops) {
    const cropEntry = {
      cropName: crop,
      varieties: varietiesDatabase[crop]?.[soilType] || varietiesDatabase[crop]?.default || ['Local varieties appropriate for your region']
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
    alluvial: 'Recommended tests: pH, organic matter content, NPK, and micronutrients (especially zinc). Alluvial soils are typically fertile but need regular monitoring to maintain productivity. Test for salinity in river delta regions.',
    clay: 'Recommended tests: pH, organic matter content, CEC (Cation Exchange Capacity), and nutrient levels (NPK). Clay soils often have high CEC but may have drainage issues. Test for micronutrients like zinc and iron.',
    sandy: 'Recommended tests: organic matter content, water-holding capacity, pH, and complete nutrient profile. Sandy soils often have low nutrient retention, so regular testing is important. Focus on micronutrient levels, especially zinc, iron, and manganese.',
    loamy: 'Recommended tests: standard nutrient analysis (NPK), pH, organic matter content. Loamy soils are generally balanced but regular testing helps maintain optimal fertility. Consider seasonal testing to adjust fertilizer applications.',
    black: 'Recommended tests: pH, calcium and magnesium levels, zinc deficiency, and salinity. Black soils can develop salinity issues and often have micronutrient deficiencies despite high fertility.',
    red: 'Recommended tests: pH (often acidic), iron content, phosphorus fixation capacity, and aluminum toxicity. Red soils may need lime application based on pH test results. Check for micronutrient deficiencies.',
    laterite: 'Recommended tests: pH (usually acidic), aluminum saturation, iron/manganese levels, and organic matter content. Laterite soils typically need lime application and organic matter improvement. Test for micronutrient deficiencies.',
    mountainous: 'Recommended tests: pH, organic matter, available phosphorus, and erosion potential assessment. Mountain soils vary widely based on altitude and slope. Consider testing for micronutrients specific to your crops.',
    desert: 'Recommended tests: pH, salinity, sodium content, and water infiltration rate. Desert soils often have salt accumulation and need special management. Test for calcium and gypsum requirements.',
    saline: 'Recommended tests: electrical conductivity (EC), sodium adsorption ratio (SAR), pH, and gypsum requirement. Saline soils need specialized reclamation strategies based on test results. Monitor salt levels regularly.'
  };

  return recommendations[soilType] || 'Recommended tests: pH, NPK levels, organic matter content, and micronutrients. Contact your nearest Krishi Vigyan Kendra (KVK) or agricultural university for soil testing services.';
};

module.exports = {
  createAdvisory,
  getAdvisories,
  getAdvisoryById,
  updateAdvisory,
  deleteAdvisory,
  getAdvisoryCombinations,
  migrateUserAdvisories
}; 