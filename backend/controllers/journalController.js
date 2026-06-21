const Journal = require('../models/Journal');
const { analyzeJournalSentiment } = require('../services/aiService');

const createJournal = async (req, res) => {
  try {
    const { title, content } = req.body;
    const sentimentData = await analyzeJournalSentiment(content);
    const journal = await Journal.create({
      userId: req.user.id,
      title,
      content,
      sentiment: sentimentData.sentiment,
      sentimentScore: sentimentData.score
    });
    
    // Add _id for frontend compatibility
    const responseJournal = journal.toJSON();
    responseJournal._id = responseJournal.id;

    res.status(201).json({ journal: responseJournal, sentimentData });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getJournals = async (req, res) => {
  try {
    const journals = await Journal.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']]
    });
    
    // Map ids to _id for frontend
    const mappedJournals = journals.map(j => {
      const data = j.toJSON();
      data._id = data.id;
      return data;
    });

    res.json(mappedJournals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteJournal = async (req, res) => {
  try {
    await Journal.destroy({
      where: { id: req.params.id, userId: req.user.id }
    });
    res.json({ message: 'Journal entry deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createJournal, getJournals, deleteJournal };
