const express = require('express');
const router = express.Router();
const { getStats, getUsers } = require('./admin.controller');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/stats', protect, adminOnly, getStats);
router.get('/users', protect, adminOnly, getUsers);

module.exports = router;
