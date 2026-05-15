const asyncHandler = require('express-async-handler');
const Query = require('../models/queryModel');

// @desc    Submit a new query
// @route   POST /api/queries
// @access  Public
const createQuery = asyncHandler(async (req, res) => {
  const { farmerName, location, message } = req.body;

  if (!farmerName || !message) {
    res.status(400);
    throw new Error('Please add all required fields');
  }

  const query = await Query.create({
    farmerName,
    location: location || '',
    subject: 'General Farming Assistance',
    message,
    category: 'other',
    userId: req.user ? req.user._id : undefined
  });

  res.status(201).json(query);
});

module.exports = {
  createQuery,
};
