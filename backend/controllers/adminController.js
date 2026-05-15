const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const Scheme = require('../models/schemeModel');
const Advisory = require('../models/advisoryModel');
const UserAdvisory = require('../models/userAdvisoryModel');
const ForumPost = require('../models/forumPostModel');
const Query = require('../models/queryModel');

// ─── Hardcoded Admin Credentials ───
const ADMIN_USERNAME = 'Admin';
const ADMIN_PASSWORD = 'Agroverse123';

// Generate JWT for admin
const generateToken = (id) => jwt.sign({ id, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '7d' });

// ═══════════════════════════════════════
// AUTH
// ═══════════════════════════════════════

// POST /api/admin/login
const adminLogin = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    res.json({
      success: true,
      token: generateToken('admin'),
      admin: { username: ADMIN_USERNAME, role: 'admin' },
    });
  } else {
    res.status(401);
    throw new Error('Invalid admin credentials');
  }
});

// GET /api/admin/verify
const verifyAdmin = asyncHandler(async (req, res) => {
  res.json({ success: true, admin: { username: ADMIN_USERNAME, role: 'admin' } });
});

// ═══════════════════════════════════════
// DASHBOARD STATS
// ═══════════════════════════════════════

// GET /api/admin/stats
const getDashboardStats = asyncHandler(async (req, res) => {
  const [totalUsers, totalSchemes, totalQueries, totalAdvisories, totalPosts] = await Promise.all([
    User.countDocuments(),
    Scheme.countDocuments(),
    Query.countDocuments(),
    UserAdvisory.countDocuments(),
    ForumPost.countDocuments(),
  ]);

  const pendingQueries = await Query.countDocuments({ status: 'pending' });
  const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5).select('-password');
  const recentQueries = await Query.find().sort({ createdAt: -1 }).limit(5);

  // Monthly user registrations (last 6 months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  const monthlyUsers = await User.aggregate([
    { $match: { createdAt: { $gte: sixMonthsAgo } } },
    { $group: { _id: { $month: '$createdAt' }, count: { $sum: 1 } } },
    { $sort: { _id: 1 } },
  ]);

  res.json({
    totalUsers, totalSchemes, totalQueries, totalAdvisories, totalPosts,
    pendingQueries, recentUsers, recentQueries, monthlyUsers,
  });
});

// ═══════════════════════════════════════
// USER MANAGEMENT
// ═══════════════════════════════════════

// GET /api/admin/users
const getUsers = asyncHandler(async (req, res) => {
  const { search, page = 1, limit = 20 } = req.query;
  const query = {};
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { location: { $regex: search, $options: 'i' } },
    ];
  }
  const total = await User.countDocuments(query);
  const users = await User.find(query)
    .select('-password')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  res.json({ users, total, page: Number(page), pages: Math.ceil(total / limit) });
});

// DELETE /api/admin/users/:id
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) { res.status(404); throw new Error('User not found'); }
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: 'User removed' });
});

// ═══════════════════════════════════════
// SCHEME MANAGEMENT
// ═══════════════════════════════════════

// GET /api/admin/schemes
const getSchemes = asyncHandler(async (req, res) => {
  const { search, category, page = 1, limit = 20 } = req.query;
  const query = {};
  if (search) query.$or = [{ schemeName: { $regex: search, $options: 'i' } }, { description: { $regex: search, $options: 'i' } }];
  if (category) query.category = category;
  const total = await Scheme.countDocuments(query);
  const schemes = await Scheme.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit));
  res.json({ schemes, total, page: Number(page), pages: Math.ceil(total / limit) });
});

// POST /api/admin/schemes
const createScheme = asyncHandler(async (req, res) => {
  const scheme = await Scheme.create(req.body);
  res.status(201).json(scheme);
});

// PUT /api/admin/schemes/:id
const updateScheme = asyncHandler(async (req, res) => {
  const scheme = await Scheme.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!scheme) { res.status(404); throw new Error('Scheme not found'); }
  res.json(scheme);
});

// DELETE /api/admin/schemes/:id
const deleteScheme = asyncHandler(async (req, res) => {
  const scheme = await Scheme.findById(req.params.id);
  if (!scheme) { res.status(404); throw new Error('Scheme not found'); }
  await Scheme.findByIdAndDelete(req.params.id);
  res.json({ message: 'Scheme removed' });
});

// ═══════════════════════════════════════
// QUERY MANAGEMENT
// ═══════════════════════════════════════

// GET /api/admin/queries
const getQueries = asyncHandler(async (req, res) => {
  const { status, search, page = 1, limit = 20 } = req.query;
  const query = {};
  if (status) query.status = status;
  if (search) query.$or = [{ subject: { $regex: search, $options: 'i' } }, { farmerName: { $regex: search, $options: 'i' } }];
  const total = await Query.countDocuments(query);
  const queries = await Query.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit));
  res.json({ queries, total, page: Number(page), pages: Math.ceil(total / limit) });
});

// PUT /api/admin/queries/:id
const updateQuery = asyncHandler(async (req, res) => {
  const q = await Query.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!q) { res.status(404); throw new Error('Query not found'); }
  res.json(q);
});

// ═══════════════════════════════════════
// ADVISORY MANAGEMENT
// ═══════════════════════════════════════

// GET /api/admin/advisories
const getAdvisories = asyncHandler(async (req, res) => {
  const advisories = await Advisory.find().sort({ createdAt: -1 });
  res.json(advisories);
});

// POST /api/admin/advisories
const createAdvisory = asyncHandler(async (req, res) => {
  const advisory = await Advisory.create(req.body);
  res.status(201).json(advisory);
});

// PUT /api/admin/advisories/:id
const updateAdvisory = asyncHandler(async (req, res) => {
  const advisory = await Advisory.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!advisory) { res.status(404); throw new Error('Advisory not found'); }
  res.json(advisory);
});

// DELETE /api/admin/advisories/:id
const deleteAdvisory = asyncHandler(async (req, res) => {
  await Advisory.findByIdAndDelete(req.params.id);
  res.json({ message: 'Advisory removed' });
});

module.exports = {
  adminLogin, verifyAdmin, getDashboardStats,
  getUsers, deleteUser,
  getSchemes, createScheme, updateScheme, deleteScheme,
  getQueries, updateQuery,
  getAdvisories, createAdvisory, updateAdvisory, deleteAdvisory,
};
