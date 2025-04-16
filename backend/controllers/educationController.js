const { Education } = require('../models');

// Get all education entries for the current user
exports.getAllEducation = async (req, res) => {
  try {
    const userId = req.user.id;

    const education = await Education.findAll({
      where: { userId },
      order: [['startDate', 'DESC']],
    });

    res.json(education);
  } catch (error) {
    console.error('Get all education error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get education by ID
exports.getEducationById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const education = await Education.findOne({
      where: { id, userId },
    });

    if (!education) {
      return res.status(404).json({ message: 'Education not found' });
    }

    res.json(education);
  } catch (error) {
    console.error('Get education by ID error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create new education entry
exports.createEducation = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      institution,
      degree,
      fieldOfStudy,
      startDate,
      endDate,
      isCurrentlyStudying,
      description,
    } = req.body;

    const education = await Education.create({
      userId,
      institution,
      degree,
      fieldOfStudy,
      startDate,
      endDate,
      isCurrentlyStudying,
      description,
    });

    res.status(201).json(education);
  } catch (error) {
    console.error('Create education error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update education entry
exports.updateEducation = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const {
      institution,
      degree,
      fieldOfStudy,
      startDate,
      endDate,
      isCurrentlyStudying,
      description,
    } = req.body;

    // Check if education exists and belongs to user
    const education = await Education.findOne({
      where: { id, userId },
    });

    if (!education) {
      return res.status(404).json({ message: 'Education not found' });
    }

    // Update education
    await education.update({
      institution,
      degree,
      fieldOfStudy,
      startDate,
      endDate,
      isCurrentlyStudying,
      description,
    });

    // Get updated education
    const updatedEducation = await Education.findByPk(id);

    res.json(updatedEducation);
  } catch (error) {
    console.error('Update education error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete education entry
exports.deleteEducation = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check if education exists and belongs to user
    const education = await Education.findOne({
      where: { id, userId },
    });

    if (!education) {
      return res.status(404).json({ message: 'Education not found' });
    }

    // Delete education
    await education.destroy();

    res.json({ message: 'Education deleted successfully' });
  } catch (error) {
    console.error('Delete education error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};