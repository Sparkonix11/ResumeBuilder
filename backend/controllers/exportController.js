const path = require('path');
const fs = require('fs');
const { generatePDF, generateDOCX } = require('../utils/documentGenerator');

// Export resume as PDF
exports.exportPDF = async (req, res) => {
  try {
    const { resumeData } = req.body;

    if (!resumeData) {
      return res.status(400).json({ message: 'Resume data is required' });
    }

    // Generate PDF
    const { filename, filePath } = await generatePDF(resumeData);

    // Set headers for file download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

    // Stream the file to the client
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

    // Delete the file after sending (optional)
    fileStream.on('end', () => {
      fs.unlinkSync(filePath);
    });
  } catch (error) {
    console.error('Export PDF error:', error.message);
    res.status(500).json({ message: 'Failed to export resume as PDF' });
  }
};

// Export resume as DOCX
exports.exportDOCX = async (req, res) => {
  try {
    const { resumeData } = req.body;

    if (!resumeData) {
      return res.status(400).json({ message: 'Resume data is required' });
    }

    // Generate DOCX
    const { filename, filePath } = await generateDOCX(resumeData);

    // Set headers for file download
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

    // Stream the file to the client
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

    // Delete the file after sending (optional)
    fileStream.on('end', () => {
      fs.unlinkSync(filePath);
    });
  } catch (error) {
    console.error('Export DOCX error:', error.message);
    res.status(500).json({ message: 'Failed to export resume as DOCX' });
  }
};