const MoodLog = require('../models/MoodLog');
const { generateMoodInsight } = require('../services/aiService');

const moodScoreMap = { happy: 5, good: 4, neutral: 3, sad: 2, stressed: 1 };

const saveMood = async (req, res) => {
  try {
    const { mood, stressLevel, note } = req.body;
    const aiInsight = await generateMoodInsight(mood, stressLevel, note);
    const moodLog = await MoodLog.create({
      userId: req.user.id,
      mood,
      moodScore: moodScoreMap[mood] || 3,
      stressLevel,
      note,
      aiInsight
    });
    res.status(201).json(moodLog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMoods = async (req, res) => {
  try {
    const moods = await MoodLog.findAll({
      where: { userId: req.user.id },
      order: [['date', 'DESC']],
      limit: 30
    });
    res.json(moods);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getLatestMood = async (req, res) => {
  try {
    const mood = await MoodLog.findOne({
      where: { userId: req.user.id },
      order: [['date', 'DESC']]
    });
    res.json(mood);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getWellnessRecommendations = async (req, res) => {
  try {
    const latestMood = await MoodLog.findOne({
      where: { userId: req.user.id },
      order: [['date', 'DESC']]
    });
    const stressLevel = latestMood ? latestMood.stressLevel : 5;

    let recommendations = [];

    if (stressLevel >= 8) {
      recommendations = [
        { icon: '🫁', title: '4-7-8 Breathing Exercise', desc: 'Inhale for 4 counts, hold for 7, exhale for 8. Repeat 4 times to calm your nervous system.', category: 'breathing', priority: 'high' },
        { icon: '🧘', title: '5-Minute Body Scan Meditation', desc: 'Close your eyes and slowly scan from head to toe, releasing tension in each body part.', category: 'meditation', priority: 'high' },
        { icon: '📞', title: 'Talk to a Counselor', desc: 'Your stress level is high. Consider speaking with your college counselor for professional support.', category: 'support', priority: 'high' },
        { icon: '🚶', title: 'Take a 10-Minute Walk', desc: 'Step outside for fresh air. Physical movement releases endorphins and reduces cortisol.', category: 'exercise', priority: 'medium' },
      ];
    } else if (stressLevel >= 5) {
      recommendations = [
        { icon: '🎵', title: 'Listen to Relaxing Music', desc: 'Put on calming instrumental music for 15 minutes. Music at 60 BPM can help slow your heart rate.', category: 'relaxation', priority: 'medium' },
        { icon: '📝', title: 'Brain Dump Journaling', desc: 'Write down everything on your mind without judgment. Getting thoughts out of your head reduces mental load.', category: 'journal', priority: 'medium' },
        { icon: '🍵', title: 'Herbal Tea Break', desc: 'Step away from screens and make a warm cup of chamomile or green tea to reset your focus.', category: 'lifestyle', priority: 'medium' },
        { icon: '⏱️', title: 'Pomodoro Study Technique', desc: 'Study for 25 minutes, then take a 5-minute break. This improves focus and reduces burnout.', category: 'study', priority: 'medium' },
      ];
    } else {
      recommendations = [
        { icon: '💧', title: 'Stay Hydrated', desc: 'Drink a glass of water! Staying hydrated improves focus, mood, and energy levels throughout the day.', category: 'lifestyle', priority: 'low' },
        { icon: '🌟', title: 'Set Daily Intentions', desc: 'Write down 3 things you want to accomplish today. Small wins build momentum and motivation.', category: 'productivity', priority: 'low' },
        { icon: '😴', title: 'Maintain Sleep Schedule', desc: 'Aim for 7-8 hours of sleep. Consistent sleep times improve memory consolidation and mood.', category: 'sleep', priority: 'low' },
        { icon: '🙏', title: 'Gratitude Practice', desc: 'Write 3 things you\'re grateful for. Gratitude practices are scientifically linked to improved well-being.', category: 'mindfulness', priority: 'low' },
      ];
    }

    res.json({ stressLevel, recommendations });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { saveMood, getMoods, getLatestMood, getWellnessRecommendations };
