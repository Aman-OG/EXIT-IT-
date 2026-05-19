const express = require('express');
const router = express.Router();
const aiController = require('./ai.controller');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/health', (req, res) => res.json({ status: 'AI Routes OK' }));
router.get('/extract-pdf/:materialId', protect, aiController.extractPdf);
router.post('/explain', protect, aiController.explain);
router.post('/summarize', protect, aiController.summarize);
router.post('/generate-quiz', protect, aiController.generateQuiz);
router.post('/add-questions-to-quiz', protect, adminOnly, aiController.addQuestionsToQuiz);

module.exports = router;
