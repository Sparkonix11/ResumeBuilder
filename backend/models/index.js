const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();

const NODE_ENV = process.env.NODE_ENV || 'development';
const isProduction = NODE_ENV === 'production';

const DB_DIALECT = isProduction ? 'postgres' : 'sqlite';
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || 5432;
const DB_NAME = process.env.DB_NAME || 'database';
const DB_USER = process.env.DB_USER || 'user';
const DB_PASSWORD = process.env.DB_PASSWORD || 'password';
const DB_STORAGE = process.env.DB_STORAGE || './database.sqlite';

const sequelize = new Sequelize(
  DB_DIALECT === 'sqlite'
    ? { dialect: 'sqlite', storage: DB_STORAGE, logging: false }
    : {
        dialect: DB_DIALECT,
        host: DB_HOST,
        port: DB_PORT,
        database: DB_NAME,
        username: DB_USER,
        password: DB_PASSWORD,
        logging: false,
      }
);

const User = require('./Users')(sequelize, Sequelize.DataTypes);

// Test Database Connection
(async () => {
  try {
    await sequelize.authenticate();
    console.log(`Connected to ${DB_DIALECT} database successfully!`);
  } catch (error) {
    console.error('Database connection error:', error.message);
    process.exit(1);
  }
})();

module.exports = { sequelize, User };
