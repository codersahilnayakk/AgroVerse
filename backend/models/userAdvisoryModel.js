const mongoose = require('mongoose');

const userAdvisorySchema = mongoose.Schema(
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
    region: {
      type: String,
      default: '',
    },
    recommendedCrops: {
      type: [String],
      default: [],
    },
    fertilizerTips: {
      type: String,
      default: '',
    },
    fertilizerRecommendations: {
      type: String,
      default: '',
    },
    soilManagementTips: {
      type: mongoose.Schema.Types.Mixed,
      default: [],
    },
    irrigationStrategy: {
      type: mongoose.Schema.Types.Mixed,
      default: [],
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
    governmentSchemes: {
      type: [String],
      default: [],
    },
    marketPriceTrends: {
      type: mongoose.Schema.Types.Mixed,
      default: '',
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
    baseAdvisoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Advisory',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

userAdvisorySchema.pre('save', function(next) {
  if (this.fertilizerRecommendations && !this.fertilizerTips) {
    this.fertilizerTips = this.fertilizerRecommendations;
  }
  else if (this.fertilizerTips && !this.fertilizerRecommendations) {
    this.fertilizerRecommendations = this.fertilizerTips;
  }
  next();
});

module.exports = mongoose.model('UserAdvisory', userAdvisorySchema); 