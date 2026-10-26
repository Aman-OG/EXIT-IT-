const express = require('express');
const router = express.Router();
const notificationsController = require('./notifications.controller');
const { protect, adminOnly } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

// Get notifications
router.get('/', notificationsController.getNotifications);

// Mark as read
router.put('/:notificationId/read', notificationsController.markAsRead);
router.put('/read-all', notificationsController.markAllAsRead);

// Delete notification
router.delete('/:notificationId', notificationsController.deleteNotification);

// Badge unlocked friend notification
router.post('/badge-unlocked', notificationsController.notifyBadgeUnlocked);

// Preferences
router.get('/preferences', notificationsController.getPreferences);
router.put('/preferences', notificationsController.updatePreferences);

// Admin Broadcasts
router.post('/broadcast', adminOnly, notificationsController.broadcastNotification);
router.post('/broadcast/hall-of-fame', adminOnly, notificationsController.broadcastHallOfFame);
router.get('/broadcast/status/:jobId', adminOnly, notificationsController.getBroadcastStatus);

module.exports = router;

