const asyncHandler = require('express-async-handler');
const Category = require('../models/categoryModel');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getCategories = asyncHandler(async (req, res) => {
  const { type } = req.query;
  const filter = { isActive: true };
  if (type) filter.type = type;

  const categories = await Category.find(filter).sort({ name: 1 });
  res.status(200).json(categories);
});

// @desc    Get category by ID or slug
// @route   GET /api/categories/:idOrSlug
// @access  Public
const getCategoryById = asyncHandler(async (req, res) => {
  const { idOrSlug } = req.params;
  let category;

  // Try by ID first, then by slug
  if (idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
    category = await Category.findById(idOrSlug);
  }
  if (!category) {
    category = await Category.findOne({ slug: idOrSlug });
  }
  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }

  res.status(200).json(category);
});

// @desc    Create new category
// @route   POST /api/categories
// @access  Private (Admin)
const createCategory = asyncHandler(async (req, res) => {
  const { name, icon, description, type } = req.body;

  if (!name) {
    res.status(400);
    throw new Error('Category name is required');
  }

  const existing = await Category.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
  if (existing) {
    res.status(400);
    throw new Error('Category already exists');
  }

  const category = await Category.create({ name, icon, description, type });
  res.status(201).json(category);
});

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private (Admin)
const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }

  const updated = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.status(200).json(updated);
});

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private (Admin)
const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }

  await category.deleteOne();
  res.status(200).json({ id: req.params.id, message: 'Category removed' });
});

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
