const mongoose = require('mongoose');

const faqSchema = mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
}, { _id: false });

const schemeSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add scheme title'],
      trim: true,
    },
    // Keep legacy field for backward compatibility
    schemeName: {
      type: String,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      sparse: true,
    },
    description: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      enum: [
        'Income Support', 'Crop Insurance', 'Equipment Subsidy',
        'Irrigation', 'Soil Health', 'Organic Farming',
        'Women Farmers', 'Livestock', 'Loan Assistance',
        'Infrastructure', 'Credit', 'Cooperative',
        'Sustainability', 'Other'
      ],
      default: 'Other',
    },
    ministry: {
      type: String,
      default: '',
    },
    // Keep legacy field for backward compatibility
    department: {
      type: String,
      default: '',
    },
    eligibility: {
      type: String,
      required: [true, 'Please add eligibility criteria'],
    },
    benefits: {
      type: String,
      required: [true, 'Please add benefits details'],
    },
    subsidyAmount: {
      type: String,
      default: '',
    },
    requiredDocuments: {
      type: [String],
      default: [],
    },
    // Keep legacy field for backward compatibility
    documents: {
      type: String,
      default: '',
    },
    applicationProcess: {
      type: String,
      default: '',
    },
    officialLink: {
      type: String,
      default: '',
    },
    // Keep legacy field for backward compatibility
    applicationLink: {
      type: String,
      default: '',
    },
    stateApplicability: {
      type: [String],
      default: ['All India'],
    },
    cropType: {
      type: [String],
      default: [],
    },
    faq: {
      type: [faqSchema],
      default: [],
    },
    helpline: {
      type: String,
      default: '',
    },
    bannerImage: {
      type: String,
      default: '',
    },
    // Keep legacy field for backward compatibility
    imageUrl: {
      type: String,
      default: '',
    },
    tags: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'upcoming', 'expired'],
      default: 'active',
    },
    // Keep legacy field for backward compatibility
    deadline: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Auto-generate slug from title and sync legacy fields before validation
schemeSchema.pre('validate', function (next) {
  // Sync legacy fields FIRST so validation passes if only legacy fields are provided
  if (this.title && !this.schemeName) this.schemeName = this.title;
  if (this.schemeName && !this.title) this.title = this.schemeName;
  if (this.ministry && !this.department) this.department = this.ministry;
  if (this.department && !this.ministry) this.ministry = this.department;
  if (this.officialLink && !this.applicationLink) this.applicationLink = this.officialLink;
  if (this.applicationLink && !this.officialLink) this.officialLink = this.applicationLink;
  if (this.bannerImage && !this.imageUrl) this.imageUrl = this.bannerImage;
  if (this.imageUrl && !this.bannerImage) this.bannerImage = this.imageUrl;
  
  // Convert documents string to requiredDocuments array if needed
  if (this.documents && this.requiredDocuments.length === 0) {
    this.requiredDocuments = this.documents.split(',').map(d => d.trim()).filter(Boolean);
  }

  if ((this.isModified('title') || this.isNew) && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }
  
  next();
});

// Text index for full-text search and RAG chatbot
schemeSchema.index({
  title: 'text',
  schemeName: 'text',
  description: 'text',
  category: 'text',
  eligibility: 'text',
  benefits: 'text',
  tags: 'text',
});

// Index for efficient querying
schemeSchema.index({ category: 1 });
schemeSchema.index({ status: 1 });
schemeSchema.index({ slug: 1 });
schemeSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Scheme', schemeSchema);