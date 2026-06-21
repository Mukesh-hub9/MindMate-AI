const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');

const Journal = sequelize.define('Journal', {
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
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  sentiment: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  sentimentScore: {
    type: DataTypes.STRING,
    defaultValue: 'neutral'
  }
});

User.hasMany(Journal, { foreignKey: 'userId', onDelete: 'CASCADE' });
Journal.belongsTo(User, { foreignKey: 'userId' });

module.exports = Journal;
