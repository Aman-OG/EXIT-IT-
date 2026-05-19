const express = require('express');
const router = express.Router();
const friendsController = require('./friends.controller');
const { protect } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

// Search users
router.get('/search', friendsController.searchUsers);

// Friend requests
router.post('/request', friendsController.sendFriendRequest);
router.get('/requests/pending', friendsController.getPendingRequests);
router.get('/requests/sent', friendsController.getSentRequests);
router.put('/requests/:requestId/accept', friendsController.acceptFriendRequest);
router.put('/requests/:requestId/reject', friendsController.rejectFriendRequest);

// Friends management
router.get('/', friendsController.getFriends);
router.delete('/:friendId', friendsController.removeFriend);

// Friends leaderboard
router.get('/leaderboard', friendsController.getFriendsLeaderboard);

module.exports = router;
