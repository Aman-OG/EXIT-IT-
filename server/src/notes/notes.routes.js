const express = require('express');
const router = express.Router();
const notesController = require('./notes.controller');
const { protect } = require('../middleware/auth');

router.get('/', protect, notesController.getAllNotes);
router.get('/:materialId', protect, notesController.getNoteByMaterial);
router.post('/:materialId', protect, notesController.updateNote);
router.delete('/:id', protect, notesController.deleteNote);

module.exports = router;
