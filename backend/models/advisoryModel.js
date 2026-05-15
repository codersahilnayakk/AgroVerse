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
    waterAvailability: {
      type: String,
      default: '',
    },
    // Legacy field
    waterLevel: {
      type: String,
    },
    region: {
      type: String,
      default: '',
    },
    recommendedCrops: {
      type: [String],
      default: [],
    },
    fertilizers: {
      type: String,
      default: '',
    },
    // Legacy fields for backward compatibility
    fertilizerTips: {
      type: String,
      default: '',
    },
    fertilizerRecommendations: {
      type: String,
      default: '',
    },
    irrigationMethod: {
      type: String,
      default: '',
    },
    weatherCondition: {
      type: String,
      default: '',
    },
    profitability: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Very High', ''],
      default: '',
    },
    diseaseRisk: {
      type: [String],
      default: [],
    },
    sowingTime: {
      type: String,
      default: '',
    },
    harvestDuration: {
      type: String,
      default: '',
    },
    // Extended fields from existing model
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
      required: false,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// Sync legacy/new fields
advisorySchema.pre('save', function (next) {
  // Sync waterLevel <-> waterAvailability
  if (this.waterAvailability && !this.waterLevel) this.waterLevel = this.waterAvailability;
  if (this.waterLevel && !this.waterAvailability) this.waterAvailability = this.waterLevel;
  // Sync fertilizer fields
  if (this.fertilizers && !this.fertilizerTips) this.fertilizerTips = this.fertilizers;
  if (this.fertilizerTips && !this.fertilizers) this.fertilizers = this.fertilizerTips;
  if (this.fertilizerRecommendations && !this.fertilizerTips) {
    this.fertilizerTips = this.fertilizerRecommendations;
  } else if (this.fertilizerTips && !this.fertilizerRecommendations) {
    this.fertilizerRecommendations = this.fertilizerTips;
  }
  // Sync irrigation
  if (this.irrigationMethod && !this.irrigationStrategy) this.irrigationStrategy = this.irrigationMethod;
  next();
});

// Text index for RAG chatbot full-text search
advisorySchema.index({
  soilType: 'text',
  recommendedCrops: 'text',
  fertilizerTips: 'text',
  season: 'text',
  region: 'text',
});

advisorySchema.index({ soilType: 1, season: 1, waterLevel: 1 });
advisorySchema.index({ createdAt: -1 });

module.exports = mongoose.model('Advisory', advisorySchema);