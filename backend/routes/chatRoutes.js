const express = require('express');
const router = express.Router();
const { sendMessage, getChatHistory, clearChat } = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, sendMessage);
router.get('/history', protect, getChatHistory);
router.delete('/clear', protect, clearChat);

module.exports = router;
