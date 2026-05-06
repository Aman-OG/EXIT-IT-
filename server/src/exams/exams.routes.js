const express = require('express');
const router = express.Router();
const examsController = require('./exams.controller');
const { protect } = require('../middleware/auth');

router.get('/official-list', protect, examsController.getOfficialList);
router.get('/start', protect, examsController.startExam);
router.post('/submit', protect, examsController.submitExam);

router.post('/report', protect, examsController.reportQuestion);
router.get('/reports', protect, examsController.getReportedQuestions);
router.put('/reports/:id/resolve', protect, examsController.resolveReport);

module.exports = router;
