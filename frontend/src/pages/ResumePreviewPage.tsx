import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { getFullResumeData, exportResumeAsPDF, exportResumeAsDOCX, FullResumeData } from '../services/resumes';
import { ResumeTemplate } from '../services/resumeTemplates';

// Resume Template Components
const MinimalTemplate = ({ data }: { data: FullResumeData }) => {
  const { personalInfo, education, workExperiences, projects, resumeInfo, template } = data;
  
  return (
    <div
      className="bg-white shadow-md rounded-lg p-8 max-w-4xl mx-auto"
      style={{
        fontFamily: resumeInfo.customFontFamily || template.fontFamily || 'Arial, sans-serif',
      }}
    >
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold">{personalInfo.name}</h1>
        {personalInfo.title && <p className="text-xl text-gray-700 mt-1">{personalInfo.title}</p>}
        
        {/* Contact Info */}
        <div className="flex flex-wrap justify-center gap-3 mt-3 text-sm">
          {personalInfo.phone && (
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
              </svg>
              {personalInfo.phone}
            </span>
          )}
          {personalInfo.email && (
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
              {personalInfo.email}
            </span>
          )}
          {personalInfo.location && (
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              {`${personalInfo.city}${personalInfo.state ? `, ${personalInfo.state}` : ''}`}
            </span>
          )}
          {personalInfo.linkedIn && (
            <a href={personalInfo.linkedIn} target="_blank" rel="noopener noreferrer" className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              LinkedIn
            </a>
          )}
          {personalInfo.github && (
            <a href={personalInfo.github} target="_blank" rel="noopener noreferrer" className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
              </svg>
              GitHub
            </a>
          )}
          {personalInfo.portfolio && (
            <a href={personalInfo.portfolio} target="_blank" rel="noopener noreferrer" className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path>
              </svg>
              Portfolio
            </a>
          )}
        </div>
      </div>

      {/* Professional Summary */}
      {personalInfo.professionalSummary && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold border-b pb-1 mb-2" style={{ borderColor: resumeInfo.customPrimaryColor || template.primaryColor || '#3b82f6' }}>
            Professional Summary
          </h2>
          <p className="text-gray-700">{personalInfo.professionalSummary}</p>
        </div>
      )}

      {/* Skills */}
      {personalInfo.skills && personalInfo.skills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold border-b pb-1 mb-2" style={{ borderColor: resumeInfo.customPrimaryColor || template.primaryColor || '#3b82f6' }}>
            Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {personalInfo.skills.map((skill, index) => (
              <span key={index} className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Work Experience */}
      {workExperiences && workExperiences.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold border-b pb-1 mb-2" style={{ borderColor: resumeInfo.customPrimaryColor || template.primaryColor || '#3b82f6' }}>
            Work Experience
          </h2>
          {workExperiences.map((experience, index) => (
            <div key={index} className="mb-4">
              <div className="flex flex-col md:flex-row md:justify-between">
                <h3 className="font-medium">{experience.position}</h3>
                <span className="text-gray-600 text-sm">
                  {new Date(experience.startDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })} - 
                  {experience.isCurrentJob 
                    ? ' Present' 
                    : experience.endDate 
                      ? ` ${new Date(experience.endDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })}` 
                      : ' N/A'}
                </span>
              </div>
              <p className="text-gray-700">{experience.company}{experience.location ? `, ${experience.location}` : ''}</p>
              {experience.description && <p className="text-gray-600 text-sm mt-1">{experience.description}</p>}
              {experience.responsibilities && (
                <div className="text-gray-600 text-sm mt-2 whitespace-pre-line">
                  {experience.responsibilities}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold border-b pb-1 mb-2" style={{ borderColor: resumeInfo.customPrimaryColor || template.primaryColor || '#3b82f6' }}>
            Education
          </h2>
          {education.map((edu, index) => (
            <div key={index} className="mb-4">
              <div className="flex flex-col md:flex-row md:justify-between">
                <h3 className="font-medium">{edu.institution}</h3>
                <span className="text-gray-600 text-sm">
                  {new Date(edu.startDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })} - 
                  {edu.isCurrentlyStudying 
                    ? ' Present' 
                    : edu.endDate 
                      ? ` ${new Date(edu.endDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })}` 
                      : ' N/A'}
                </span>
              </div>
              <p className="text-gray-700">
                {edu.degree}
                {edu.fieldOfStudy ? `, ${edu.fieldOfStudy}` : ''}
              </p>
              {edu.description && <p className="text-gray-600 text-sm mt-1">{edu.description}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold border-b pb-1 mb-2" style={{ borderColor: resumeInfo.customPrimaryColor || template.primaryColor || '#3b82f6' }}>
            Projects
          </h2>
          {projects.map((project, index) => (
            <div key={index} className="mb-4">
              <div className="flex flex-col md:flex-row md:justify-between">
                <h3 className="font-medium">{project.name}</h3>
                {(project.startDate || project.endDate) && (
                  <span className="text-gray-600 text-sm">
                    {project.startDate ? new Date(project.startDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' }) : ''} 
                    {project.startDate && (project.endDate || project.isOngoing) ? ' - ' : ''}
                    {project.isOngoing ? 'Present' : project.endDate ? new Date(project.endDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' }) : ''}
                  </span>
                )}
              </div>
              <p className="text-gray-600 mt-1">{project.description}</p>
              {project.techStack && project.techStack.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {project.techStack.map((tech, techIndex) => (
                    <span key={techIndex} className="bg-gray-100 text-gray-800 px-2 py-0.5 text-xs rounded">
                      {tech}
                    </span>
                  ))}
                </div>
              )}
              <div className="flex mt-1 gap-4">
                {project.repoUrl && (
                  <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
                    Repository
                  </a>
                )}
                {project.projectUrl && (
                  <a href={project.projectUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
                    Live Demo
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const ModernTemplate = ({ data }: { data: FullResumeData }) => {
  // Similar to MinimalTemplate but with different styling
  const { personalInfo, education, workExperiences, projects, resumeInfo, template } = data;

  const primaryColor = resumeInfo.customPrimaryColor || template.primaryColor || '#4f46e5';

  return (
    <div
      className="bg-white shadow-md rounded-lg overflow-hidden max-w-4xl mx-auto"
      style={{
        fontFamily: resumeInfo.customFontFamily || template.fontFamily || 'Arial, sans-serif',
      }}
    >
      {/* Header */}
      <div className="p-8" style={{ backgroundColor: primaryColor }}>
        <h1 className="text-3xl font-bold text-white">{personalInfo.name}</h1>
        {personalInfo.title && <p className="text-xl text-white opacity-90 mt-1">{personalInfo.title}</p>}
      </div>
      
      <div className="p-8">
        {/* Contact Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-sm">
          <div>
            {personalInfo.phone && (
              <div className="flex items-center mb-2">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                </svg>
                {personalInfo.phone}
              </div>
            )}
            {personalInfo.email && (
              <div className="flex items-center mb-2">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
                {personalInfo.email}
              </div>
            )}
          </div>
          <div>
            {personalInfo.location && (
              <div className="flex items-center mb-2">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                {`${personalInfo.city}${personalInfo.state ? `, ${personalInfo.state}` : ''}`}
              </div>
            )}
            <div className="flex space-x-3">
              {personalInfo.linkedIn && (
                <a href={personalInfo.linkedIn} target="_blank" rel="noopener noreferrer" className="flex items-center">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              )}
              {personalInfo.github && (
                <a href={personalInfo.github} target="_blank" rel="noopener noreferrer" className="flex items-center">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                  </svg>
                </a>
              )}
              {personalInfo.portfolio && (
                <a href={personalInfo.portfolio} target="_blank" rel="noopener noreferrer" className="flex items-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path>
                  </svg>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Professional Summary */}
        {personalInfo.professionalSummary && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3" style={{ color: primaryColor }}>
              Professional Summary
            </h2>
            <p className="text-gray-700">{personalInfo.professionalSummary}</p>
          </div>
        )}

        {/* Skills */}
        {personalInfo.skills && personalInfo.skills.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3" style={{ color: primaryColor }}>
              Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {personalInfo.skills.map((skill, index) => (
                <span key={index} className="px-3 py-1 rounded-full text-sm" style={{ backgroundColor: `${primaryColor}20`, color: primaryColor }}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Work Experience */}
        {workExperiences && workExperiences.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3" style={{ color: primaryColor }}>
              Work Experience
            </h2>
            {workExperiences.map((experience, index) => (
              <div key={index} className="mb-4 border-l-4 pl-4" style={{ borderColor: `${primaryColor}60` }}>
                <div className="flex flex-col md:flex-row md:justify-between">
                  <h3 className="font-medium">{experience.position}</h3>
                  <span className="text-gray-600 text-sm">
                    {new Date(experience.startDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })} - 
                    {experience.isCurrentJob 
                      ? ' Present' 
                      : experience.endDate 
                        ? ` ${new Date(experience.endDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })}` 
                        : ' N/A'}
                  </span>
                </div>
                <p className="text-gray-700 font-medium">{experience.company}{experience.location ? `, ${experience.location}` : ''}</p>
                {experience.description && <p className="text-gray-600 text-sm mt-1">{experience.description}</p>}
                {experience.responsibilities && (
                  <div className="text-gray-600 text-sm mt-2 whitespace-pre-line">
                    {experience.responsibilities}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Education */}
        {education && education.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3" style={{ color: primaryColor }}>
              Education
            </h2>
            {education.map((edu, index) => (
              <div key={index} className="mb-4 border-l-4 pl-4" style={{ borderColor: `${primaryColor}40` }}>
                <div className="flex flex-col md:flex-row md:justify-between">
                  <h3 className="font-medium">{edu.institution}</h3>
                  <span className="text-gray-600 text-sm">
                    {new Date(edu.startDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })} - 
                    {edu.isCurrentlyStudying 
                      ? ' Present' 
                      : edu.endDate 
                        ? ` ${new Date(edu.endDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })}` 
                        : ' N/A'}
                  </span>
                </div>
                <p className="text-gray-700 font-medium">
                  {edu.degree}
                  {edu.fieldOfStudy ? `, ${edu.fieldOfStudy}` : ''}
                </p>
                {edu.description && <p className="text-gray-600 text-sm mt-1">{edu.description}</p>}
              </div>
            ))}
          </div>
        )}

        {/* Projects */}
        {projects && projects.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3" style={{ color: primaryColor }}>
              Projects
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.map((project, index) => (
                <div key={index} className="border rounded-md p-4">
                  <h3 className="font-medium">{project.name}</h3>
                  {(project.startDate || project.endDate) && (
                    <p className="text-gray-600 text-sm">
                      {project.startDate ? new Date(project.startDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' }) : ''} 
                      {project.startDate && (project.endDate || project.isOngoing) ? ' - ' : ''}
                      {project.isOngoing ? 'Present' : project.endDate ? new Date(project.endDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' }) : ''}
                    </p>
                  )}
                  <p className="text-gray-600 text-sm mt-1">{project.description}</p>
                  {project.techStack && project.techStack.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {project.techStack.map((tech, techIndex) => (
                        <span key={techIndex} className="px-2 py-0.5 text-xs rounded" style={{ backgroundColor: `${primaryColor}20`, color: primaryColor }}>
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex mt-2 gap-4">
                    {project.repoUrl && (
                      <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="text-sm hover:underline" style={{ color: primaryColor }}>
                        Repository
                      </a>
                    )}
                    {project.projectUrl && (
                      <a href={project.projectUrl} target="_blank" rel="noopener noreferrer" className="text-sm hover:underline" style={{ color: primaryColor }}>
                        Live Demo
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Map template names to components
const templateMap: Record<string, React.FC<{ data: FullResumeData }>> = {
  'minimal': MinimalTemplate,
  'modern': ModernTemplate,
  // Add more templates as needed
};

const ResumePreviewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [resumeData, setResumeData] = useState<FullResumeData | null>(null);
  const [exportLoading, setExportLoading] = useState(false);

  useEffect(() => {
    const fetchResumeData = async () => {
      try {
        if (!id) {
          throw new Error('Resume ID is required');
        }
        
        setLoading(true);
        const data = await getFullResumeData(Number(id));
        setResumeData(data);
      } catch (err) {
        console.error('Error fetching resume data:', err);
        setError('Failed to load resume data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchResumeData();
  }, [id]);

  const handleExportPDF = async () => {
    try {
      if (!resumeData) return;
      
      setExportLoading(true);
      const pdfBlob = await exportResumeAsPDF(resumeData);
      
      // Create a download link
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${resumeData.resumeInfo.name || 'resume'}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      setExportLoading(false);
    } catch (err) {
      console.error('Error exporting PDF:', err);
      setError('Failed to export resume as PDF. Please try again later.');
      setExportLoading(false);
    }
  };

  const handleExportDOCX = async () => {
    try {
      if (!resumeData) return;
      
      setExportLoading(true);
      const docxBlob = await exportResumeAsDOCX(resumeData);
      
      // Create a download link
      const url = URL.createObjectURL(docxBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${resumeData.resumeInfo.name || 'resume'}.docx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      setExportLoading(false);
    } catch (err) {
      console.error('Error exporting DOCX:', err);
      setError('Failed to export resume as DOCX. Please try again later.');
      setExportLoading(false);
    }
  };

  const renderTemplate = () => {
    if (!resumeData) return null;
    
    const templateName = resumeData.template.layout || 'minimal';
    const TemplateComponent = templateMap[templateName] || MinimalTemplate;
    
    return <TemplateComponent data={resumeData} />;
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Resume Preview</h1>
          <div className="flex space-x-2">
            <button
              onClick={() => navigate(`/resume-builder/${id}`)}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition duration-300"
            >
              Edit Resume
            </button>
            <button
              onClick={handleExportPDF}
              disabled={exportLoading || !resumeData}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300 disabled:bg-blue-300"
            >
              {exportLoading ? 'Exporting...' : 'Export PDF'}
            </button>
            <button
              onClick={handleExportDOCX}
              disabled={exportLoading || !resumeData}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300 disabled:bg-green-300"
            >
              {exportLoading ? 'Exporting...' : 'Export DOCX'}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p>Loading resume preview...</p>
          </div>
        ) : (
          <div className="bg-gray-100 p-8 rounded-lg shadow-inner">
            {renderTemplate()}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ResumePreviewPage;