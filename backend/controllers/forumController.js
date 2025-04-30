const asyncHandler = require('express-async-handler');
const { validationResult } = require('express-validator');
const ForumPost = require('../models/forumPostModel');
const User = require('../models/userModel');

// @desc    Create new forum post
// @route   POST /api/forum
// @access  Private
const createForumPost = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(errors.array()[0].msg);
  }

  const { title, description, category, tags, isQuestion, images, location } = req.body;

  const forumPost = await ForumPost.create({
    title,
    description,
    user: req.user.id,
    category: category || 'General Discussion',
    tags: tags || [],
    isQuestion: isQuestion || false,
    images: images || [],
    location: location || {},
  });

  res.status(201).json(forumPost);
});

// @desc    Get all forum posts
// @route   GET /api/forum
// @access  Public
const getForumPosts = asyncHandler(async (req, res) => {
  const { category, tag, query, status } = req.query;
  
  // Build filter object
  const filter = {};
  
  if (category) {
    filter.category = category;
  }
  
  if (tag) {
    filter.tags = { $in: [tag] };
  }
  
  if (status) {
    filter.status = status;
  } else {
    // By default only show active posts
    filter.status = 'active';
  }
  
  if (query) {
    filter.$text = { $search: query };
  }

  const forumPosts = await ForumPost.find(filter)
    .sort({ createdAt: -1 })
    .populate('user', 'name')
    .populate('likes', 'name');
  
  res.status(200).json(forumPosts);
});

// @desc    Get forum post by ID
// @route   GET /api/forum/:id
// @access  Public
const getForumPostById = asyncHandler(async (req, res) => {
  // Find the post
  const forumPost = await ForumPost.findById(req.params.id)
    .populate('user', 'name')
    .populate('likes', 'name')
    .populate('comments.commenterId', 'name')
    .populate('comments.likes', 'name');

  if (!forumPost) {
    res.status(404);
    throw new Error('Forum post not found');
  }

  // Increment view count
  forumPost.viewCount += 1;
  await forumPost.save();

  res.status(200).json(forumPost);
});

// @desc    Add comment to forum post
// @route   POST /api/forum/:id/comments
// @access  Private
const addComment = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(errors.array()[0].msg);
  }

  const { comment, isAnswer } = req.body;
  const forumPost = await ForumPost.findById(req.params.id);

  if (!forumPost) {
    res.status(404);
    throw new Error('Forum post not found');
  }

  const newComment = {
    comment,
    commenterName: req.user.name,
    commenterId: req.user.id,
    isAnswer: isAnswer || false,
  };

  // If this is marked as an answer, update the post
  if (isAnswer) {
    forumPost.hasAcceptedAnswer = true;
  }

  forumPost.comments.push(newComment);
  await forumPost.save();

  res.status(201).json(forumPost);
});

// @desc    Mark a comment as answer
// @route   PUT /api/forum/:id/comments/:commentId/mark-answer
// @access  Private
const markCommentAsAnswer = asyncHandler(async (req, res) => {
  const forumPost = await ForumPost.findById(req.params.id);

  if (!forumPost) {
    res.status(404);
    throw new Error('Forum post not found');
  }

  // Check if user is the post owner
  if (forumPost.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('Only the post owner can mark an answer');
  }

  // Find the comment
  const comment = forumPost.comments.find(
    (comment) => comment._id.toString() === req.params.commentId
  );

  if (!comment) {
    res.status(404);
    throw new Error('Comment not found');
  }

  // Mark as answer
  comment.isAnswer = true;
  forumPost.hasAcceptedAnswer = true;
  await forumPost.save();

  res.status(200).json(forumPost);
});

// @desc    Like a forum post
// @route   PUT /api/forum/:id/like
// @access  Private
const likeForumPost = asyncHandler(async (req, res) => {
  const forumPost = await ForumPost.findById(req.params.id);

  if (!forumPost) {
    res.status(404);
    throw new Error('Forum post not found');
  }

  // Check if post has already been liked by user
  const alreadyLiked = forumPost.likes.some((like) => 
    like.toString() === req.user.id
  );

  if (alreadyLiked) {
    // Unlike post
    forumPost.likes = forumPost.likes.filter(
      (like) => like.toString() !== req.user.id
    );
  } else {
    // Like post
    forumPost.likes.push(req.user.id);
  }

  await forumPost.save();
  res.status(200).json({ likes: forumPost.likes });
});

// @desc    Like a comment
// @route   PUT /api/forum/:id/comments/:commentId/like
// @access  Private
const likeComment = asyncHandler(async (req, res) => {
  const forumPost = await ForumPost.findById(req.params.id);

  if (!forumPost) {
    res.status(404);
    throw new Error('Forum post not found');
  }

  // Find the comment
  const comment = forumPost.comments.find(
    (comment) => comment._id.toString() === req.params.commentId
  );

  if (!comment) {
    res.status(404);
    throw new Error('Comment not found');
  }

  // Initialize likes array if it doesn't exist
  if (!comment.likes) {
    comment.likes = [];
  }

  // Check if comment has already been liked by user
  const alreadyLiked = comment.likes.some((like) => 
    like.toString() === req.user.id
  );

  if (alreadyLiked) {
    // Unlike comment
    comment.likes = comment.likes.filter(
      (like) => like.toString() !== req.user.id
    );
  } else {
    // Like comment
    comment.likes.push(req.user.id);
  }

  await forumPost.save();
  res.status(200).json(forumPost);
});

// @desc    Update forum post status
// @route   PUT /api/forum/:id/status
// @access  Private
const updatePostStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  
  if (!['active', 'archived', 'reported', 'resolved'].includes(status)) {
    res.status(400);
    throw new Error('Invalid status value');
  }
  
  const forumPost = await ForumPost.findById(req.params.id);

  if (!forumPost) {
    res.status(404);
    throw new Error('Forum post not found');
  }

  // Check for user
  if (!req.user) {
    res.status(401);
    throw new Error('User not found');
  }

  // Make sure the logged in user matches the forum post user
  if (forumPost.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('User not authorized');
  }

  forumPost.status = status;
  await forumPost.save();

  res.status(200).json(forumPost);
});

// @desc    Delete forum post
// @route   DELETE /api/forum/:id
// @access  Private
const deleteForumPost = asyncHandler(async (req, res) => {
  const forumPost = await ForumPost.findById(req.params.id);

  if (!forumPost) {
    res.status(404);
    throw new Error('Forum post not found');
  }

  // Check for user
  if (!req.user) {
    res.status(401);
    throw new Error('User not found');
  }

  // Make sure the logged in user matches the forum post user
  if (forumPost.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('User not authorized');
  }

  await forumPost.deleteOne();

  res.status(200).json({ id: req.params.id });
});

// @desc    Delete comment
// @route   DELETE /api/forum/:id/comments/:commentId
// @access  Private
const deleteComment = asyncHandler(async (req, res) => {
  const forumPost = await ForumPost.findById(req.params.id);

  if (!forumPost) {
    res.status(404);
    throw new Error('Forum post not found');
  }

  // Find the comment
  const comment = forumPost.comments.find(
    (comment) => comment._id.toString() === req.params.commentId
  );

  if (!comment) {
    res.status(404);
    throw new Error('Comment not found');
  }

  // Check if user is authorized to delete (either post owner or comment owner)
  if (
    comment.commenterId.toString() !== req.user.id &&
    forumPost.user.toString() !== req.user.id
  ) {
    res.status(401);
    throw new Error('User not authorized');
  }

  // If this was an answer, update the post
  if (comment.isAnswer) {
    // Check if there are other answers
    const otherAnswers = forumPost.comments.some(
      c => c._id.toString() !== req.params.commentId && c.isAnswer
    );
    
    if (!otherAnswers) {
      forumPost.hasAcceptedAnswer = false;
    }
  }

  // Remove comment
  const commentIndex = forumPost.comments.findIndex(
    (comment) => comment._id.toString() === req.params.commentId
  );
  
  forumPost.comments.splice(commentIndex, 1);
  await forumPost.save();

  res.status(200).json(forumPost);
});

// @desc    Get posts by user
// @route   GET /api/forum/user/:userId
// @access  Public
const getPostsByUser = asyncHandler(async (req, res) => {
  const forumPosts = await ForumPost.find({ user: req.params.userId })
    .sort({ createdAt: -1 })
    .populate('user', 'name');
  
  res.status(200).json(forumPosts);
});

// @desc    Search forum posts
// @route   GET /api/forum/search
// @access  Public
const searchPosts = asyncHandler(async (req, res) => {
  const { query } = req.query;
  
  if (!query) {
    res.status(400);
    throw new Error('Search query is required');
  }
  
  const forumPosts = await ForumPost.find(
    { $text: { $search: query } },
    { score: { $meta: "textScore" } }
  )
    .sort({ score: { $meta: "textScore" } })
    .populate('user', 'name');
  
  res.status(200).json(forumPosts);
});

module.exports = {
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
}; 