const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const {
  createScheme,
  getSchemes,
  getSchemeById,
  updateScheme,
  deleteScheme,
  searchSchemes,
} = require('../controllers/schemeController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getSchemes);
router.get('/search', searchSchemes);
router.get('/:id', getSchemeById);

// Protected routes (admin only in real app)
router.post(
  '/',
  protect,
  [
    check('schemeName', 'Scheme name is required').not().isEmpty(),
    check('eligibility', 'Eligibility criteria is required').not().isEmpty(),
    check('benefits', 'Benefits details are required').not().isEmpty(),
  ],
  createScheme
);

router.put('/:id', protect, updateScheme);
router.delete('/:id', protect, deleteScheme);

module.exports = router; 