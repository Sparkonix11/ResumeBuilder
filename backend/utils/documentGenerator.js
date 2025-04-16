const fs = require('fs');
const path = require('path');
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');

// Helper function to format dates
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

// Generate PDF from resume data
exports.generatePDF = async (resumeData) => {
  try {
    const { personalInfo, projects, workExperiences, education, resumeInfo, template } = resumeData;
    
    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595.28, 841.89]); // A4 size
    const { width, height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    
    // Set colors based on template or custom colors
    const primaryColor = resumeInfo.customPrimaryColor || template.primaryColor || '#000000';
    const secondaryColor = resumeInfo.customSecondaryColor || template.secondaryColor || '#4A90E2';
    
    // Convert hex to RGB
    const hexToRgb = (hex) => {
      const r = parseInt(hex.slice(1, 3), 16) / 255;
      const g = parseInt(hex.slice(3, 5), 16) / 255;
      const b = parseInt(hex.slice(5, 7), 16) / 255;
      return { r, g, b };
    };
    
    const primaryRgb = hexToRgb(primaryColor);
    const secondaryRgb = hexToRgb(secondaryColor);
    
    // Draw header with name and contact info
    page.drawText(personalInfo.name.toUpperCase(), {
      x: 50,
      y: height - 50,
      size: 24,
      font: boldFont,
      color: rgb(primaryRgb.r, primaryRgb.g, primaryRgb.b),
    });
    
    page.drawText(personalInfo.title || 'Professional Resume', {
      x: 50,
      y: height - 80,
      size: 14,
      font,
      color: rgb(secondaryRgb.r, secondaryRgb.g, secondaryRgb.b),
    });
    
    // Contact information
    let contactY = height - 110;
    const contactInfos = [
      `Email: ${personalInfo.email}`,
      personalInfo.phone ? `Phone: ${personalInfo.phone}` : null,
      personalInfo.address ? `Address: ${personalInfo.address}, ${personalInfo.city}, ${personalInfo.state} ${personalInfo.zipCode}` : null,
      personalInfo.linkedIn ? `LinkedIn: ${personalInfo.linkedIn}` : null,
      personalInfo.github ? `GitHub: ${personalInfo.github}` : null,
    ].filter(Boolean);
    
    contactInfos.forEach((info) => {
      page.drawText(info, {
        x: 50,
        y: contactY,
        size: 10,
        font,
        color: rgb(primaryRgb.r, primaryRgb.g, primaryRgb.b),
      });
      contactY -= 15;
    });
    
    // Professional Summary
    if (personalInfo.professionalSummary) {
      contactY -= 15;
      page.drawText('PROFESSIONAL SUMMARY', {
        x: 50,
        y: contactY,
        size: 14,
        font: boldFont,
        color: rgb(secondaryRgb.r, secondaryRgb.g, secondaryRgb.b),
      });
      
      contactY -= 20;
      // Split summary into lines to fit page width
      const summaryLines = splitTextToLines(personalInfo.professionalSummary, 70);
      summaryLines.forEach((line) => {
        page.drawText(line, {
          x: 50,
          y: contactY,
          size: 10,
          font,
          color: rgb(primaryRgb.r, primaryRgb.g, primaryRgb.b),
        });
        contactY -= 15;
      });
    }
    
    // Skills
    if (personalInfo.skills && personalInfo.skills.length > 0) {
      contactY -= 15;
      page.drawText('SKILLS', {
        x: 50,
        y: contactY,
        size: 14,
        font: boldFont,
        color: rgb(secondaryRgb.r, secondaryRgb.g, secondaryRgb.b),
      });
      
      contactY -= 20;
      const skillsText = Array.isArray(personalInfo.skills) 
        ? personalInfo.skills.join(', ') 
        : personalInfo.skills;
      
      // Split skills into lines to fit page width
      const skillLines = splitTextToLines(skillsText, 70);
      skillLines.forEach((line) => {
        page.drawText(line, {
          x: 50,
          y: contactY,
          size: 10,
          font,
          color: rgb(primaryRgb.r, primaryRgb.g, primaryRgb.b),
        });
        contactY -= 15;
      });
    }
    
    // Work Experience
    if (workExperiences && workExperiences.length > 0) {
      contactY -= 15;
      page.drawText('WORK EXPERIENCE', {
        x: 50,
        y: contactY,
        size: 14,
        font: boldFont,
        color: rgb(secondaryRgb.r, secondaryRgb.g, secondaryRgb.b),
      });
      
      contactY -= 20;
      workExperiences.forEach((job) => {
        page.drawText(`${job.position} at ${job.company}`, {
          x: 50,
          y: contactY,
          size: 12,
          font: boldFont,
          color: rgb(primaryRgb.r, primaryRgb.g, primaryRgb.b),
        });
        
        contactY -= 15;
        const dateText = `${formatDate(job.startDate)} - ${job.isCurrentJob ? 'Present' : formatDate(job.endDate)}`;
        page.drawText(dateText, {
          x: 50,
          y: contactY,
          size: 10,
          font,
          color: rgb(primaryRgb.r, primaryRgb.g, primaryRgb.b),
        });
        
        if (job.location) {
          page.drawText(`Location: ${job.location}`, {
            x: 250,
            y: contactY,
            size: 10,
            font,
            color: rgb(primaryRgb.r, primaryRgb.g, primaryRgb.b),
          });
        }
        
        if (job.description) {
          contactY -= 15;
          const descLines = splitTextToLines(job.description, 70);
          descLines.forEach((line) => {
            page.drawText(line, {
              x: 50,
              y: contactY,
              size: 10,
              font,
              color: rgb(primaryRgb.r, primaryRgb.g, primaryRgb.b),
            });
            contactY -= 15;
          });
        }
        
        contactY -= 10;
      });
    }
    
    // Education
    if (education && education.length > 0) {
      contactY -= 15;
      page.drawText('EDUCATION', {
        x: 50,
        y: contactY,
        size: 14,
        font: boldFont,
        color: rgb(secondaryRgb.r, secondaryRgb.g, secondaryRgb.b),
      });
      
      contactY -= 20;
      education.forEach((edu) => {
        page.drawText(`${edu.degree}${edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ''}`, {
          x: 50,
          y: contactY,
          size: 12,
          font: boldFont,
          color: rgb(primaryRgb.r, primaryRgb.g, primaryRgb.b),
        });
        
        contactY -= 15;
        page.drawText(edu.institution, {
          x: 50,
          y: contactY,
          size: 10,
          font,
          color: rgb(primaryRgb.r, primaryRgb.g, primaryRgb.b),
        });
        
        contactY -= 15;
        const dateText = `${formatDate(edu.startDate)} - ${edu.isCurrentlyStudying ? 'Present' : formatDate(edu.endDate)}`;
        page.drawText(dateText, {
          x: 50,
          y: contactY,
          size: 10,
          font,
          color: rgb(primaryRgb.r, primaryRgb.g, primaryRgb.b),
        });
        
        if (edu.description) {
          contactY -= 15;
          const descLines = splitTextToLines(edu.description, 70);
          descLines.forEach((line) => {
            page.drawText(line, {
              x: 50,
              y: contactY,
              size: 10,
              font,
              color: rgb(primaryRgb.r, primaryRgb.g, primaryRgb.b),
            });
            contactY -= 15;
          });
        }
        
        contactY -= 10;
      });
    }
    
    // Projects
    if (projects && projects.length > 0) {
      contactY -= 15;
      page.drawText('PROJECTS', {
        x: 50,
        y: contactY,
        size: 14,
        font: boldFont,
        color: rgb(secondaryRgb.r, secondaryRgb.g, secondaryRgb.b),
      });
      
      contactY -= 20;
      projects.forEach((project) => {
        page.drawText(project.name, {
          x: 50,
          y: contactY,
          size: 12,
          font: boldFont,
          color: rgb(primaryRgb.r, primaryRgb.g, primaryRgb.b),
        });
        
        if (project.techStack && project.techStack.length > 0) {
          contactY -= 15;
          const techText = Array.isArray(project.techStack) 
            ? `Technologies: ${project.techStack.join(', ')}` 
            : `Technologies: ${project.techStack}`;
          
          const techLines = splitTextToLines(techText, 70);
          techLines.forEach((line) => {
            page.drawText(line, {
              x: 50,
              y: contactY,
              size: 10,
              font,
              color: rgb(primaryRgb.r, primaryRgb.g, primaryRgb.b),
            });
            contactY -= 15;
          });
        }
        
        if (project.description) {
          contactY -= 5;
          const descLines = splitTextToLines(project.description, 70);
          descLines.forEach((line) => {
            page.drawText(line, {
              x: 50,
              y: contactY,
              size: 10,
              font,
              color: rgb(primaryRgb.r, primaryRgb.g, primaryRgb.b),
            });
            contactY -= 15;
          });
        }
        
        if (project.projectUrl || project.repoUrl) {
          contactY -= 5;
          let linkText = '';
          if (project.projectUrl) {
            linkText += `Project URL: ${project.projectUrl}`;
          }
          if (project.repoUrl) {
            if (linkText) linkText += ' | ';
            linkText += `Repository: ${project.repoUrl}`;
          }
          
          page.drawText(linkText, {
            x: 50,
            y: contactY,
            size: 10,
            font,
            color: rgb(secondaryRgb.r, secondaryRgb.g, secondaryRgb.b),
          });
        }
        
        contactY -= 20;
      });
    }
    
    // Serialize the PDF to bytes
    const pdfBytes = await pdfDoc.save();
    
    // Generate a unique filename
    const timestamp = Date.now();
    const filename = `resume_${resumeInfo.name.replace(/\s+/g, '_').toLowerCase()}_${timestamp}.pdf`;
    const filePath = path.join(__dirname, '..', 'temp', filename);
    
    // Ensure temp directory exists
    const tempDir = path.join(__dirname, '..', 'temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    
    // Write the PDF to a file
    fs.writeFileSync(filePath, pdfBytes);
    
    return {
      filename,
      filePath,
    };
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF');
  }
};

// Generate DOCX from resume data
exports.generateDOCX = async (resumeData) => {
  try {
    const { personalInfo, projects, workExperiences, education, resumeInfo } = resumeData;
    
    // Read the template file
    const templatePath = path.join(__dirname, '..', 'templates', 'resume_template.docx');
    const content = fs.readFileSync(templatePath, 'binary');
    
    const zip = new PizZip(content);
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });
    
    // Format data for template
    const formattedWorkExperiences = workExperiences.map((job) => ({
      ...job,
      formattedStartDate: formatDate(job.startDate),
      formattedEndDate: job.isCurrentJob ? 'Present' : formatDate(job.endDate),
      dateRange: `${formatDate(job.startDate)} - ${job.isCurrentJob ? 'Present' : formatDate(job.endDate)}`,
    }));
    
    const formattedEducation = education.map((edu) => ({
      ...edu,
      formattedStartDate: formatDate(edu.startDate),
      formattedEndDate: edu.isCurrentlyStudying ? 'Present' : formatDate(edu.endDate),
      dateRange: `${formatDate(edu.startDate)} - ${edu.isCurrentlyStudying ? 'Present' : formatDate(edu.endDate)}`,
      degreeField: `${edu.degree}${edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ''}`,
    }));
    
    const formattedProjects = projects.map((project) => ({
      ...project,
      formattedTechStack: Array.isArray(project.techStack) 
        ? project.techStack.join(', ') 
        : project.techStack,
    }));
    
    // Set the template variables
    doc.setData({
      name: personalInfo.name,
      title: personalInfo.title || '',
      email: personalInfo.email,
      phone: personalInfo.phone || '',
      address: personalInfo.address ? `${personalInfo.address}, ${personalInfo.city}, ${personalInfo.state} ${personalInfo.zipCode}` : '',
      linkedin: personalInfo.linkedIn || '',
      github: personalInfo.github || '',
      portfolio: personalInfo.portfolio || '',
      summary: personalInfo.professionalSummary || '',
      skills: Array.isArray(personalInfo.skills) ? personalInfo.skills.join(', ') : (personalInfo.skills || ''),
      workExperiences: formattedWorkExperiences,
      education: formattedEducation,
      projects: formattedProjects,
    });
    
    // Render the document
    doc.render();
    
    // Generate a unique filename
    const timestamp = Date.now();
    const filename = `resume_${resumeInfo.name.replace(/\s+/g, '_').toLowerCase()}_${timestamp}.docx`;
    const filePath = path.join(__dirname, '..', 'temp', filename);
    
    // Ensure temp directory exists
    const tempDir = path.join(__dirname, '..', 'temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    
    // Write the document
    const buf = doc.getZip().generate({ type: 'nodebuffer' });
    fs.writeFileSync(filePath, buf);
    
    return {
      filename,
      filePath,
    };
  } catch (error) {
    console.error('Error generating DOCX:', error);
    throw new Error('Failed to generate DOCX');
  }
};

// Helper function to split text into lines of a certain length
function splitTextToLines(text, maxCharsPerLine) {
  if (!text) return [];
  
  const words = text.split(' ');
  const lines = [];
  let currentLine = '';
  
  words.forEach((word) => {
    if ((currentLine + word).length <= maxCharsPerLine) {
      currentLine += (currentLine ? ' ' : '') + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  });
  
  if (currentLine) {
    lines.push(currentLine);
  }
  
  return lines;
}