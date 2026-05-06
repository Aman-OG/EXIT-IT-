const express = require('express');
const router = express.Router();
const { getSettings, updateSetting } = require('./settings.controller');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', getSettings);
router.put('/', protect, adminOnly, updateSetting);

module.exports = router;
