const mongoose = require('mongoose');

const schemeSchema = mongoose.Schema(
  {
    schemeName: {
      type: String,
      required: [true, 'Please add scheme name'],
    },
    eligibility: {
      type: String,
      required: [true, 'Please add eligibility criteria'],
    },
    benefits: {
      type: String,
      required: [true, 'Please add benefits details'],
    },
    applicationLink: {
      type: String,
      default: '',
    },
    department: {
      type: String,
      default: '',
    },
    deadline: {
      type: Date,
      default: null,
    },
    description: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Scheme', schemeSchema); 