const express = require('express');
const router = express.Router();
const quizController = require('./quiz.controller');
const { protect, adminOnly } = require('../middleware/auth');

// --- Student Routes ---
router.get('/search', protect, quizController.searchQuizzes);
router.get('/course/:courseId', protect, quizController.getQuizzesByCourse);
router.get('/', protect, quizController.getAllQuizzes);
router.get('/:id', protect, quizController.getQuizById);
router.post('/:id/submit', protect, quizController.submitQuiz);

// --- Admin Routes ---
router.post('/', protect, adminOnly, quizController.createQuiz);
router.put('/:id', protect, adminOnly, quizController.updateQuiz);
router.delete('/:id', protect, quizController.deleteQuiz);
router.post('/question', protect, adminOnly, quizController.addQuestion);
router.delete('/question/:id', protect, adminOnly, quizController.deleteQuestion);
router.get('/question/:id', protect, adminOnly, quizController.getQuestion);
router.put('/question/:id', protect, adminOnly, quizController.updateQuestion);

module.exports = router;
