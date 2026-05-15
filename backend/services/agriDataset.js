const SOIL_TYPES = [
  'Alluvial Soil', 'Black Soil', 'Red Soil', 'Sandy Soil', 'Clay Soil', 'Laterite Soil'
];

const SEASONS = ['Kharif', 'Rabi', 'Zaid'];

const WATER_LEVELS = ['Low', 'Medium', 'High'];

const CROP_DATABASE = {
  'Cotton': {
    name: 'Cotton',
    image: '/img/crops/cotton.png',
    suitableSoils: ['Black Soil', 'Alluvial Soil'],
    suitableSeasons: ['Kharif'],
    suitableWater: ['Medium'],
    baseYield: '1.5 - 2.5 tons/hectare',
    waterReq: '700-1200 mm',
    fertilizers: 'N: 100kg/ha, P: 50kg/ha, K: 50kg/ha. Add Zinc Sulphate for black soils.',
    irrigation: 'Drip or Furrow irrigation. Critical at flowering stage.',
    profitability: 'High',
    profitScore: 85,
    diseaseRisks: ['Bollworm', 'Whitefly', 'Leaf Curl Virus'],
    sowingTime: 'May to July',
    harvestDuration: '150 - 180 days',
    weatherInfo: {
      temp: '21°C to 30°C',
      droughtRisk: 'Medium',
      heatSensitivity: 'Low',
      climateRisk: 'Moderate'
    }
  },
  'Soybean': {
    name: 'Soybean',
    image: '/img/crops/soybean.png',
    suitableSoils: ['Black Soil', 'Clay Soil', 'Loamy Soil'],
    suitableSeasons: ['Kharif'],
    suitableWater: ['Medium', 'High'],
    baseYield: '2.0 - 3.0 tons/hectare',
    waterReq: '450-750 mm',
    fertilizers: 'N: 20kg/ha, P: 80kg/ha, K: 40kg/ha. Rhizobium inoculation highly recommended.',
    irrigation: 'Sprinkler or Furrow. Ensure good drainage as it cannot tolerate waterlogging.',
    profitability: 'High',
    profitScore: 80,
    diseaseRisks: ['Rust', 'Yellow Mosaic Virus', 'Stem Rot'],
    sowingTime: 'June to July',
    harvestDuration: '90 - 120 days',
    weatherInfo: {
      temp: '25°C to 30°C',
      droughtRisk: 'Low',
      heatSensitivity: 'High',
      climateRisk: 'Low'
    }
  },
  'Maize': {
    name: 'Maize',
    image: '/img/crops/maize.png',
    suitableSoils: ['Alluvial Soil', 'Red Soil', 'Loamy Soil', 'Black Soil'],
    suitableSeasons: ['Kharif', 'Rabi', 'Zaid'],
    suitableWater: ['Medium', 'High'],
    baseYield: '4.0 - 5.5 tons/hectare',
    waterReq: '500-800 mm',
    fertilizers: 'N: 120kg/ha, P: 60kg/ha, K: 40kg/ha. Requires high nitrogen.',
    irrigation: 'Furrow or Sprinkler. Extremely sensitive to water stress during tasseling.',
    profitability: 'Medium',
    profitScore: 70,
    diseaseRisks: ['Fall Armyworm', 'Stalk Rot', 'Leaf Blight'],
    sowingTime: 'June-July (Kharif), Oct-Nov (Rabi)',
    harvestDuration: '90 - 110 days',
    weatherInfo: {
      temp: '21°C to 27°C',
      droughtRisk: 'High',
      heatSensitivity: 'Medium',
      climateRisk: 'Moderate'
    }
  },
  'Wheat': {
    name: 'Wheat',
    image: '/img/crops/wheat.png',
    suitableSoils: ['Alluvial Soil', 'Black Soil', 'Clay Soil'],
    suitableSeasons: ['Rabi'],
    suitableWater: ['Medium', 'High'],
    baseYield: '3.5 - 5.0 tons/hectare',
    waterReq: '450-650 mm',
    fertilizers: 'N: 120kg/ha, P: 60kg/ha, K: 40kg/ha.',
    irrigation: 'Check Basin or Border Strip. Needs 4-6 irrigations at critical stages.',
    profitability: 'Medium',
    profitScore: 75,
    diseaseRisks: ['Rust', 'Karnal Bunt', 'Aphids'],
    sowingTime: 'November',
    harvestDuration: '120 - 150 days',
    weatherInfo: {
      temp: '15°C to 25°C',
      droughtRisk: 'Medium',
      heatSensitivity: 'High (at grain filling)',
      climateRisk: 'Moderate'
    }
  },
  'Rice': {
    name: 'Rice',
    image: '/img/crops/rice.png',
    suitableSoils: ['Clay Soil', 'Alluvial Soil', 'Laterite Soil'],
    suitableSeasons: ['Kharif'],
    suitableWater: ['High'],
    baseYield: '4.0 - 6.0 tons/hectare',
    waterReq: '1200-2000 mm',
    fertilizers: 'N: 100kg/ha, P: 50kg/ha, K: 50kg/ha. Zinc is crucial.',
    irrigation: 'Flood irrigation or alternate wetting and drying (AWD).',
    profitability: 'Medium',
    profitScore: 70,
    diseaseRisks: ['Blast', 'Brown Spot', 'Stem Borer'],
    sowingTime: 'June',
    harvestDuration: '120 - 150 days',
    weatherInfo: {
      temp: '22°C to 32°C',
      droughtRisk: 'Very High',
      heatSensitivity: 'Low',
      climateRisk: 'High'
    }
  },
  'Groundnut': {
    name: 'Groundnut',
    image: '/img/crops/groundnut.png',
    suitableSoils: ['Sandy Soil', 'Red Soil'],
    suitableSeasons: ['Kharif', 'Rabi'],
    suitableWater: ['Low', 'Medium'],
    baseYield: '1.5 - 2.0 tons/hectare',
    waterReq: '500-700 mm',
    fertilizers: 'N: 20kg/ha, P: 50kg/ha, K: 40kg/ha. Gypsum is essential for pod formation.',
    irrigation: 'Sprinkler. Stop watering 15 days before harvest.',
    profitability: 'High',
    profitScore: 85,
    diseaseRisks: ['Tikka Disease', 'White Grub', 'Collar Rot'],
    sowingTime: 'June to July',
    harvestDuration: '100 - 120 days',
    weatherInfo: {
      temp: '25°C to 30°C',
      droughtRisk: 'Low',
      heatSensitivity: 'Medium',
      climateRisk: 'Low'
    }
  },
  'Sugarcane': {
    name: 'Sugarcane',
    image: '/img/crops/sugarcane.png',
    suitableSoils: ['Alluvial Soil', 'Black Soil'],
    suitableSeasons: ['Kharif', 'Rabi', 'Zaid'],
    suitableWater: ['High'],
    baseYield: '70 - 100 tons/hectare',
    waterReq: '1500-2500 mm',
    fertilizers: 'N: 250kg/ha, P: 100kg/ha, K: 100kg/ha.',
    irrigation: 'Furrow irrigation. Needs consistent moisture.',
    profitability: 'High',
    profitScore: 90,
    diseaseRisks: ['Red Rot', 'Shoot Borer', 'Termites'],
    sowingTime: 'Feb-March or Oct-Nov',
    harvestDuration: '10 - 14 months',
    weatherInfo: {
      temp: '20°C to 35°C',
      droughtRisk: 'High',
      heatSensitivity: 'Low',
      climateRisk: 'Low'
    }
  },
  'Mustard': {
    name: 'Mustard',
    image: '/img/crops/mustard.png',
    suitableSoils: ['Alluvial Soil', 'Sandy Soil', 'Loamy Soil'],
    suitableSeasons: ['Rabi'],
    suitableWater: ['Low'],
    baseYield: '1.5 - 2.5 tons/hectare',
    waterReq: '250-400 mm',
    fertilizers: 'N: 80kg/ha, P: 40kg/ha, K: 40kg/ha. Sulphur is essential.',
    irrigation: 'Sprinkler. 1-2 irrigations sufficient.',
    profitability: 'High',
    profitScore: 82,
    diseaseRisks: ['Aphids', 'White Rust', 'Alternaria Blight'],
    sowingTime: 'October',
    harvestDuration: '110 - 140 days',
    weatherInfo: {
      temp: '10°C to 25°C',
      droughtRisk: 'Low',
      heatSensitivity: 'High',
      climateRisk: 'Low'
    }
  },
  'Pearl Millet': {
    name: 'Pearl Millet',
    image: '/img/crops/pearl-millet.png',
    suitableSoils: ['Sandy Soil', 'Red Soil', 'Desert Soil'],
    suitableSeasons: ['Kharif', 'Zaid'],
    suitableWater: ['Low'],
    baseYield: '1.5 - 2.0 tons/hectare',
    waterReq: '250-350 mm',
    fertilizers: 'N: 60kg/ha, P: 30kg/ha.',
    irrigation: 'Rainfed primarily. Drip if needed.',
    profitability: 'Medium',
    profitScore: 65,
    diseaseRisks: ['Downy Mildew', 'Ergot'],
    sowingTime: 'July',
    harvestDuration: '80 - 90 days',
    weatherInfo: {
      temp: '25°C to 35°C',
      droughtRisk: 'Very Low',
      heatSensitivity: 'Very Low',
      climateRisk: 'Low'
    }
  }
};

const generateAIRecommendations = (soil, season, water, region) => {
  let matches = [];
  
  Object.values(CROP_DATABASE).forEach(crop => {
    let score = 0;
    let matchReasons = [];
    
    if (crop.suitableSoils.includes(soil)) {
      score += 40;
      matchReasons.push('Highly compatible soil type');
    }
    
    if (crop.suitableSeasons.includes(season)) {
      score += 30;
      matchReasons.push(`Ideal for ${season} season`);
    }
    
    if (crop.suitableWater.includes(water)) {
      score += 30;
      matchReasons.push('Matches available water resources');
    } else if (water === 'High' && crop.suitableWater.includes('Medium')) {
      score += 15;
      matchReasons.push('Sufficient water available');
    }
    
    if (region === 'Maharashtra' && crop.name === 'Cotton') score += 10;
    if (region === 'Punjab' && crop.name === 'Wheat') score += 10;
    if (region === 'Gujarat' && crop.name === 'Groundnut') score += 10;
    if (region === 'Uttar Pradesh' && crop.name === 'Sugarcane') score += 10;
    
    if (score >= 60) {
      matches.push({
        ...crop,
        suitabilityScore: Math.min(score, 99),
        matchReasons
      });
    }
  });
  
  matches.sort((a, b) => b.suitabilityScore - a.suitabilityScore);
  
  let insights = [];
  if (matches.length > 0) {
    const topCrop = matches[0];
    insights.push(`Your ${soil.toLowerCase()} is highly suitable for ${topCrop.name} cultivation with a ${topCrop.suitabilityScore}% match.`);
    if (water === 'Low') insights.push('Since water availability is low, we highly recommend setting up drip irrigation systems to maximize yield.');
    if (season === 'Kharif') insights.push('Current monsoon conditions favor pest growth. Monitor crops closely for early signs of disease.');
  } else {
    insights.push('Your specific combination is challenging. Consider soil amendments or changing water availability.');
  }
  
  return { crops: matches, insights };
};

module.exports = {
  SOIL_TYPES,
  SEASONS,
  WATER_LEVELS,
  CROP_DATABASE,
  generateAIRecommendations
};
