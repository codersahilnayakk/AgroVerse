const express = require('express');
const router = express.Router();
const { createQuery } = require('../controllers/queryController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', createQuery);

module.exports = router;
