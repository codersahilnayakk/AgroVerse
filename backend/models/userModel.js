const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
  {
    fullName: {
      type: String,
      trim: true,
    },
    // Legacy field
    name: {
      type: String,
      required: [true, 'Please add a name'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
    },
    role: {
      type: String,
      enum: ['farmer', 'admin'],
      default: 'farmer',
    },
    language: {
      type: String,
      default: 'en',
    },
    location: {
      type: String,
      default: '',
    },
    farmSize: {
      type: String,
      default: '',
    },
    primaryCrops: {
      type: [String],
      default: [],
    },
    bookmarkedSchemes: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'Scheme',
      default: [],
    },
    advisoryHistory: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'UserAdvisory',
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Sync fullName <-> name
userSchema.pre('save', function (next) {
  if (this.fullName && !this.name) this.name = this.fullName;
  if (this.name && !this.fullName) this.fullName = this.name;
  next();
});

userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ createdAt: -1 });

module.exports = mongoose.model('User', userSchema);