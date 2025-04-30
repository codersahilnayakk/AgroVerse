import axios from 'axios';

const API_URL = '/api/advisory';

/**
 * Create a new advisory
 * @param {Object} advisoryData - The advisory data
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} Created advisory
 */
const createAdvisory = async (advisoryData, token) => {
  // Check if token exists
  if (!token) {
    throw new Error('Authentication token is required');
  }

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await axios.post(API_URL, advisoryData, config);
    return response.data;
  } catch (error) {
    console.error('Create advisory error:', error);
    throw error;
  }
};

/**
 * Get user advisories
 * @param {string} token - Authentication token
 * @returns {Promise<Array>} User advisories
 */
const getAdvisories = async (token) => {
  // Check if token exists
  if (!token) {
    throw new Error('Authentication token is required');
  }

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await axios.get(API_URL, config);
    return response.data;
  } catch (error) {
    console.error('Get advisories error:', error);
    throw error;
  }
};

/**
 * Get advisory by ID
 * @param {string} advisoryId - The advisory ID
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} Advisory details
 */
const getAdvisoryById = async (advisoryId, token) => {
  // Check if token exists
  if (!token) {
    throw new Error('Authentication token is required');
  }

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await axios.get(`${API_URL}/${advisoryId}`, config);
    return response.data;
  } catch (error) {
    console.error('Get advisory by ID error:', error);
    throw error;
  }
};

/**
 * Delete advisory
 * @param {string} advisoryId - The advisory ID to delete
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} Response data
 */
const deleteAdvisory = async (advisoryId, token) => {
  // Check if token exists
  if (!token) {
    throw new Error('Authentication token is required');
  }

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await axios.delete(`${API_URL}/${advisoryId}`, config);
    return response.data;
  } catch (error) {
    console.error('Delete advisory error:', error);
    throw error;
  }
};

// Mock data for advisories
let advisories = [
  {
    _id: '1',
    soilType: 'alluvial',
    season: 'kharif',
    waterLevel: 'high',
    recommendedCrops: ['Rice', 'Jute', 'Sugarcane'],
    fertilizerTips: 'Use nitrogen-rich fertilizers and maintain proper water levels. Add organic matter to improve soil structure.',
    userId: '1',
    createdAt: '2023-06-15T09:30:00.000Z'
  },
  {
    _id: '2',
    soilType: 'black',
    season: 'rabi',
    waterLevel: 'medium',
    recommendedCrops: ['Wheat', 'Chickpea', 'Safflower'],
    fertilizerTips: 'Use balanced fertilizers. These soils are nutrient-rich but need proper management.',
    userId: '1',
    createdAt: '2023-05-10T11:20:00.000Z'
  },
  {
    _id: '3',
    soilType: 'red',
    season: 'zaid',
    waterLevel: 'low',
    recommendedCrops: ['Watermelon', 'Muskmelon', 'Groundnut'],
    fertilizerTips: 'Apply drought-resistant varieties. Use phosphorus and potassium rich fertilizers with mulch to prevent water loss.',
    userId: '1',
    createdAt: '2023-04-22T14:15:00.000Z'
  }
];

// Comprehensive crop recommendations based on soil type, season, and water level
const cropRecommendations = {
  alluvial: {
    kharif: {
      high: {
        crops: ['Rice', 'Jute', 'Sugarcane', 'Maize'],
        tips: 'Use nitrogen-rich fertilizers like Urea (80-100 kg/acre) and maintain proper water levels. Add organic matter like Farmyard Manure (4-5 tons/acre) to improve soil structure.'
      },
      medium: {
        crops: ['Cotton', 'Soybean', 'Maize', 'Pulses'],
        tips: 'Apply balanced NPK 12:32:16 (75 kg/acre) and Zinc Sulfate (10 kg/acre). Ensure proper drainage to prevent waterlogging during heavy rains.'
      },
      low: {
        crops: ['Millets', 'Pulses', 'Groundnut', 'Sesame'],
        tips: 'Add Vermicompost (2 tons/acre) before sowing. Apply SSP (60 kg/acre) at planting. Use Potassium Sulfate (25 kg/acre) for drought resistance. Mulch to reduce water evaporation.'
      }
    },
    rabi: {
      high: {
        crops: ['Wheat', 'Barley', 'Mustard', 'Potato'],
        tips: 'Apply DAP (50 kg/acre) at sowing and Muriate of Potash (30 kg/acre). Top dress with Urea (40-50 kg/acre) 30 days after sowing. Monitor for root diseases in wet conditions.'
      },
      medium: {
        crops: ['Wheat', 'Gram', 'Peas', 'Lentil'],
        tips: 'Use NPK 10:26:26 (60 kg/acre) at sowing. Add well-rotted compost (3 tons/acre) for better results. For legumes, apply Rhizobium culture for nitrogen fixation.'
      },
      low: {
        crops: ['Barley', 'Safflower', 'Linseed', 'Chickpea'],
        tips: 'Apply water-soluble fertilizers like 19:19:19 NPK (30 kg/acre). Use minimal irrigation with DAP (40 kg/acre) at critical growth stages. Add Calcium Nitrate (15 kg/acre) for stress tolerance.'
      }
    },
    zaid: {
      high: {
        crops: ['Rice', 'Vegetables', 'Maize', 'Cucumber'],
        tips: 'Regular fertilization with Urea (split application, 70 kg/acre total). Apply Micronutrient mixture containing Zinc, Boron and Iron. Maintain moisture for good yield.'
      },
      medium: {
        crops: ['Okra', 'Cucumber', 'Pumpkin', 'Bitter Gourd'],
        tips: 'Use NPK 20:20:20 (40 kg/acre) and Vermicompost (2 tons/acre). Add Calcium Ammonium Nitrate (30 kg/acre) during flowering. Mulch to reduce watering frequency.'
      },
      low: {
        crops: ['Muskmelon', 'Watermelon', 'Sesame', 'Sunflower'],
        tips: 'Apply DAP (30 kg/acre) and Potassium Sulfate (25 kg/acre). Use Hydrogel (3 kg/acre) for water retention. Use drip irrigation with water-soluble fertilizers for efficiency.'
      }
    }
  },
  black: {
    kharif: {
      high: {
        crops: ['Cotton', 'Soybean', 'Pigeon Pea', 'Maize'],
        tips: 'Apply NPK 14:35:14 (60 kg/acre) and Gypsum (200 kg/acre) to improve drainage. Use Zinc Sulfate (10 kg/acre) as these soils are often deficient in zinc.'
      },
      medium: {
        crops: ['Cotton', 'Sorghum', 'Maize', 'Pigeon Pea'],
        tips: 'Apply DAP (50 kg/acre) at sowing and Ammonium Sulfate (40 kg/acre) as top dressing. These soils hold nutrients well but need proper drainage to avoid waterlogging.'
      },
      low: {
        crops: ['Sorghum', 'Pearl Millet', 'Pulses', 'Castor'],
        tips: 'Apply SSP (40 kg/acre) and Farmyard Manure (3 tons/acre) to improve soil structure. Use Potassium Chloride (25 kg/acre) for drought resistance. Minimal tillage recommended to prevent soil cracking.'
      }
    },
    rabi: {
      high: {
        crops: ['Wheat', 'Gram', 'Sunflower', 'Mustard'],
        tips: 'Apply DAP (50 kg/acre) and Potassium Sulfate (25 kg/acre). Add Zinc Sulfate (8 kg/acre). Monitor soil moisture as these soils can become waterlogged or crack when dry.'
      },
      medium: {
        crops: ['Wheat', 'Chickpea', 'Safflower', 'Linseed'],
        tips: 'Use NPK 12:32:16 (50 kg/acre) at sowing. Apply Compost (2-3 tons/acre) to improve soil structure. For chickpea, use Rhizobium inoculant for better nodulation.'
      },
      low: {
        crops: ['Gram', 'Safflower', 'Linseed', 'Mustard'],
        tips: 'Apply SSP (40 kg/acre) and Muriate of Potash (20 kg/acre). Use water conservation techniques and hydrogel (2 kg/acre). Choose drought-resistant varieties.'
      }
    },
    zaid: {
      high: {
        crops: ['Sesame', 'Millet', 'Vegetables', 'Green Gram'],
        tips: 'Apply NPK 20:20:0 (40 kg/acre) and Magnesium Sulfate (15 kg/acre). Ensure good drainage in these heavy soils by adding Gypsum (150 kg/acre) before planting.'
      },
      medium: {
        crops: ['Sesame', 'Sunflower', 'Green Gram', 'Black Gram'],
        tips: 'Use NPK 10:26:26 (45 kg/acre) and Vermicompost (2 tons/acre) for better soil structure and water retention. Add Calcium Nitrate (20 kg/acre) during flowering.'
      },
      low: {
        crops: ['Sesame', 'Cluster Beans', 'Moth Bean', 'Cowpea'],
        tips: 'Apply DAP (30 kg/acre) and Potassium Sulfate (20 kg/acre). Use mulch to reduce evaporation and soil cracking. Add PSB (Phosphate Solubilizing Bacteria) for better phosphorus availability.'
      }
    }
  },
  red: {
    kharif: {
      high: {
        crops: ['Rice', 'Maize', 'Vegetables', 'Groundnut'],
        tips: 'Apply Urea (70 kg/acre) in split doses and DAP (50 kg/acre). Add Farmyard Manure (4 tons/acre) as these soils need regular nutrient inputs due to their low fertility.'
      },
      medium: {
        crops: ['Pulses', 'Groundnut', 'Millet', 'Sorghum'],
        tips: 'Use NPK 10:26:26 (50 kg/acre) with emphasis on phosphorus. Add Vermicompost (2-3 tons/acre) to improve soil structure and water-holding capacity.'
      },
      low: {
        crops: ['Pearl Millet', 'Pulses', 'Oilseeds', 'Horse Gram'],
        tips: 'Apply Farmyard Manure (3 tons/acre) to improve fertility. Use SSP (35 kg/acre) and Potassium Chloride (15 kg/acre). Minimal tillage recommended to preserve moisture.'
      }
    },
    rabi: {
      high: {
        crops: ['Wheat', 'Vegetables', 'Mustard', 'Potato'],
        tips: 'Apply NPK 15:15:15 (60 kg/acre) and Zinc Sulfate (8 kg/acre). These soils need regular nutrient management and organic inputs like compost (2-3 tons/acre).'
      },
      medium: {
        crops: ['Gram', 'Safflower', 'Vegetables', 'Barley'],
        tips: 'Use SSP (45 kg/acre) and Ammonium Sulfate (30 kg/acre). Add Farmyard Manure (3 tons/acre) for better water retention and nutrient availability.'
      },
      low: {
        crops: ['Gram', 'Safflower', 'Lentil', 'Mustard'],
        tips: 'Apply SSP (35 kg/acre) and Potassium Sulfate (20 kg/acre). Use water conservation practices like mulching. Add VAM (Vesicular Arbuscular Mycorrhiza) for improved phosphorus uptake.'
      }
    },
    zaid: {
      high: {
        crops: ['Vegetables', 'Green Gram', 'Sesame', 'Cucumber'],
        tips: 'Regular application of NPK 20:20:20 (40 kg/acre) and Calcium Nitrate (25 kg/acre). Apply Farmyard Manure (3 tons/acre) to improve soil structure.'
      },
      medium: {
        crops: ['Green Gram', 'Sesame', 'Gourds', 'Cowpea'],
        tips: 'Use DAP (35 kg/acre) and Potassium Chloride (20 kg/acre). Add compost (2 tons/acre) before sowing to improve moisture retention. For legumes, use Rhizobium culture.'
      },
      low: {
        crops: ['Sesame', 'Cluster Beans', 'Watermelon', 'Moth Bean'],
        tips: 'Apply drought-resistant varieties. Use SSP (30 kg/acre) and Potassium Sulfate (20 kg/acre). Apply Hydrogel (2 kg/acre) with mulch for water conservation.'
      }
    }
  },
  laterite: {
    kharif: {
      high: {
        crops: ['Rice', 'Finger Millet', 'Pineapple', 'Turmeric'],
        tips: 'Apply Lime (400 kg/acre) to reduce acidity. Use Urea (60 kg/acre) and Rock Phosphate (100 kg/acre). Add Zinc and Boron supplements (5 kg/acre) as these soils are often micronutrient deficient.'
      },
      medium: {
        crops: ['Finger Millet', 'Groundnut', 'Sweet Potato', 'Pulses'],
        tips: 'Apply Lime (350 kg/acre) and Farmyard Manure (4 tons/acre). Use NPK 10:26:26 (50 kg/acre) with micronutrient mixture containing Iron, Zinc, and Manganese.'
      },
      low: {
        crops: ['Millets', 'Pulses', 'Cassava', 'Sweet Potato'],
        tips: 'Add Vermicompost (2 tons/acre) to improve water retention. Apply Lime (300 kg/acre) to correct acidity. Use SSP (40 kg/acre) and Micronutrient mixture (5 kg/acre).'
      }
    },
    rabi: {
      high: {
        crops: ['Vegetables', 'Pulses', 'Oilseeds', 'Finger Millet'],
        tips: 'Apply Lime (350 kg/acre) before sowing. Use NPK 17:17:17 (45 kg/acre) with Magnesium Sulfate (20 kg/acre) as these soils are often magnesium deficient.'
      },
      medium: {
        crops: ['Pulses', 'Oilseeds', 'Vegetables', 'Sweet Potato'],
        tips: 'Add Farmyard Manure (3 tons/acre) and Lime (300 kg/acre). Use SSP (40 kg/acre) and Potassium Sulfate (20 kg/acre) with Iron Sulfate (5 kg/acre).'
      },
      low: {
        crops: ['Horse Gram', 'Sweet Potato', 'Millets', 'Lentil'],
        tips: 'Apply drought-resistant varieties. Add Lime (250 kg/acre) and Vermicompost (2 tons/acre) to improve soil structure. Use Rock Phosphate (80 kg/acre) for slow release of phosphorus.'
      }
    },
    zaid: {
      high: {
        crops: ['Vegetables', 'Cucumber', 'Watermelon', 'Sweet Potato'],
        tips: 'Use NPK 20:20:20 (40 kg/acre) with micronutrients. Apply Lime (300 kg/acre) to reduce acidity. Add Calcium Nitrate (25 kg/acre) for vegetable crops.'
      },
      medium: {
        crops: ['Cowpea', 'Cucumber', 'Gourds', 'Vegetables'],
        tips: 'Apply Farmyard Manure (2.5 tons/acre) and Lime (250 kg/acre). Use NPK 12:32:16 (40 kg/acre) with micronutrients and Epsom salt (10 kg/acre) for magnesium.'
      },
      low: {
        crops: ['Watermelon', 'Sweet Potato', 'Cowpea', 'Cluster Beans'],
        tips: 'Use drought-resistant varieties. Apply Lime (200 kg/acre) and Vermicompost (2 tons/acre) to improve water retention. Add Potassium Sulfate (15 kg/acre) for stress tolerance.'
      }
    }
  },
  mountain: {
    kharif: {
      high: {
        crops: ['Rice', 'Maize', 'Finger Millet', 'Vegetables'],
        tips: 'Use terracing and contour bunding. Apply NPK 15:15:15 (50 kg/acre) and Vermicompost (3 tons/acre). Add Dolomite (150 kg/acre) in acidic soils for calcium and magnesium.'
      },
      medium: {
        crops: ['Maize', 'Millets', 'Pulses', 'Vegetables'],
        tips: 'Implement contour farming. Use DAP (45 kg/acre) and Potassium Chloride (20 kg/acre). Add Farmyard Manure (3 tons/acre) to improve soil structure.'
      },
      low: {
        crops: ['Millets', 'Buckwheat', 'Amaranth', 'Pulses'],
        tips: 'Use drought-resistant varieties. Practice water conservation techniques. Apply SSP (35 kg/acre) and Vermicompost (2 tons/acre) with VAM for better phosphorus uptake.'
      }
    },
    rabi: {
      high: {
        crops: ['Wheat', 'Barley', 'Vegetables', 'Potato'],
        tips: 'Apply NPK 12:32:16 (50 kg/acre) with organic matter (3 tons/acre). Use Calcium Ammonium Nitrate (30 kg/acre) as top dressing. Use terracing to prevent soil erosion.'
      },
      medium: {
        crops: ['Wheat', 'Barley', 'Peas', 'Mustard'],
        tips: 'Use NPK 10:26:26 (45 kg/acre) and Farmyard Manure (2.5 tons/acre). Practice contour farming to conserve moisture. For peas, use Rhizobium inoculant.'
      },
      low: {
        crops: ['Barley', 'Buckwheat', 'Gram', 'Lentil'],
        tips: 'Apply drought-resistant varieties. Use SSP (35 kg/acre) and Potassium Sulfate (15 kg/acre). Apply minimal tillage to preserve soil moisture and use mulch.'
      }
    },
    zaid: {
      high: {
        crops: ['Vegetables', 'Maize', 'Beans', 'Cucumber'],
        tips: 'Use NPK 19:19:19 (40 kg/acre) with organic matter. Apply Calcium Nitrate (20 kg/acre) for fruiting vegetables. Implement terracing and proper drainage.'
      },
      medium: {
        crops: ['Vegetables', 'Beans', 'Cucumber', 'Pumpkin'],
        tips: 'Apply DAP (35 kg/acre) and Potassium Sulfate (15 kg/acre). Use Vermicompost (2 tons/acre). Practice contour farming and moisture conservation.'
      },
      low: {
        crops: ['Beans', 'Buckwheat', 'Amaranth', 'Millets'],
        tips: 'Use drought-resistant varieties. Apply Rock Phosphate (60 kg/acre) and Potassium Chloride (15 kg/acre). Use mulch and practice water conservation.'
      }
    }
  },
  desert: {
    kharif: {
      high: {
        crops: ['Pearl Millet', 'Sorghum', 'Cluster Beans', 'Cotton'],
        tips: 'Use drip irrigation. Apply Farmyard Manure (4 tons/acre) to improve soil structure. Use NPK 15:15:15 (40 kg/acre) with Zinc Sulfate (10 kg/acre). Add Hydrogel (3 kg/acre) for water retention.'
      },
      medium: {
        crops: ['Pearl Millet', 'Cluster Beans', 'Moth Bean', 'Sesame'],
        tips: 'Apply Vermicompost (2.5 tons/acre) and NPK 12:32:16 (35 kg/acre). Use Hydrogel (2 kg/acre) for water retention. Apply water conservation techniques like mulching.'
      },
      low: {
        crops: ['Pearl Millet', 'Cluster Beans', 'Moth Bean', 'Sesame'],
        tips: 'Use drought-resistant varieties. Apply SSP (30 kg/acre) and Potassium Sulfate (15 kg/acre). Use Hydrogel (2 kg/acre) with mulch and practice minimal tillage.'
      }
    },
    rabi: {
      high: {
        crops: ['Wheat', 'Barley', 'Mustard', 'Cumin'],
        tips: 'Use drip or sprinkler irrigation. Apply NPK 10:26:26 (45 kg/acre) and Vermicompost (3 tons/acre). Add Zinc and Iron supplements (5 kg/acre) as desert soils often lack micronutrients.'
      },
      medium: {
        crops: ['Barley', 'Mustard', 'Cumin', 'Chickpea'],
        tips: 'Use water conservation techniques. Apply SSP (40 kg/acre) and Farmyard Manure (2.5 tons/acre). Add Hydrogel (2 kg/acre) to improve soil structure and water retention.'
      },
      low: {
        crops: ['Barley', 'Mustard', 'Cumin', 'Isabgol'],
        tips: 'Select drought-resistant varieties. Apply SSP (30 kg/acre) and Potassium Chloride (15 kg/acre). Practice minimal tillage and mulching. Use slow-release fertilizers.'
      }
    },
    zaid: {
      high: {
        crops: ['Watermelon', 'Muskmelon', 'Cucumber', 'Vegetables'],
        tips: 'Use drip irrigation. Apply Farmyard Manure (3 tons/acre) and NPK 19:19:19 (35 kg/acre) through fertigation. Add Calcium Nitrate (20 kg/acre) for fruit development.'
      },
      medium: {
        crops: ['Watermelon', 'Muskmelon', 'Cluster Beans', 'Sesame'],
        tips: 'Use water conservation techniques. Apply SSP (35 kg/acre) and Potassium Sulfate (15 kg/acre). Add Hydrogel (2 kg/acre) and mulch to reduce evaporation.'
      },
      low: {
        crops: ['Watermelon', 'Cluster Beans', 'Moth Bean', 'Sesame'],
        tips: 'Select drought-resistant varieties. Use Farmyard Manure (2 tons/acre) and SSP (25 kg/acre). Apply Hydrogel (2 kg/acre) with drip irrigation and mulching.'
      }
    }
  },
  saline: {
    kharif: {
      high: {
        crops: ['Rice', 'Cotton', 'Sorghum', 'Sesbania'],
        tips: 'Apply Gypsum (500 kg/acre) to reduce salinity. Use salt-tolerant varieties and Farmyard Manure (4 tons/acre). Apply DAP (45 kg/acre) and Zinc Sulfate (10 kg/acre).'
      },
      medium: {
        crops: ['Cotton', 'Sorghum', 'Pearl Millet', 'Sesbania'],
        tips: 'Use salt-tolerant varieties. Apply Gypsum (400 kg/acre) and Vermicompost (3 tons/acre) to improve soil structure. Use SSP (40 kg/acre) and Ammonium Sulfate (30 kg/acre).'
      },
      low: {
        crops: ['Pearl Millet', 'Sorghum', 'Cluster Beans', 'Sesbania'],
        tips: 'Select salt and drought-tolerant varieties. Apply Gypsum (350 kg/acre) and Farmyard Manure (2.5 tons/acre). Use Potassium Chloride (20 kg/acre) for stress tolerance.'
      }
    },
    rabi: {
      high: {
        crops: ['Barley', 'Mustard', 'Spinach', 'Beet'],
        tips: 'Use salt-tolerant varieties. Apply Gypsum (450 kg/acre) and leach soil before planting. Use NPK 12:32:16 (40 kg/acre) and supplement with Iron and Zinc (5 kg/acre).'
      },
      medium: {
        crops: ['Barley', 'Mustard', 'Safflower', 'Beet'],
        tips: 'Select salt-tolerant varieties. Apply Gypsum (400 kg/acre) and Farmyard Manure (3 tons/acre). Use SSP (35 kg/acre) and practice adequate drainage.'
      },
      low: {
        crops: ['Barley', 'Safflower', 'Isabgol', 'Mustard'],
        tips: 'Use salt and drought-tolerant varieties. Apply gypsum and practice mulching.'
      }
    },
    zaid: {
      high: {
        crops: ['Spinach', 'Cluster Beans', 'Sesbania', 'Watermelon'],
        tips: 'Use salt-tolerant varieties. Apply Gypsum (400 kg/acre) and ensure proper drainage. Use NPK 20:20:0 (35 kg/acre) and supplement with Magnesium Sulfate (15 kg/acre).'
      },
      medium: {
        crops: ['Cluster Beans', 'Sesbania', 'Watermelon', 'Sesame'],
        tips: 'Select salt-tolerant varieties. Apply Gypsum (350 kg/acre) and Farmyard Manure (2.5 tons/acre). Use SSP (30 kg/acre) and practice mulching.'
      },
      low: {
        crops: ['Cluster Beans', 'Watermelon', 'Sesame', 'Pearl Millet'],
        tips: 'Use salt and drought-tolerant varieties. Apply Gypsum (300 kg/acre) and Vermicompost (2 tons/acre). Add Potassium Chloride (15 kg/acre) and Hydrogel (2 kg/acre) to improve soil conditions.'
      }
    }
  }
};

// Mock advisory service
const advisoryService = {
  // Get all advisories for a user
  getAdvisories: async (token) => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(advisories);
      }, 500);
    });
  },

  // Create a new advisory
  createAdvisory: async (advisoryData, token) => {
    // Get crop recommendations based on input
    const { soilType, season, waterLevel } = advisoryData;
    
    // Check if we have recommendations for this combination
    if (!cropRecommendations[soilType] || 
        !cropRecommendations[soilType][season] || 
        !cropRecommendations[soilType][season][waterLevel]) {
      throw new Error('No recommendations available for this combination of soil, season, and water level');
    }
    
    const recommendation = cropRecommendations[soilType][season][waterLevel];
    
    // Create new advisory
    const newAdvisory = {
      _id: Date.now().toString(),
      ...advisoryData,
      recommendedCrops: recommendation.crops,
      fertilizerTips: recommendation.tips,
      userId: '1',
      createdAt: new Date().toISOString()
    };
    
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        advisories.unshift(newAdvisory);
        resolve(newAdvisory);
      }, 500);
    });
  },

  // Delete an advisory
  deleteAdvisory: async (id, token) => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        advisories = advisories.filter(advisory => advisory._id !== id);
        resolve({ success: true });
      }, 500);
    });
  }
};

export default advisoryService; 