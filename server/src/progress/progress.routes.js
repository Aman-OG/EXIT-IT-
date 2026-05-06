const express = require('express');
const router = express.Router();
const { markCompleted, getOverallProgress, getLastAccessed, getRoadmapProgress, getOverallCourseProgress } = require('./progress.controller');
const { protect } = require('../middleware/auth');

router.get('/summary', protect, getOverallProgress);
router.get('/last-accessed', protect, getLastAccessed);
router.get('/roadmap', protect, getRoadmapProgress);
router.get('/overall-course', protect, getOverallCourseProgress);
router.post('/:materialId', protect, markCompleted);

module.exports = router;

