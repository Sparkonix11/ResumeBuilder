const express = require('express');
const router = express.Router();
const resumeTemplateController = require('../controllers/resumeTemplateController');
const auth = require('../middlewares/auth');

// Public routes
router.get('/', resumeTemplateController.getAllTemplates);
router.get('/:id', resumeTemplateController.getTemplateById);

// Admin routes (would typically have admin middleware)
// For simplicity, we're just using auth middleware for now
router.post('/', auth, resumeTemplateController.createTemplate);
router.put('/:id', auth, resumeTemplateController.updateTemplate);
router.delete('/:id', auth, resumeTemplateController.deleteTemplate);

module.exports = router;