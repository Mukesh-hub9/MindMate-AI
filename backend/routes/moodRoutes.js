const express = require('express');
const router = express.Router();
const { saveMood, getMoods, getLatestMood, getWellnessRecommendations } = require('../controllers/moodController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, saveMood);
router.get('/', protect, getMoods);
router.get('/latest', protect, getLatestMood);
router.get('/recommendations', protect, getWellnessRecommendations);

module.exports = router;
