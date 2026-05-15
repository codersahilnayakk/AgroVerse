const mongoose = require('mongoose');

// Individual message within a conversation
const messageSchema = mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'model'],
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    default: 'en-IN',
  },
  isVoiceInitiated: {
    type: Boolean,
    default: false,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  referencedSchemes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Scheme',
    },
  ],
  referencedAdvisories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Advisory',
    },
  ],
});

// Full conversation session
const chatHistorySchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
      index: true,
    },
    sessionTitle: {
      type: String,
      default: 'New Conversation',
    },
    messages: [messageSchema],
    isActive: {
      type: Boolean,
      default: true,
    },
    metadata: {
      totalMessages: { type: Number, default: 0 },
      languagesUsed: [{ type: String }],
      voiceMessagesCount: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient user-specific history queries
chatHistorySchema.index({ userId: 1, createdAt: -1 });

// TTL index: auto-delete conversations older than 90 days
chatHistorySchema.index({ updatedAt: 1 }, { expireAfterSeconds: 7776000 });

// Pre-save hook to keep metadata in sync
chatHistorySchema.pre('save', function (next) {
  this.metadata.totalMessages = this.messages.length;
  this.metadata.voiceMessagesCount = this.messages.filter(
    (m) => m.isVoiceInitiated
  ).length;
  this.metadata.languagesUsed = [
    ...new Set(this.messages.map((m) => m.language)),
  ];
  next();
});

module.exports = mongoose.model('ChatHistory', chatHistorySchema);
