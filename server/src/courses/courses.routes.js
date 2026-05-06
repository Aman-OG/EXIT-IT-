const express = require('express');
const router = express.Router();
const { getCourses, createCourse, updateCourse, deleteCourse, searchCourses } = require('./courses.controller');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', protect, getCourses);
router.get('/search', protect, searchCourses);
router.post('/', protect, adminOnly, createCourse);
router.put('/:id', protect, adminOnly, updateCourse);
router.delete('/:id', protect, adminOnly, deleteCourse);

module.exports = router;
