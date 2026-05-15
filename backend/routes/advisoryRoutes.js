const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const {
  createAdvisory,
  getAdvisories,
  getAdvisoryById,
  deleteAdvisory,
  getAdvisoryCombinations,
  migrateUserAdvisories,
  getRecommendations,
} = require('../controllers/advisoryController');
const { protect } = require('../middleware/authMiddleware');

// Public route to get all available advisory combinations
router.get('/combinations', getAdvisoryCombinations);

// Get AI recommendations (public)
router.post('/recommendations', getRecommendations);

// Protect all other routes
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
      check('region', 'Region is required').not().isEmpty(),
    ],
    createAdvisory
  );

// Get, update and delete advisory by id
router
  .route('/:id')
  .get(getAdvisoryById)
  .delete(deleteAdvisory);

// Get advisories for a specific user
// This route is redundant with the main getAdvisories route when using JWT auth
// But adding it for completeness
router.get('/user/:userId', getAdvisories);

// Migrate user advisories from Advisory to UserAdvisory (admin only)
router.post('/migrate', migrateUserAdvisories);

module.exports = router; 