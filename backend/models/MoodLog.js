const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');

const MoodLog = sequelize.define('MoodLog', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  mood: {
    type: DataTypes.ENUM('happy', 'good', 'neutral', 'sad', 'stressed'),
    allowNull: false
  },
  moodScore: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 1, max: 5 }
  },
  stressLevel: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 1, max: 10 }
  },
  note: {
    type: DataTypes.TEXT,
    defaultValue: ''
  },
  aiInsight: {
    type: DataTypes.TEXT,
    defaultValue: ''
  },
  date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

User.hasMany(MoodLog, { foreignKey: 'userId', onDelete: 'CASCADE' });
MoodLog.belongsTo(User, { foreignKey: 'userId' });

module.exports = MoodLog;
