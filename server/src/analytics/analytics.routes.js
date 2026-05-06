const express = require('express');
const router = express.Router();
const analyticsController = require('./analytics.controller');
const { protect } = require('../middleware/auth');

router.get('/overview', protect, analyticsController.getOverviewStats);
router.get('/profile', protect, analyticsController.getProfileStats);
router.get('/course/:courseId', protect, analyticsController.getCourseProgress);
router.get('/leaderboard', protect, analyticsController.getLeaderboard);

module.exports = router;
