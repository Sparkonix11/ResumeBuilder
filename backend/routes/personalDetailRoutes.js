const express = require('express');
const router = express.Router();
const personalDetailController = require('../controllers/personalDetailController');
const auth = require('../middlewares/auth');

// All routes require authentication
router.use(auth);

router.get('/', personalDetailController.getPersonalDetails);
router.put('/', personalDetailController.updatePersonalDetails);

module.exports = router;