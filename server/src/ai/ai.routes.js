const express = require('express');
const router = express.Router();
const aiController = require('./ai.controller');
const { protect } = require('../middleware/auth');

router.get('/health', (req, res) => res.json({ status: 'AI Routes OK' }));
router.post('/explain', protect, aiController.explain);
router.post('/summarize', protect, aiController.summarize);
router.post('/generate-quiz', protect, aiController.generateQuiz);

module.exports = router;
