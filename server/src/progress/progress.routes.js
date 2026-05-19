const express = require('express');
const router = express.Router();
const { markCompleted, getOverallProgress, getLastAccessed, getRoadmapProgress, getOverallCourseProgress } = require('./progress.controller');
const sessionCtrl = require('./study_sessions.controller');
const certCtrl = require('./certificates.controller');
const { protect } = require('../middleware/auth');

router.get('/summary', protect, getOverallProgress);
router.get('/last-accessed', protect, getLastAccessed);
router.get('/roadmap', protect, getRoadmapProgress);
router.get('/overall-course', protect, getOverallCourseProgress);
router.get('/today', protect, sessionCtrl.getTodayProgress);
router.get('/study-time', protect, sessionCtrl.getStudyTimePerCourse);
router.get('/weekly', protect, sessionCtrl.getWeeklyStudyTime);
router.post('/session', protect, sessionCtrl.logSession);
router.put('/goal', protect, sessionCtrl.updateGoal);
router.get('/certificates', protect, certCtrl.getCertificates);
router.post('/certificates/:courseId', protect, certCtrl.issueCertificate);
router.post('/:materialId', protect, markCompleted);

module.exports = router;

