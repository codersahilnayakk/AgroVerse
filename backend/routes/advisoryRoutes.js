const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const {
  createAdvisory,
  getAdvisories,
  getAdvisoryById,
  deleteAdvisory,
} = require('../controllers/advisoryController');
const { protect } = require('../middleware/authMiddleware');

// Protect all routes
router.use(protect);

// Get all advisories for logged in user and create new advisory
router
  .route('/')
  .get(getAdvisories)
  .post(
    [
      check('soilType', 'Soil type is required').not().isEmpty(),
      check('season', 'Season is required').not().isEmpty(),
      check('waterLevel', 'Water level is required').not().isEmpty(),
    ],
    createAdvisory
  );

// Get, update and delete advisory by id
router
  .route('/:id')
  .get(getAdvisoryById)
  .delete(deleteAdvisory);

module.exports = router; 