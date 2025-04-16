const { Resume, User, PersonalDetail, Project, WorkExperience, Education, ResumeTemplate } = require('../models');

// Get all resumes for the current user
exports.getAllResumes = async (req, res) => {
  try {
    const userId = req.user.id;

    const resumes = await Resume.findAll({
      where: { userId },
      order: [['updatedAt', 'DESC']],
    });

    res.json(resumes);
  } catch (error) {
    console.error('Get all resumes error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get resume by ID
exports.getResumeById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const resume = await Resume.findOne({
      where: { id, userId },
    });

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    res.json(resume);
  } catch (error) {
    console.error('Get resume by ID error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create new resume
exports.createResume = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      name,
      templateId,
      customFontFamily,
      customPrimaryColor,
      customSecondaryColor,
      selectedProjects,
      selectedWorkExperiences,
      selectedEducation,
    } = req.body;

    const resume = await Resume.create({
      userId,
      name,
      templateId,
      customFontFamily,
      customPrimaryColor,
      customSecondaryColor,
      selectedProjects,
      selectedWorkExperiences,
      selectedEducation,
    });

    res.status(201).json(resume);
  } catch (error) {
    console.error('Create resume error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update resume
exports.updateResume = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const {
      name,
      templateId,
      customFontFamily,
      customPrimaryColor,
      customSecondaryColor,
      selectedProjects,
      selectedWorkExperiences,
      selectedEducation,
    } = req.body;

    // Check if resume exists and belongs to user
    const resume = await Resume.findOne({
      where: { id, userId },
    });

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    // Update resume
    await resume.update({
      name,
      templateId,
      customFontFamily,
      customPrimaryColor,
      customSecondaryColor,
      selectedProjects,
      selectedWorkExperiences,
      selectedEducation,
    });

    // Get updated resume
    const updatedResume = await Resume.findByPk(id);

    res.json(updatedResume);
  } catch (error) {
    console.error('Update resume error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete resume
exports.deleteResume = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check if resume exists and belongs to user
    const resume = await Resume.findOne({
      where: { id, userId },
    });

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    // Delete resume
    await resume.destroy();

    res.json({ message: 'Resume deleted successfully' });
  } catch (error) {
    console.error('Delete resume error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get full resume data for preview or export
exports.getFullResumeData = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Find resume with template
    const resume = await Resume.findOne({
      where: { id, userId },
      include: [{ model: ResumeTemplate }],
    });

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    // Get user and personal details
    const user = await User.findByPk(userId, {
      attributes: ['id', 'name', 'email'],
      include: [{ model: PersonalDetail }],
    });

    // Get selected projects
    const selectedProjectIds = resume.selectedProjects;
    const projects = selectedProjectIds.length > 0
      ? await Project.findAll({
          where: {
            id: selectedProjectIds,
            userId,
          },
          order: [['startDate', 'DESC']],
        })
      : [];

    // Get selected work experiences
    const selectedWorkExperienceIds = resume.selectedWorkExperiences;
    const workExperiences = selectedWorkExperienceIds.length > 0
      ? await WorkExperience.findAll({
          where: {
            id: selectedWorkExperienceIds,
            userId,
          },
          order: [['startDate', 'DESC']],
        })
      : [];

    // Get selected education
    const selectedEducationIds = resume.selectedEducation;
    const education = selectedEducationIds.length > 0
      ? await Education.findAll({
          where: {
            id: selectedEducationIds,
            userId,
          },
          order: [['startDate', 'DESC']],
        })
      : [];

    // Compile full resume data
    const fullResumeData = {
      resumeInfo: {
        id: resume.id,
        name: resume.name,
        customFontFamily: resume.customFontFamily,
        customPrimaryColor: resume.customPrimaryColor,
        customSecondaryColor: resume.customSecondaryColor,
      },
      template: resume.ResumeTemplate,
      personalInfo: {
        name: user.name,
        email: user.email,
        ...user.PersonalDetail.dataValues,
      },
      projects,
      workExperiences,
      education,
    };

    res.json(fullResumeData);
  } catch (error) {
    console.error('Get full resume data error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};