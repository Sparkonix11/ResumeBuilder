import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Layout from '../components/Layout';
import { 
  getAllResumes, 
  getResumeById, 
  createResume, 
  updateResume, 
  deleteResume,
  exportResumeToPDF,
  exportResumeToDOCX,
  Resume 
} from '../services/resumes';
import { getAllTemplates, ResumeTemplate } from '../services/resumeTemplates';
import { getAllEducation, Education } from '../services/education';
import { getAllWorkExperiences, WorkExperience } from '../services/workExperience';
import { getAllProjects, Project } from '../services/projects';
import { getPersonalDetails, PersonalDetail } from '../services/personalDetails';

// Validation schema for resume form
const ResumeSchema = Yup.object().shape({
  name: Yup.string().required('Resume name is required'),
  templateId: Yup.number().required('Template selection is required'),
  selectedEducation: Yup.array().min(1, 'Select at least one education entry'),
  selectedWorkExperiences: Yup.array().min(1, 'Select at least one work experience'),
  selectedProjects: Yup.array(),
  customPrimaryColor: Yup.string(),
  customSecondaryColor: Yup.string(),
  customFontFamily: Yup.string(),
});

const ResumeBuilderPage = () => {
  const navigate = useNavigate();
  const [resumeList, setResumeList] = useState<Resume[]>([]);
  const [templates, setTemplates] = useState<ResumeTemplate[]>([]);
  const [currentResume, setCurrentResume] = useState<Resume | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  const [submitStatus, setSubmitStatus] = useState<{ success?: string; error?: string } | null>(null);
  const [hasPersonalDetails, setHasPersonalDetails] = useState<boolean>(false);
  
  // Available data for resume creation
  const [education, setEducation] = useState<Education[]>([]);
  const [workExperiences, setWorkExperiences] = useState<WorkExperience[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setIsLoading(true);
      const [
        resumesData,
        templatesData,
        personalDetailsData,
        educationData,
        workExperiencesData,
        projectsData
      ] = await Promise.all([
        getAllResumes().catch(() => [] as Resume[]),
        getAllTemplates().catch(() => [] as ResumeTemplate[]),
        getPersonalDetails().catch(() => null as PersonalDetail | null),
        getAllEducation().catch(() => [] as Education[]),
        getAllWorkExperiences().catch(() => [] as WorkExperience[]),
        getAllProjects().catch(() => [] as Project[])
      ]);

      setResumeList(resumesData);
      setTemplates(templatesData);
      setHasPersonalDetails(!!personalDetailsData);
      setEducation(educationData);
      setWorkExperiences(workExperiencesData);
      setProjects(projectsData);
      
    } catch (error) {
      console.error('Error fetching initial data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNew = () => {
    setCurrentResume(null);
    setFormMode('add');
  };

  const handleEdit = async (id: number) => {
    try {
      setIsLoading(true);
      const resume = await getResumeById(id);
      setCurrentResume(resume);
      setFormMode('edit');
    } catch (error) {
      console.error(`Error fetching resume with id ${id}:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this resume?')) {
      try {
        await deleteResume(id);
        setSubmitStatus({ success: 'Resume deleted successfully!' });
        fetchInitialData();
      } catch (error) {
        console.error(`Error deleting resume with id ${id}:`, error);
        setSubmitStatus({ error: 'Failed to delete resume. Please try again.' });
      }
      
      // Clear success message after 3 seconds
      setTimeout(() => setSubmitStatus(null), 3000);
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      setSubmitStatus(null);
      
      const resumeData = {
        ...values,
        selectedEducation: values.selectedEducation.join(','),
        selectedWorkExperiences: values.selectedWorkExperiences.join(','),
        selectedProjects: values.selectedProjects.join(',')
      };
      
      if (formMode === 'add') {
        const newResume = await createResume(resumeData);
        setSubmitStatus({ success: 'Resume created successfully!' });
        // Open the new resume in preview mode
        navigate(`/resume-preview/${newResume.id}`);
      } else {
        await updateResume(currentResume!.id!, resumeData);
        setSubmitStatus({ success: 'Resume updated successfully!' });
        navigate(`/resume-preview/${currentResume!.id}`);
      }
      
      fetchInitialData();
    } catch (error) {
      console.error('Error submitting resume form:', error);
      setSubmitStatus({ error: 'Failed to save resume. Please try again.' });
    }
  };

  const handleExport = async (id: number, format: 'pdf' | 'docx') => {
    try {
      setIsLoading(true);
      
      let blob;
      let filename;
      
      if (format === 'pdf') {
        blob = await exportResumeToPDF(id);
        filename = `resume_${id}.pdf`;
      } else {
        blob = await exportResumeToDOCX(id);
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
      
      setSubmitStatus({ success: `Resume exported as ${format.toUpperCase()} successfully!` });
    } catch (error) {
      console.error(`Error exporting resume to ${format}:`, error);
      setSubmitStatus({ error: `Failed to export resume as ${format.toUpperCase()}. Please try again.` });
    } finally {
      setIsLoading(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSubmitStatus(null), 3000);
    }
  };

  const handlePreview = (id: number) => {
    navigate(`/resume-preview/${id}`);
  };

  // Process data for form initial values
  const getInitialValues = () => {
    if (currentResume) {
      return {
        ...currentResume,
        selectedEducation: currentResume.selectedEducation 
          ? typeof currentResume.selectedEducation === 'string' 
            ? currentResume.selectedEducation.split(',') 
            : currentResume.selectedEducation
          : [],
        selectedWorkExperiences: currentResume.selectedWorkExperiences
          ? typeof currentResume.selectedWorkExperiences === 'string'
            ? currentResume.selectedWorkExperiences.split(',')
            : currentResume.selectedWorkExperiences
          : [],
        selectedProjects: currentResume.selectedProjects
          ? typeof currentResume.selectedProjects === 'string'
            ? currentResume.selectedProjects.split(',')
            : currentResume.selectedProjects
          : [],
      };
    }
    
    return {
      name: '',
      templateId: templates.length > 0 ? templates[0].id : '',
      selectedEducation: [],
      selectedWorkExperiences: [],
      selectedProjects: [],
      customPrimaryColor: '',
      customSecondaryColor: '',
      customFontFamily: '',
    };
  };

  // Check if user has the necessary data to create a resume
  const canCreateResume = hasPersonalDetails && education.length > 0 && workExperiences.length > 0;

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Resume Builder</h1>
            <p className="text-gray-600 mt-2">
              Create and manage your professional resumes
            </p>
          </div>
          {canCreateResume && (
            <button
              onClick={handleAddNew}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Create New Resume
            </button>
          )}
        </div>

        {!canCreateResume && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  {!hasPersonalDetails && <span>Please complete your <a href="/personal-details" className="font-medium underline text-yellow-700 hover:text-yellow-600">personal details</a> first. </span>}
                  {education.length === 0 && <span>Add your <a href="/education" className="font-medium underline text-yellow-700 hover:text-yellow-600">education information</a>. </span>}
                  {workExperiences.length === 0 && <span>Add your <a href="/work-experience" className="font-medium underline text-yellow-700 hover:text-yellow-600">work experience</a>. </span>}
                </p>
              </div>
            </div>
          </div>
        )}

        {submitStatus?.success && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6" role="alert">
            <p>{submitStatus.success}</p>
          </div>
        )}

        {submitStatus?.error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
            <p>{submitStatus.error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Resume List */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Your Resumes</h2>
              
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : resumeList.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No resumes yet.</p>
                  {canCreateResume && (
                    <p>Click "Create New Resume" to get started.</p>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {resumeList.map((resume) => (
                    <div key={resume.id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <h3 className="font-semibold text-gray-800">{resume.name}</h3>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <button 
                          onClick={() => handlePreview(resume.id!)}
                          className="text-sm px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                        >
                          Preview
                        </button>
                        <button 
                          onClick={() => handleEdit(resume.id!)}
                          className="text-sm px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleExport(resume.id!, 'pdf')}
                          className="text-sm px-2 py-1 bg-purple-100 text-purple-700 rounded hover:bg-purple-200"
                        >
                          Export PDF
                        </button>
                        <button 
                          onClick={() => handleExport(resume.id!, 'docx')}
                          className="text-sm px-2 py-1 bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200"
                        >
                          Export DOCX
                        </button>
                        <button 
                          onClick={() => handleDelete(resume.id!)}
                          className="text-sm px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Resume Form */}
          {(canCreateResume && (formMode === 'add' || currentResume)) && (
            <div className="lg:col-span-2">
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">
                  {formMode === 'add' ? 'Create New Resume' : 'Edit Resume'}
                </h2>

                <Formik
                  initialValues={getInitialValues()}
                  validationSchema={ResumeSchema}
                  onSubmit={handleSubmit}
                  enableReinitialize
                >
                  {({ isSubmitting, values, setFieldValue }) => (
                    <Form>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Resume Name *
                          </label>
                          <Field
                            id="name"
                            name="name"
                            type="text"
                            placeholder="e.g. Software Developer Resume, Tech Lead Resume"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                          <ErrorMessage name="name" component="div" className="text-red-500 text-xs mt-1" />
                        </div>

                        <div className="md:col-span-2">
                          <label htmlFor="templateId" className="block text-sm font-medium text-gray-700">
                            Resume Template *
                          </label>
                          <Field
                            as="select"
                            id="templateId"
                            name="templateId"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="">Select a template</option>
                            {templates.map(template => (
                              <option key={template.id} value={template.id}>
                                {template.name}
                              </option>
                            ))}
                          </Field>
                          <ErrorMessage name="templateId" component="div" className="text-red-500 text-xs mt-1" />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Education *
                          </label>
                          <div className="space-y-2 max-h-40 overflow-y-auto p-2 border border-gray-300 rounded-md">
                            {education.map(edu => (
                              <div key={edu.id} className="flex items-center">
                                <Field
                                  type="checkbox"
                                  name="selectedEducation"
                                  value={edu.id!.toString()}
                                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label className="ml-2 block text-sm text-gray-700">
                                  {edu.degree}{edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ''} at {edu.institution}
                                </label>
                              </div>
                            ))}
                          </div>
                          <ErrorMessage name="selectedEducation" component="div" className="text-red-500 text-xs mt-1" />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Work Experience *
                          </label>
                          <div className="space-y-2 max-h-40 overflow-y-auto p-2 border border-gray-300 rounded-md">
                            {workExperiences.map(exp => (
                              <div key={exp.id} className="flex items-center">
                                <Field
                                  type="checkbox"
                                  name="selectedWorkExperiences"
                                  value={exp.id!.toString()}
                                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label className="ml-2 block text-sm text-gray-700">
                                  {exp.position} at {exp.company}
                                </label>
                              </div>
                            ))}
                          </div>
                          <ErrorMessage name="selectedWorkExperiences" component="div" className="text-red-500 text-xs mt-1" />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Projects
                          </label>
                          <div className="space-y-2 max-h-40 overflow-y-auto p-2 border border-gray-300 rounded-md">
                            {projects.map(project => (
                              <div key={project.id} className="flex items-center">
                                <Field
                                  type="checkbox"
                                  name="selectedProjects"
                                  value={project.id!.toString()}
                                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label className="ml-2 block text-sm text-gray-700">
                                  {project.name}
                                </label>
                              </div>
                            ))}
                          </div>
                          <ErrorMessage name="selectedProjects" component="div" className="text-red-500 text-xs mt-1" />
                        </div>

                        <div>
                          <label htmlFor="customPrimaryColor" className="block text-sm font-medium text-gray-700">
                            Primary Color (optional)
                          </label>
                          <div className="mt-1 flex items-center">
                            <input
                              id="customPrimaryColor-picker"
                              type="color"
                              value={values.customPrimaryColor || '#000000'}
                              onChange={(e) => setFieldValue('customPrimaryColor', e.target.value)}
                              className="h-8 w-8 rounded-md border border-gray-300 cursor-pointer"
                            />
                            <Field
                              id="customPrimaryColor"
                              name="customPrimaryColor"
                              type="text"
                              placeholder="#000000"
                              className="ml-2 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                          <ErrorMessage name="customPrimaryColor" component="div" className="text-red-500 text-xs mt-1" />
                        </div>

                        <div>
                          <label htmlFor="customSecondaryColor" className="block text-sm font-medium text-gray-700">
                            Secondary Color (optional)
                          </label>
                          <div className="mt-1 flex items-center">
                            <input
                              id="customSecondaryColor-picker"
                              type="color"
                              value={values.customSecondaryColor || '#4A90E2'}
                              onChange={(e) => setFieldValue('customSecondaryColor', e.target.value)}
                              className="h-8 w-8 rounded-md border border-gray-300 cursor-pointer"
                            />
                            <Field
                              id="customSecondaryColor"
                              name="customSecondaryColor"
                              type="text"
                              placeholder="#4A90E2"
                              className="ml-2 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                          <ErrorMessage name="customSecondaryColor" component="div" className="text-red-500 text-xs mt-1" />
                        </div>

                        <div className="md:col-span-2">
                          <label htmlFor="customFontFamily" className="block text-sm font-medium text-gray-700">
                            Font Family (optional)
                          </label>
                          <Field
                            as="select"
                            id="customFontFamily"
                            name="customFontFamily"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="">Default Font</option>
                            <option value="Arial, sans-serif">Arial</option>
                            <option value="Helvetica, Arial, sans-serif">Helvetica</option>
                            <option value="Georgia, serif">Georgia</option>
                            <option value="'Times New Roman', Times, serif">Times New Roman</option>
                            <option value="'Courier New', Courier, monospace">Courier New</option>
                            <option value="Verdana, Geneva, sans-serif">Verdana</option>
                          </Field>
                          <ErrorMessage name="customFontFamily" component="div" className="text-red-500 text-xs mt-1" />
                        </div>
                      </div>

                      <div className="flex justify-end mt-6 space-x-3">
                        <button
                          type="button"
                          onClick={() => setFormMode('add')}
                          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                        >
                          {isSubmitting ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Saving...
                            </>
                          ) : (
                            formMode === 'add' ? 'Create Resume' : 'Update Resume'
                          )}
                        </button>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ResumeBuilderPage;