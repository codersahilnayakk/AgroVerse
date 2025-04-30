const mongoose = require('mongoose');

const forumPostSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
      enum: ['Crop Production', 'Livestock', 'Farm Equipment', 'Market Trends', 'Schemes & Subsidies', 'Weather', 'Pest Control', 'Soil Management', 'General Discussion'],
      default: 'General Discussion',
    },
    tags: [String],
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      }
    ],
    viewCount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['active', 'archived', 'reported', 'resolved'],
      default: 'active',
    },
    images: [String],
    comments: [
      {
        comment: {
          type: String,
          required: true,
        },
        commenterName: {
          type: String,
          required: true,
        },
        commenterId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'User',
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
        likes: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
          }
        ],
        isAnswer: {
          type: Boolean,
          default: false,
        },
      },
    ],
    isQuestion: {
      type: Boolean,
      default: false,
    },
    hasAcceptedAnswer: {
      type: Boolean,
      default: false,
    },
    location: {
      district: String,
      state: String,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient searching
forumPostSchema.index({ title: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('ForumPost', forumPostSchema); 