const express = require('express');
const router = express.Router();
const { createJournal, getJournals, deleteJournal } = require('../controllers/journalController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createJournal);
router.get('/', protect, getJournals);
router.delete('/:id', protect, deleteJournal);

module.exports = router;
