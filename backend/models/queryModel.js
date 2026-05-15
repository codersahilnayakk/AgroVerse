const mongoose = require('mongoose');

const querySchema = mongoose.Schema(
  {
    farmerName: { type: String, required: true },
    email: { type: String, default: '' },
    location: { type: String, default: '' },
    category: {
      type: String,
      enum: ['schemes', 'advisory', 'technical', 'account', 'other'],
      default: 'other',
    },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'resolved'],
      default: 'pending',
    },
    adminReply: { type: String, default: '' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Query', querySchema);
