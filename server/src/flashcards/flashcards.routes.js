const express = require('express');
const router = express.Router();
const ctrl = require('./flashcards.controller');
const { protect } = require('../middleware/auth');

router.get('/due-count', protect, ctrl.getDueCount);
router.get('/due', protect, ctrl.getDueCards);
router.post('/review', protect, ctrl.submitReview);
router.get('/decks', protect, ctrl.getDecks);
router.post('/decks', protect, ctrl.createDeck);
router.delete('/decks/:id', protect, ctrl.deleteDeck);
router.get('/decks/:id/cards', protect, ctrl.getCards);
router.post('/decks/:id/cards', protect, ctrl.addCard);
router.delete('/cards/:id', protect, ctrl.deleteCard);

module.exports = router;
