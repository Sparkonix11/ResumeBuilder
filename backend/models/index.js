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
const Education = require('./Education')(sequelize, Sequelize.DataTypes);
const WorkExperience = require('./WorkExperience')(sequelize, Sequelize.DataTypes);
const Project = require('./Project')(sequelize, Sequelize.DataTypes);
const PersonalDetail = require('./PersonalDetail')(sequelize, Sequelize.DataTypes);
const ResumeTemplate = require('./ResumeTemplate')(sequelize, Sequelize.DataTypes);
const Resume = require('./Resume')(sequelize, Sequelize.DataTypes);

// Define associations
User.hasMany(Education, { foreignKey: 'userId' });
Education.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(WorkExperience, { foreignKey: 'userId' });
WorkExperience.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Project, { foreignKey: 'userId' });
Project.belongsTo(User, { foreignKey: 'userId' });

User.hasOne(PersonalDetail, { foreignKey: 'userId' });
PersonalDetail.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Resume, { foreignKey: 'userId' });
Resume.belongsTo(User, { foreignKey: 'userId' });

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

module.exports = { 
  sequelize, 
  User,
  Education,
  WorkExperience,
  Project,
  PersonalDetail,
  ResumeTemplate,
  Resume
};
