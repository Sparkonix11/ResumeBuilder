const { Project } = require('../models');

// Get all projects for the current user
exports.getAllProjects = async (req, res) => {
  try {
    const userId = req.user.id;

    const projects = await Project.findAll({
      where: { userId },
      order: [['startDate', 'DESC']],
    });

    res.json(projects);
  } catch (error) {
    console.error('Get all projects error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get project by ID
exports.getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const project = await Project.findOne({
      where: { id, userId },
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    console.error('Get project by ID error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create new project
exports.createProject = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      name,
      description,
      techStack,
      startDate,
      endDate,
      isOngoing,
      projectUrl,
      repoUrl,
      image,
    } = req.body;

    const project = await Project.create({
      userId,
      name,
      description,
      techStack,
      startDate,
      endDate,
      isOngoing,
      projectUrl,
      repoUrl,
      image,
    });

    res.status(201).json(project);
  } catch (error) {
    console.error('Create project error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update project
exports.updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const {
      name,
      description,
      techStack,
      startDate,
      endDate,
      isOngoing,
      projectUrl,
      repoUrl,
      image,
    } = req.body;

    // Check if project exists and belongs to user
    const project = await Project.findOne({
      where: { id, userId },
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Update project
    await project.update({
      name,
      description,
      techStack,
      startDate,
      endDate,
      isOngoing,
      projectUrl,
      repoUrl,
      image,
    });

    // Get updated project
    const updatedProject = await Project.findByPk(id);

    res.json(updatedProject);
  } catch (error) {
    console.error('Update project error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete project
exports.deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check if project exists and belongs to user
    const project = await Project.findOne({
      where: { id, userId },
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Delete project
    await project.destroy();

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete project error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};