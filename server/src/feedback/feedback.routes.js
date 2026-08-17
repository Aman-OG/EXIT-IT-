const express = require('express');
const router = express.Router();
const { 
  submitFeedback, 
  getAllFeedbacks, 
  updateFeedbackStatus, 
  deleteFeedback 
} = require('./feedback.controller');
const { protect, optionalAuth, adminOnly } = require('../middleware/auth');

// Public/Student submission (guest or logged-in)
router.post('/', optionalAuth, submitFeedback);

// Admin-only management endpoints
router.get('/', protect, adminOnly, getAllFeedbacks);
router.patch('/:id', protect, adminOnly, updateFeedbackStatus);
router.delete('/:id', protect, adminOnly, deleteFeedback);

module.exports = router;
