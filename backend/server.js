const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { sequelize } = require('./models/index');

// Import routes
const userRoutes = require('./routes/userRoutes');
const personalDetailRoutes = require('./routes/personalDetailRoutes');
const workExperienceRoutes = require('./routes/workExperienceRoutes');
const educationRoutes = require('./routes/educationRoutes');
const projectRoutes = require('./routes/projectRoutes');
const resumeTemplateRoutes = require('./routes/resumeTemplateRoutes');
const resumeRoutes = require('./routes/resumeRoutes');
const exportRoutes = require('./routes/exportRoutes');

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());

// Register routes
app.use('/api/users', userRoutes);
app.use('/api/personal-details', personalDetailRoutes);
app.use('/api/work-experiences', workExperienceRoutes);
app.use('/api/education', educationRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/resume-templates', resumeTemplateRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/export', exportRoutes);

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

sequelize
  .sync({ alter: true }) // Creates tables if they don’t exist
  .then(() => {
    console.log('Database & tables synced!');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error('Error syncing database:', err));