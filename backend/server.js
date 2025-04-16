const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
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

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve static files from temp directory for downloads
app.use('/temp', express.static(path.join(__dirname, 'temp')));

// Register routes
app.use('/api/users', userRoutes);
app.use('/api/personal-details', personalDetailRoutes);
app.use('/api/work-experiences', workExperienceRoutes);
app.use('/api/education', educationRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/resume-templates', resumeTemplateRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/export', exportRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Default route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Resume Builder API' });
});

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

sequelize
  .sync({ alter: true }) // Creates tables if they don't exist
  .then(() => {
    console.log('Database & tables synced!');
    app.listen(PORT, () => console.log(`Server running on port ${PORT} in ${NODE_ENV} mode`));
  })
  .catch((err) => console.error('Error syncing database:', err));