const express = require('express');
const router = express.Router();
const { getStats, getUsers, getCourseAnalytics, getCourseDetail, getStudentAnalytics } = require('./admin.controller');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/stats', protect, adminOnly, getStats);
router.get('/users', protect, adminOnly, getUsers);
router.get('/analytics/courses', protect, adminOnly, getCourseAnalytics);
router.get('/analytics/course/:courseId', protect, adminOnly, getCourseDetail);
router.get('/analytics/students', protect, adminOnly, getStudentAnalytics);

module.exports = router;
