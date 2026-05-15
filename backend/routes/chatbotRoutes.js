const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const {
  sendMessage,
  cropHelp,
  getChatHistory,
  getChatSession,
  deleteChatSession,
  clearAllHistory,
  getQuickActions,
} = require('../controllers/chatbotController');
const { protect } = require('../middleware/authMiddleware');

// All chatbot routes require authentication
router.use(protect);

// @route   POST /api/chatbot/message
// @desc    Send a message to the RAG chatbot and get a response
// @access  Private
router.post(
  '/message',
  [check('query', 'Query text is required').not().isEmpty()],
  sendMessage
);

// @route   POST /api/chatbot/crop-help
// @desc    Guided crop help flow with step-by-step option selection
// @access  Private
router.post('/crop-help', cropHelp);

// @route   GET /api/chatbot/quick-actions
// @desc    Get predefined quick-action buttons for the chat UI
// @access  Private
router.get('/quick-actions', getQuickActions);

// @route   GET /api/chatbot/history
// @desc    Get all chat sessions for the logged-in user
// @access  Private
router.get('/history', getChatHistory);

// @route   GET /api/chatbot/history/:sessionId
// @desc    Get a specific chat session with full messages
// @access  Private
router.get('/history/:sessionId', getChatSession);

// @route   DELETE /api/chatbot/history/:sessionId
// @desc    Delete a specific chat session
// @access  Private
router.delete('/history/:sessionId', deleteChatSession);

// @route   DELETE /api/chatbot/history
// @desc    Delete all chat history for the logged-in user
// @access  Private
router.delete('/history', clearAllHistory);

module.exports = router;
