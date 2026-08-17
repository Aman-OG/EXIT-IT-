const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { 
  registerUser, 
  loginUser, 
  getUserProfile, 
  logoutUser, 
  updateTheme, 
  getDashboardStats, 
  updateStreak, 
  useStreakFreeze, 
  updateName, 
  updateProfile,
  uploadAvatar,
  googleAuth 
} = require('./user.controller');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// Multer Storage Configuration for Profile Avatars
const avatarStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(__dirname, '../../uploads/avatars');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname) || '.png';
    cb(null, `avatar-${req.user?.id || 'user'}-${Date.now()}${ext}`);
  }
});

const uploadAvatarMiddleware = multer({
  storage: avatarStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google-auth', googleAuth);
router.post('/google-login', googleAuth);
router.post('/google-register', googleAuth);
router.post('/logout', logoutUser);
router.get('/me', protect, getUserProfile);
router.put('/theme', protect, updateTheme);
router.put('/name', protect, updateName);
router.put('/profile', protect, updateProfile);
router.post('/avatar', protect, uploadAvatarMiddleware.single('avatar'), uploadAvatar);
router.post('/streak', protect, updateStreak);
router.post('/use-freeze', protect, useStreakFreeze);

// Basic stats endpoint for Phase 1/Phase 2 Admin testing
router.get('/stats', protect, adminOnly, getDashboardStats);

module.exports = router;
