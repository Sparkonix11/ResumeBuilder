const express = require('express');
const router = express.Router();
const educationController = require('../controllers/educationController');
const auth = require('../middlewares/auth');

// All routes require authentication
router.use(auth);

router.get('/', educationController.getAllEducation);
router.get('/:id', educationController.getEducationById);
router.post('/', educationController.createEducation);
router.put('/:id', educationController.updateEducation);
router.delete('/:id', educationController.deleteEducation);

module.exports = router;