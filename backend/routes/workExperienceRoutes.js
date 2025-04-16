const express = require('express');
const router = express.Router();
const workExperienceController = require('../controllers/workExperienceController');
const auth = require('../middlewares/auth');

// All routes require authentication
router.use(auth);

router.get('/', workExperienceController.getAllWorkExperiences);
router.get('/:id', workExperienceController.getWorkExperienceById);
router.post('/', workExperienceController.createWorkExperience);
router.put('/:id', workExperienceController.updateWorkExperience);
router.delete('/:id', workExperienceController.deleteWorkExperience);

module.exports = router;