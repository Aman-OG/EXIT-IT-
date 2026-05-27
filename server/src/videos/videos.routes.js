const express = require('express');
const router = express.Router();
const ctrl = require('./videos.controller');
const { protect, adminOnly } = require('../middleware/auth');

// Student: get videos for a chapter
router.get('/material/:materialId', protect, ctrl.getVideosForMaterial);

// Admin: add video manually
router.post('/material/:materialId', protect, adminOnly, ctrl.addVideo);

// Admin: AI suggest videos from YouTube
router.post('/material/:materialId/ai-suggest', protect, adminOnly, ctrl.aiSuggestVideos);

// Admin: delete a video
router.delete('/:videoId', protect, adminOnly, ctrl.deleteVideo);

module.exports = router;
