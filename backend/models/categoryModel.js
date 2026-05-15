const mongoose = require('mongoose');

const categorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a category name'],
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    icon: {
      type: String,
      default: '📁',
    },
    description: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      enum: ['scheme', 'advisory', 'forum', 'general'],
      default: 'general',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Auto-generate slug
categorySchema.pre('save', function (next) {
  if (this.isModified('name') || this.isNew) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }
  next();
});

categorySchema.index({ slug: 1 });
categorySchema.index({ type: 1 });

module.exports = mongoose.model('Category', categorySchema);
