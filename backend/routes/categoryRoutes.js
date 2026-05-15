const express = require('express');
const router = express.Router();
const {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');
const { adminProtect } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getCategories);
router.get('/:idOrSlug', getCategoryById);

// Admin-only routes
router.post('/', adminProtect, createCategory);
router.put('/:id', adminProtect, updateCategory);
router.delete('/:id', adminProtect, deleteCategory);

module.exports = router;
