import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { getResumeById, exportResumeToPDF, exportResumeToDOCX, Resume } from '../services/resumes';
import { getPersonalDetails, PersonalDetail } from '../services/personalDetails';
import { getEducationById, Education } from '../services/education';
import { getWorkExperienceById, WorkExperience } from '../services/workExperience';
import { getProjectById, Project } from '../services/projects';
import { getTemplateById, ResumeTemplate } from '../services/resumeTemplates';

const ResumePreviewPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadingMessage, setLoadingMessage] = useState<string>('Loading resume...');
  const [error, setError] = useState<string | null>(null);
  
  // Data needed for preview
  const [resume, setResume] = useState<Resume | null>(null);
  const [template, setTemplate] = useState<ResumeTemplate | null>(null);
  const [personalDetails, setPersonalDetails] = useState<PersonalDetail | null>(null);
  const [educationItems, setEducationItems] = useState<Education[]>([]);
  const [workExperienceItems, setWorkExperienceItems] = useState<WorkExperience[]>([]);
  const [projectItems, setProjectItems] = useState<Project[]>([]);

  useEffect(() => {
    if (!id) {
      setError('Resume ID is missing');
      setIsLoading(false);
      return;
    }
    
    fetchResumeData(parseInt(id));
  }, [id]);

  const fetchResumeData = async (resumeId: number) => {
    try {
      setIsLoading(true);
      setLoadingMessage('Loading resume...');
      
      // Get the resume data
      const resumeData = await getResumeById(resumeId);
      setResume(resumeData);
      
      // Get template data
      setLoadingMessage('Loading template...');
      const templateData = await getTemplateById(resumeData.templateId);
      setTemplate(templateData);
      
      // Get personal details
      setLoadingMessage('Loading personal details...');
      const personalData = await getPersonalDetails();
      setPersonalDetails(personalData);
      
      // Parse IDs from selected items
      const educationIds = typeof resumeData.selectedEducation === 'string' 
        ? resumeData.selectedEducation.split(',').map(id => parseInt(id)) 
        : resumeData.selectedEducation || [];
        
      const workExperienceIds = typeof resumeData.selectedWorkExperiences === 'string' 
        ? resumeData.selectedWorkExperiences.split(',').map(id => parseInt(id)) 
        : resumeData.selectedWorkExperiences || [];
        
      const projectIds = typeof resumeData.selectedProjects === 'string' 
        ? resumeData.selectedProjects.split(',').map(id => parseInt(id)) 
        : resumeData.selectedProjects || [];
        
      // Fetch education items
      setLoadingMessage('Loading education...');
      const educationPromises = educationIds.map(eduId => getEducationById(eduId));
      const educationResults = await Promise.all(educationPromises);
      setEducationItems(educationResults);
      
      // Fetch work experience items
      setLoadingMessage('Loading work experience...');
      const workExperiencePromises = workExperienceIds.map(expId => getWorkExperienceById(expId));
      const workExperienceResults = await Promise.all(workExperiencePromises);
      setWorkExperienceItems(workExperienceResults);
      
      // Fetch project items if any
      if (projectIds.length > 0) {
        setLoadingMessage('Loading projects...');
        const projectPromises = projectIds.map(projId => getProjectById(projId));
        const projectResults = await Promise.all(projectPromises);
        setProjectItems(projectResults);
      }
      
    } catch (err) {
      console.error('Error fetching resume data:', err);
      setError('Failed to load resume. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = async (format: 'pdf' | 'docx') => {
    if (!id) return;
    
    try {
      setIsLoading(true);
      setLoadingMessage(`Exporting resume as ${format.toUpperCase()}...`);
      
      let blob;
      let filename;
      
      if (format === 'pdf') {
        blob = await exportResumeToPDF(parseInt(id));
        filename = `resume_${id}.pdf`;
      } else {
        blob = await exportResumeToDOCX(parseInt(id));
        filename = `resume_${id}.docx`;
      }
      
      // Create a blob URL and trigger download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
    } catch (err) {
      console.error(`Error exporting resume to ${format}:`, err);
      setError(`Failed to export resume as ${format.toUpperCase()}. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/resume-builder');
  };

  const handleEdit = () => {
    if (id) {
      navigate(`/resume-builder/${id}`);
    }
  };

  // Helper function to format dates
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600">{loadingMessage}</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
          <p>{error}</p>
          <button
            onClick={handleBack}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Go Back to Resume Builder
          </button>
        </div>
      </Layout>
    );
  }

  // Apply custom styling based on resume preferences
  const resumeStyles = {
    fontFamily: resume?.customFontFamily || 'Arial, sans-serif',
    primaryColor: resume?.customPrimaryColor || '#333333',
    secondaryColor: resume?.customSecondaryColor || '#4A90E2',
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex flex-wrap justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Resume Preview</h1>
            <p className="text-gray-600 mt-1">{resume?.name}</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleBack}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Back to Builder
            </button>
            <button
              onClick={handleEdit}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Edit Resume
            </button>
            <button
              onClick={() => handleExport('pdf')}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Export PDF
            </button>
            <button
              onClick={() => handleExport('docx')}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Export DOCX
            </button>
          </div>
        </div>
        
        {/* Resume Preview */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 mb-8">
          {/* This is a simple preview, the actual output document would be formatted by the backend */}
          <div 
            className="p-8" 
            style={{ 
              fontFamily: resumeStyles.fontFamily,
              color: resumeStyles.primaryColor
            }}
          >
            {/* Header / Personal Information */}
            <div className="mb-6 text-center">
              <h1 className="text-3xl font-bold mb-1" style={{ color: resumeStyles.primaryColor }}>
                {personalDetails?.name || 'Your Name'}
              </h1>
              
              {personalDetails?.title && (
                <h2 className="text-xl mb-2" style={{ color: resumeStyles.secondaryColor }}>
                  {personalDetails.title}
                </h2>
              )}
              
              <div className="flex flex-wrap justify-center gap-x-4 text-sm">
                {personalDetails?.email && (
                  <span>{personalDetails.email}</span>
                )}
                {personalDetails?.phone && (
                  <span>{personalDetails.phone}</span>
                )}
                {personalDetails?.location && (
                  <span>
                    {[
                      personalDetails.address,
                      personalDetails.city,
                      personalDetails.state,
                      personalDetails.zipCode
                    ].filter(Boolean).join(', ')}
                  </span>
                )}
              </div>
              
              {/* Online Presence Links */}
              <div className="flex flex-wrap justify-center gap-x-4 mt-2 text-sm">
                {personalDetails?.linkedIn && (
                  <a 
                    href={personalDetails.linkedIn} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:underline"
                    style={{ color: resumeStyles.secondaryColor }}
                  >
                    LinkedIn
                  </a>
                )}
                {personalDetails?.github && (
                  <a 
                    href={personalDetails.github} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:underline"
                    style={{ color: resumeStyles.secondaryColor }}
                  >
                    GitHub
                  </a>
                )}
                {personalDetails?.portfolio && (
                  <a 
                    href={personalDetails.portfolio} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:underline"
                    style={{ color: resumeStyles.secondaryColor }}
                  >
                    Portfolio
                  </a>
                )}
              </div>
            </div>
            
            {/* Professional Summary */}
            {personalDetails?.professionalSummary && (
              <div className="mb-6">
                <h2 className="text-lg font-bold border-b pb-1 mb-2" style={{ color: resumeStyles.secondaryColor }}>
                  Professional Summary
                </h2>
                <p>{personalDetails.professionalSummary}</p>
              </div>
            )}
            
            {/* Work Experience */}
            {workExperienceItems.length > 0 && (
              <div className="mb-6">
                <h2 className="text-lg font-bold border-b pb-1 mb-3" style={{ color: resumeStyles.secondaryColor }}>
                  Work Experience
                </h2>
                <div className="space-y-4">
                  {workExperienceItems.map((exp) => (
                    <div key={exp.id} className="mb-2">
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold">{exp.position}</h3>
                        <p className="text-sm">
                          {formatDate(exp.startDate)} - {exp.isCurrentJob ? 'Present' : formatDate(exp.endDate)}
                        </p>
                      </div>
                      <p className="font-medium">{exp.company}</p>
                      {exp.location && <p className="text-sm mb-1">{exp.location}</p>}
                      {exp.description && <p className="mb-2">{exp.description}</p>}
                      {exp.responsibilities && (
                        <div 
                          className="text-sm pl-4" 
                          dangerouslySetInnerHTML={{ 
                            __html: exp.responsibilities.replace(/•\s/g, '• ').split('•').filter(Boolean).map(
                              item => `<li>${item.trim()}</li>`
                            ).join('')
                          }} 
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Education */}
            {educationItems.length > 0 && (
              <div className="mb-6">
                <h2 className="text-lg font-bold border-b pb-1 mb-3" style={{ color: resumeStyles.secondaryColor }}>
                  Education
                </h2>
                <div className="space-y-3">
                  {educationItems.map((edu) => (
                    <div key={edu.id} className="mb-2">
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold">{edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}</h3>
                        <p className="text-sm">
                          {formatDate(edu.startDate)} - {edu.isCurrentlyStudying ? 'Present' : formatDate(edu.endDate)}
                        </p>
                      </div>
                      <p className="font-medium">{edu.institution}</p>
                      {edu.location && <p className="text-sm">{edu.location}</p>}
                      {edu.gpa && <p className="text-sm">GPA: {edu.gpa}</p>}
                      {edu.description && <p className="text-sm mt-1">{edu.description}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Projects */}
            {projectItems.length > 0 && (
              <div className="mb-6">
                <h2 className="text-lg font-bold border-b pb-1 mb-3" style={{ color: resumeStyles.secondaryColor }}>
                  Projects
                </h2>
                <div className="space-y-4">
                  {projectItems.map((project) => (
                    <div key={project.id} className="mb-2">
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold">{project.name}</h3>
                        {(project.startDate || project.endDate) && (
                          <p className="text-sm">
                            {formatDate(project.startDate)} - {project.isOngoing ? 'Present' : formatDate(project.endDate)}
                          </p>
                        )}
                      </div>
                      <p className="text-sm mb-1">
                        <span className="font-medium">Tech Stack: </span>
                        {Array.isArray(project.techStack) ? project.techStack.join(', ') : project.techStack}
                      </p>
                      {project.description && <p className="text-sm mb-2">{project.description}</p>}
                      {project.projectUrl && (
                        <p className="text-xs">
                          <a 
                            href={project.projectUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="hover:underline"
                            style={{ color: resumeStyles.secondaryColor }}
                          >
                            View Project
                          </a>
                          {project.repoUrl && ' | '}
                          {project.repoUrl && (
                            <a 
                              href={project.repoUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="hover:underline"
                              style={{ color: resumeStyles.secondaryColor }}
                            >
                              View Code
                            </a>
                          )}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Skills */}
            {personalDetails?.skills && (
              <div className="mb-6">
                <h2 className="text-lg font-bold border-b pb-1 mb-3" style={{ color: resumeStyles.secondaryColor }}>
                  Skills
                </h2>
                <div className="flex flex-wrap gap-2">
                  {Array.isArray(personalDetails.skills) 
                    ? personalDetails.skills.map((skill, index) => (
                        <span 
                          key={index} 
                          className="px-2 py-1 bg-gray-100 rounded-md text-sm"
                        >
                          {skill}
                        </span>
                      ))
                    : typeof personalDetails.skills === 'string' && personalDetails.skills.split(',').map((skill, index) => (
                        <span 
                          key={index} 
                          className="px-2 py-1 bg-gray-100 rounded-md text-sm"
                        >
                          {skill.trim()}
                        </span>
                      ))
                  }
                </div>
              </div>
            )}
            
            <div className="text-sm text-center text-gray-400 mt-8">
              <p>This is a simplified preview. Export to PDF or DOCX for the full formatted resume.</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ResumePreviewPage;