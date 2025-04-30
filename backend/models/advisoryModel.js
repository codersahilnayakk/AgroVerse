const mongoose = require('mongoose');

const advisorySchema = mongoose.Schema(
  {
    soilType: {
      type: String,
      required: [true, 'Please specify soil type'],
    },
    season: {
      type: String,
      required: [true, 'Please specify season'],
    },
    waterLevel: {
      type: String,
      required: [true, 'Please specify water level'],
    },
    recommendedCrops: {
      type: [String],
      default: [],
    },
    fertilizerTips: {
      type: String,
      default: '',
    },
    soilManagementTips: {
      type: String,
      default: '',
    },
    irrigationStrategy: {
      type: String,
      default: '',
    },
    cropVarieties: {
      type: [{
        cropName: String,
        varieties: [String]
      }],
      default: [],
    },
    sowingHarvestingCalendar: {
      type: String,
      default: '',
    },
    applicableSchemes: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'Scheme',
      default: [],
    },
    marketPriceTrends: {
      type: [{
        crop: String,
        price: Number,
        unit: String,
        trend: String // 'up', 'down', 'stable'
      }],
      default: [],
    },
    soilTestingRecommendations: {
      type: String,
      default: '',
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Advisory', advisorySchema); 