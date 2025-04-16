const { ResumeTemplate } = require('../models');

// Get all active resume templates
exports.getAllTemplates = async (req, res) => {
  try {
    const templates = await ResumeTemplate.findAll({
      where: { isActive: true },
      order: [['name', 'ASC']],
    });

    res.json(templates);
  } catch (error) {
    console.error('Get all templates error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get template by ID
exports.getTemplateById = async (req, res) => {
  try {
    const { id } = req.params;

    const template = await ResumeTemplate.findOne({
      where: { id, isActive: true },
    });

    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }

    res.json(template);
  } catch (error) {
    console.error('Get template by ID error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin only: Create new template
exports.createTemplate = async (req, res) => {
  try {
    const {
      name,
      description,
      previewImage,
      layout,
      fontFamily,
      primaryColor,
      secondaryColor,
    } = req.body;

    // Check if template with same name exists
    const existingTemplate = await ResumeTemplate.findOne({
      where: { name },
    });

    if (existingTemplate) {
      return res.status(400).json({ message: 'Template with this name already exists' });
    }

    const template = await ResumeTemplate.create({
      name,
      description,
      previewImage,
      layout,
      fontFamily,
      primaryColor,
      secondaryColor,
    });

    res.status(201).json(template);
  } catch (error) {
    console.error('Create template error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin only: Update template
exports.updateTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      previewImage,
      layout,
      fontFamily,
      primaryColor,
      secondaryColor,
      isActive,
    } = req.body;

    // Check if template exists
    const template = await ResumeTemplate.findByPk(id);

    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }

    // Check if name is being changed and if new name already exists
    if (name !== template.name) {
      const existingTemplate = await ResumeTemplate.findOne({
        where: { name },
      });

      if (existingTemplate) {
        return res.status(400).json({ message: 'Template with this name already exists' });
      }
    }

    // Update template
    await template.update({
      name,
      description,
      previewImage,
      layout,
      fontFamily,
      primaryColor,
      secondaryColor,
      isActive,
    });

    // Get updated template
    const updatedTemplate = await ResumeTemplate.findByPk(id);

    res.json(updatedTemplate);
  } catch (error) {
    console.error('Update template error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin only: Delete template
exports.deleteTemplate = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if template exists
    const template = await ResumeTemplate.findByPk(id);

    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }

    // Delete template
    await template.destroy();

    res.json({ message: 'Template deleted successfully' });
  } catch (error) {
    console.error('Delete template error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};