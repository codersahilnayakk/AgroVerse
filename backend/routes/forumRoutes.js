const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const {
  createForumPost,
  getForumPosts,
  getForumPostById,
  addComment,
  deleteForumPost,
  deleteComment,
  likeForumPost,
  likeComment,
  markCommentAsAnswer,
  updatePostStatus,
  getPostsByUser,
  searchPosts,
} = require('../controllers/forumController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getForumPosts);
router.get('/search', searchPosts);
router.get('/:id', getForumPostById);
router.get('/user/:userId', getPostsByUser);

// Protected routes
// Create a new post
router.post(
  '/',
  protect,
  [
    check('title', 'Title is required').notEmpty(),
    check('description', 'Description is required').notEmpty(),
  ],
  createForumPost
);

// Delete a post
router.delete('/:id', protect, deleteForumPost);

// Add a comment to a post
router.post(
  '/:id/comments',
  protect,
  [check('comment', 'Comment is required').notEmpty()],
  addComment
);

// Like/unlike a post
router.put('/:id/like', protect, likeForumPost);

// Like/unlike a comment
router.put('/:id/comments/:commentId/like', protect, likeComment);

// Mark a comment as the answer
router.put('/:id/comments/:commentId/mark-answer', protect, markCommentAsAnswer);

// Update post status
router.put('/:id/status', protect, updatePostStatus);

// Delete a comment
router.delete('/:id/comments/:commentId', protect, deleteComment);

module.exports = router; 