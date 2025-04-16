const express = require('express');
const router = express.Router();
const resumeController = require('../controllers/resumeController');
const auth = require('../middlewares/auth');

// All routes require authentication
router.use(auth);

// Resume routes
router.get('/', resumeController.getAllResumes);
router.get('/:id', resumeController.getResumeById);
router.get('/:id/full', resumeController.getFullResumeData);
router.post('/', resumeController.createResume);
router.put('/:id', resumeController.updateResume);
router.delete('/:id', resumeController.deleteResume);

module.exports = router;