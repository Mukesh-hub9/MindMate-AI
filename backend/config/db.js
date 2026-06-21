const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'mindmate',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || '127.0.0.1',
    dialect: 'mysql',
    logging: false, // Set to console.log to see SQL queries
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log(`✅ MySQL Connected: ${sequelize.config.host}`);
  } catch (error) {
    console.error(`❌ MySQL Error: ${error.message}`);
    console.log("⚠️ Continuing without MySQL. Database operations will fail.");
  }
};

module.exports = { sequelize, connectDB };
