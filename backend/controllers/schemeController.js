const asyncHandler = require('express-async-handler');
const { validationResult } = require('express-validator');
const Scheme = require('../models/schemeModel');

// @desc    Create new government scheme
// @route   POST /api/schemes
// @access  Private (Admin only)
const createScheme = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(errors.array()[0].msg);
  }

  const scheme = await Scheme.create(req.body);
  res.status(201).json(scheme);
});

// @desc    Get all schemes with pagination, filtering, and search
// @route   GET /api/schemes
// @access  Public
const getSchemes = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 50,
    category,
    status,
    search,
    sort = '-createdAt',
  } = req.query;

  const query = {};

  // Category filter
  if (category && category !== 'All Categories') {
    query.category = category;
  }

  // Status filter
  if (status) {
    query.status = status;
  }

  // Search filter
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { schemeName: { $regex: search, $options: 'i' } },
      { department: { $regex: search, $options: 'i' } },
      { ministry: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { tags: { $in: [new RegExp(search, 'i')] } },
    ];
  }

  const total = await Scheme.countDocuments(query);
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);

  const schemes = await Scheme.find(query)
    .sort(sort)
    .skip((pageNum - 1) * limitNum)
    .limit(limitNum);

  res.status(200).json({
    schemes,
    total,
    page: pageNum,
    pages: Math.ceil(total / limitNum),
  });
});

// @desc    Get scheme by ID or slug
// @route   GET /api/schemes/:id
// @access  Public
const getSchemeById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  let scheme;

  // Try by MongoDB ID first
  if (id.match(/^[0-9a-fA-F]{24}$/)) {
    scheme = await Scheme.findById(id);
  }
  // Then try by slug
  if (!scheme) {
    scheme = await Scheme.findOne({ slug: id });
  }

  if (!scheme) {
    res.status(404);
    throw new Error('Scheme not found');
  }

  res.status(200).json(scheme);
});

// @desc    Update scheme
// @route   PUT /api/schemes/:id
// @access  Private (Admin only)
const updateScheme = asyncHandler(async (req, res) => {
  const scheme = await Scheme.findById(req.params.id);

  if (!scheme) {
    res.status(404);
    throw new Error('Scheme not found');
  }

  const updatedScheme = await Scheme.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  res.status(200).json(updatedScheme);
});

// @desc    Delete scheme
// @route   DELETE /api/schemes/:id
// @access  Private (Admin only)
const deleteScheme = asyncHandler(async (req, res) => {
  const scheme = await Scheme.findById(req.params.id);

  if (!scheme) {
    res.status(404);
    throw new Error('Scheme not found');
  }

  await scheme.deleteOne();

  res.status(200).json({ id: req.params.id, message: 'Scheme removed' });
});

// @desc    Search schemes by query
// @route   GET /api/schemes/search
// @access  Public
const searchSchemes = asyncHandler(async (req, res) => {
  const { query, page = 1, limit = 20 } = req.query;

  if (!query) {
    res.status(400);
    throw new Error('Search query is required');
  }

  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);

  const schemes = await Scheme.find({
    $or: [
      { title: { $regex: query, $options: 'i' } },
      { schemeName: { $regex: query, $options: 'i' } },
      { department: { $regex: query, $options: 'i' } },
      { ministry: { $regex: query, $options: 'i' } },
      { description: { $regex: query, $options: 'i' } },
      { eligibility: { $regex: query, $options: 'i' } },
      { benefits: { $regex: query, $options: 'i' } },
      { tags: { $in: [new RegExp(query, 'i')] } },
    ],
  })
    .sort({ createdAt: -1 })
    .skip((pageNum - 1) * limitNum)
    .limit(limitNum);

  res.status(200).json(schemes);
});

module.exports = {
  createScheme,
  getSchemes,
  getSchemeById,
  updateScheme,
  deleteScheme,
  searchSchemes,
};