const express = require('express');
const router = express.Router();
const notificationsController = require('./notifications.controller');
const { protect } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

// Get notifications
router.get('/', notificationsController.getNotifications);

// Mark as read
router.put('/:notificationId/read', notificationsController.markAsRead);
router.put('/read-all', notificationsController.markAllAsRead);

// Delete notification
router.delete('/:notificationId', notificationsController.deleteNotification);

// Preferences
router.get('/preferences', notificationsController.getPreferences);
router.put('/preferences', notificationsController.updatePreferences);

module.exports = router;
