const express = require('express');
const { registerUser, loginUser, getUserProfile, logoutUser, updateTheme, getDashboardStats, updateStreak, updateName } = require('./user.controller');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/me', protect, getUserProfile);
router.put('/theme', protect, updateTheme);
router.put('/name', protect, updateName);
router.post('/streak', protect, updateStreak);

// Basic stats endpoint for Phase 1/Phase 2 Admin testing
router.get('/stats', protect, adminOnly, getDashboardStats);

module.exports = router;
