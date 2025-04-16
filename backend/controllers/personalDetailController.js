const { PersonalDetail } = require('../models');

// Get personal details for the current user
exports.getPersonalDetails = async (req, res) => {
  try {
    const userId = req.user.id;

    let personalDetails = await PersonalDetail.findOne({
      where: { userId },
    });

    // If no personal details exist, create an empty one
    if (!personalDetails) {
      personalDetails = await PersonalDetail.create({ userId });
    }

    res.json(personalDetails);
  } catch (error) {
    console.error('Get personal details error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update personal details
exports.updatePersonalDetails = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      phone,
      address,
      city,
      state,
      zipCode,
      country,
      title,
      professionalSummary,
      skills,
      linkedIn,
      github,
      portfolio,
    } = req.body;

    let personalDetails = await PersonalDetail.findOne({
      where: { userId },
    });

    if (!personalDetails) {
      // Create if not exists
      personalDetails = await PersonalDetail.create({
        userId,
        phone,
        address,
        city,
        state,
        zipCode,
        country,
        title,
        professionalSummary,
        skills,
        linkedIn,
        github,
        portfolio,
      });
    } else {
      // Update existing
      await personalDetails.update({
        phone,
        address,
        city,
        state,
        zipCode,
        country,
        title,
        professionalSummary,
        skills,
        linkedIn,
        github,
        portfolio,
      });
    }

    // Fetch updated record
    const updatedDetails = await PersonalDetail.findOne({
      where: { userId },
    });

    res.json(updatedDetails);
  } catch (error) {
    console.error('Update personal details error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};