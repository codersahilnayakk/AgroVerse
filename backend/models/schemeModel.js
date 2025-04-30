const mongoose = require('mongoose');

const schemeSchema = mongoose.Schema(
  {
    schemeName: {
      type: String,
      required: [true, 'Please add scheme name'],
    },
    department: {
      type: String,
      required: [true, 'Please add department name'],
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      enum: ['insurance', 'income', 'credit', 'irrigation', 'infrastructure', 'cooperative', 'sustainability', 'other'],
      default: 'other',
    },
    eligibility: {
      type: String,
      required: [true, 'Please add eligibility criteria'],
    },
    benefits: {
      type: String,
      required: [true, 'Please add benefits details'],
    },
    applicationProcess: {
      type: String,
      default: '',
    },
    applicationLink: {
      type: String,
      default: '',
    },
    documents: {
      type: String,
      default: '',
    },
    deadline: {
      type: String,
      default: '',
    },
    imageUrl: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Scheme', schemeSchema); 