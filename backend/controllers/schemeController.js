const asyncHandler = require('express-async-handler');
const { validationResult } = require('express-validator');
const Scheme = require('../models/schemeModel');

// @desc    Create new government scheme
// @route   POST /api/schemes
// @access  Private (Admin only - future implementation)
const createScheme = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(errors.array()[0].msg);
  }

  const { schemeName, eligibility, benefits, applicationLink, department, deadline, description } = req.body;

  const scheme = await Scheme.create({
    schemeName,
    eligibility,
    benefits,
    applicationLink,
    department,
    deadline,
    description,
  });

  res.status(201).json(scheme);
});

// @desc    Get all schemes
// @route   GET /api/schemes
// @access  Public
const getSchemes = asyncHandler(async (req, res) => {
  const schemes = await Scheme.find().sort({ createdAt: -1 });
  res.status(200).json(schemes);
});

// @desc    Get scheme by ID
// @route   GET /api/schemes/:id
// @access  Public
const getSchemeById = asyncHandler(async (req, res) => {
  const scheme = await Scheme.findById(req.params.id);

  if (!scheme) {
    res.status(404);
    throw new Error('Scheme not found');
  }

  res.status(200).json(scheme);
});

// @desc    Update scheme
// @route   PUT /api/schemes/:id
// @access  Private (Admin only - future implementation)
const updateScheme = asyncHandler(async (req, res) => {
  const scheme = await Scheme.findById(req.params.id);

  if (!scheme) {
    res.status(404);
    throw new Error('Scheme not found');
  }

  const updatedScheme = await Scheme.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.status(200).json(updatedScheme);
});

// @desc    Delete scheme
// @route   DELETE /api/schemes/:id
// @access  Private (Admin only - future implementation)
const deleteScheme = asyncHandler(async (req, res) => {
  const scheme = await Scheme.findById(req.params.id);

  if (!scheme) {
    res.status(404);
    throw new Error('Scheme not found');
  }

  await scheme.deleteOne();

  res.status(200).json({ id: req.params.id });
});

// @desc    Search schemes by query
// @route   GET /api/schemes/search
// @access  Public
const searchSchemes = asyncHandler(async (req, res) => {
  const { query } = req.query;
  
  if (!query) {
    res.status(400);
    throw new Error('Search query is required');
  }

  const schemes = await Scheme.find({
    $or: [
      { schemeName: { $regex: query, $options: 'i' } },
      { department: { $regex: query, $options: 'i' } },
      { description: { $regex: query, $options: 'i' } },
    ],
  });

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