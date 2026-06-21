require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize, connectDB } = require('./config/db');

// Import Models so Sequelize knows about them before syncing
require('./models/User');
require('./models/MoodLog');
require('./models/Journal');
require('./models/ChatHistory');

const authRoutes = require('./routes/authRoutes');
const moodRoutes = require('./routes/moodRoutes');
const chatRoutes = require('./routes/chatRoutes');
const journalRoutes = require('./routes/journalRoutes');

const app = express();

// Connect to MySQL
connectDB();

// Middleware
app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:3000'], credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/mood', moodRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/journal', journalRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'MindMate API running 🧠', time: new Date().toISOString() });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;

// Sync Database and Start Server
sequelize.sync({ alter: true }).then(() => {
  console.log('✅ MySQL tables synced');
  app.listen(PORT, () => {
    console.log(`🚀 MindMate server running on port ${PORT}`);
  });
}).catch(err => {
  console.error('❌ Failed to sync DB:', err);
});
