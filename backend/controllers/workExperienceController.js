const { WorkExperience } = require('../models');

// Get all work experiences for the current user
exports.getAllWorkExperiences = async (req, res) => {
  try {
    const userId = req.user.id;

    const workExperiences = await WorkExperience.findAll({
      where: { userId },
      order: [['startDate', 'DESC']],
    });

    res.json(workExperiences);
  } catch (error) {
    console.error('Get all work experiences error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get work experience by ID
exports.getWorkExperienceById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const workExperience = await WorkExperience.findOne({
      where: { id, userId },
    });

    if (!workExperience) {
      return res.status(404).json({ message: 'Work experience not found' });
    }

    res.json(workExperience);
  } catch (error) {
    console.error('Get work experience by ID error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create new work experience
exports.createWorkExperience = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      company,
      position,
      startDate,
      endDate,
      isCurrentJob,
      location,
      description,
      responsibilities,
    } = req.body;

    const workExperience = await WorkExperience.create({
      userId,
      company,
      position,
      startDate,
      endDate,
      isCurrentJob,
      location,
      description,
      responsibilities,
    });

    res.status(201).json(workExperience);
  } catch (error) {
    console.error('Create work experience error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update work experience
exports.updateWorkExperience = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const {
      company,
      position,
      startDate,
      endDate,
      isCurrentJob,
      location,
      description,
      responsibilities,
    } = req.body;

    // Check if work experience exists and belongs to user
    const workExperience = await WorkExperience.findOne({
      where: { id, userId },
    });

    if (!workExperience) {
      return res.status(404).json({ message: 'Work experience not found' });
    }

    // Update work experience
    await workExperience.update({
      company,
      position,
      startDate,
      endDate,
      isCurrentJob,
      location,
      description,
      responsibilities,
    });

    // Get updated work experience
    const updatedWorkExperience = await WorkExperience.findByPk(id);

    res.json(updatedWorkExperience);
  } catch (error) {
    console.error('Update work experience error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete work experience
exports.deleteWorkExperience = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check if work experience exists and belongs to user
    const workExperience = await WorkExperience.findOne({
      where: { id, userId },
    });

    if (!workExperience) {
      return res.status(404).json({ message: 'Work experience not found' });
    }

    // Delete work experience
    await workExperience.destroy();

    res.json({ message: 'Work experience deleted successfully' });
  } catch (error) {
    console.error('Delete work experience error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};