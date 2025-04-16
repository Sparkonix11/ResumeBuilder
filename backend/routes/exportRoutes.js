const express = require('express');
const router = express.Router();
const exportController = require('../controllers/exportController');
const auth = require('../middlewares/auth');

// All routes require authentication
router.use(auth);

// Export routes
router.post('/pdf', exportController.exportPDF);
router.post('/docx', exportController.exportDOCX);

module.exports = router;