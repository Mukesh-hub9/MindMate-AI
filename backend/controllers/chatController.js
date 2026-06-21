const ChatHistory = require('../models/ChatHistory');
const { generateChatResponse } = require('../services/aiService');

const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.user.id;

    let chatHistory = await ChatHistory.findOne({ where: { userId } });
    if (!chatHistory) {
      chatHistory = await ChatHistory.create({ userId, messages: [] });
    }

    const currentMessages = chatHistory.messages || [];
    const recentHistory = currentMessages.slice(-10);
    const aiReply = await generateChatResponse(recentHistory, message);

    const updatedMessages = [
      ...currentMessages,
      { role: 'user', content: message, timestamp: new Date() },
      { role: 'model', content: aiReply, timestamp: new Date() }
    ];

    chatHistory.messages = updatedMessages;
    chatHistory.changed('messages', true); // Force update for JSON fields
    await chatHistory.save();

    res.json({ reply: aiReply, message });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getChatHistory = async (req, res) => {
  try {
    const chatHistory = await ChatHistory.findOne({ where: { userId: req.user.id } });
    res.json(chatHistory ? chatHistory.messages : []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const clearChat = async (req, res) => {
  try {
    const chatHistory = await ChatHistory.findOne({ where: { userId: req.user.id } });
    if (chatHistory) {
      chatHistory.messages = [];
      chatHistory.changed('messages', true);
      await chatHistory.save();
    }
    res.json({ message: 'Chat cleared successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { sendMessage, getChatHistory, clearChat };
