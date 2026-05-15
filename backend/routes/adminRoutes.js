const express = require('express');
const router = express.Router();
const { adminProtect } = require('../middleware/authMiddleware');
const {
  adminLogin, verifyAdmin, getDashboardStats,
  getUsers, deleteUser,
  getSchemes, createScheme, updateScheme, deleteScheme,
  getQueries, updateQuery,
  getAdvisories, createAdvisory, updateAdvisory, deleteAdvisory,
} = require('../controllers/adminController');

// Auth (public)
router.post('/login', adminLogin);

// All below require admin token
router.get('/verify', adminProtect, verifyAdmin);
router.get('/stats', adminProtect, getDashboardStats);

// Users
router.get('/users', adminProtect, getUsers);
router.delete('/users/:id', adminProtect, deleteUser);

// Schemes
router.get('/schemes', adminProtect, getSchemes);
router.post('/schemes', adminProtect, createScheme);
router.put('/schemes/:id', adminProtect, updateScheme);
router.delete('/schemes/:id', adminProtect, deleteScheme);

// Image Upload
const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
  destination(req, file, cb) { cb(null, 'uploads/'); },
  filename(req, file, cb) { cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`); }
});
const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    const filetypes = /jpg|jpeg|png|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) { return cb(null, true); } else { cb('Images only!'); }
  }
});
router.post('/upload', adminProtect, upload.single('image'), (req, res) => {
  res.send(`/${req.file.path.replace(/\\/g, '/')}`);
});

// Queries
router.get('/queries', adminProtect, getQueries);
router.put('/queries/:id', adminProtect, updateQuery);

// Advisories
router.get('/advisories', adminProtect, getAdvisories);
router.post('/advisories', adminProtect, createAdvisory);
router.put('/advisories/:id', adminProtect, updateAdvisory);
router.delete('/advisories/:id', adminProtect, deleteAdvisory);

module.exports = router;
