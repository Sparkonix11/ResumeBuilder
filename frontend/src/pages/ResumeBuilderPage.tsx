import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import Layout from '../components/Layout';
import { 
  getAllResumes, 
  getResumeById, 
  createResume, 
  updateResume, 
  Resume 
} from '../services/resumes';
import { getAllTemplates, ResumeTemplate } from '../services/resumeTemplates';
import { getAllEducation, Education } from '../services/education';
import { getAllWorkExperiences, WorkExperience } from '../services/workExperience';
import { getAllProjects, Project } from '../services/projects';

const resumeSchema = Yup.object().shape({
  name: Yup.string().required('Resume name is required'),
  templateId: Yup.number().required('Please select a template'),
  selectedProjects: Yup.array().of(Yup.number()),
  selectedWorkExperiences: Yup.array().of(Yup.number()),
  selectedEducation: Yup.array().of(Yup.number()),
  customFontFamily: Yup.string().nullable(),
  customPrimaryColor: Yup.string().nullable(),
  customSecondaryColor: Yup.string().nullable(),
});

const ResumeBuilderPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [templates, setTemplates] = useState<ResumeTemplate[]>([]);
  const [educationList, setEducationList] = useState<Education[]>([]);
  const [workExperiences, setWorkExperiences] = useState<WorkExperience[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentResume, setCurrentResume] = useState<Resume | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch all templates
        const templateData = await getAllTemplates();
        setTemplates(templateData);

        // Fetch all education entries
        const educationData = await getAllEducation();
        setEducationList(educationData);

        // Fetch all work experiences
        const experienceData = await getAllWorkExperiences();
        setWorkExperiences(experienceData);

        // Fetch all projects
        const projectData = await getAllProjects();
        setProjects(projectData);

        // If we're editing an existing resume
        if (id) {
          const resumeData = await getResumeById(Number(id));
          setCurrentResume(resumeData);
          setIsEditMode(true);
        }

        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load necessary data. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = async (values: any) => {
    try {
      if (isEditMode && currentResume?.id) {
        await updateResume(currentResume.id, values);
        setSuccess('Resume updated successfully!');
        navigate(`/resume-preview/${currentResume.id}`);
      } else {
        const newResume = await createResume(values);
        setSuccess('Resume created successfully!');
        navigate(`/resume-preview/${newResume.id}`);
      }
    } catch (err) {
      console.error('Error saving resume:', err);
      setError('Failed to save resume. Please try again.');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <p>Loading resume builder data...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">
            {isEditMode ? 'Edit Resume' : 'Create New Resume'}
          </h1>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{success}</span>
          </div>
        )}

        <div className="bg-white p-6 rounded-lg shadow-md">
          <Formik
            initialValues={
              currentResume
                ? {
                    name: currentResume.name,
                    templateId: currentResume.templateId || 1,
                    selectedProjects: currentResume.selectedProjects || [],
                    selectedWorkExperiences: currentResume.selectedWorkExperiences || [],
                    selectedEducation: currentResume.selectedEducation || [],
                    customFontFamily: currentResume.customFontFamily || '',
                    customPrimaryColor: currentResume.customPrimaryColor || '',
                    customSecondaryColor: currentResume.customSecondaryColor || '',
                  }
                : {
                    name: '',
                    templateId: 1,
                    selectedProjects: [],
                    selectedWorkExperiences: [],
                    selectedEducation: [],
                    customFontFamily: '',
                    customPrimaryColor: '',
                    customSecondaryColor: '',
                  }
            }
            validationSchema={resumeSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, values, setFieldValue }) => (
              <Form className="space-y-8">
                {/* Basic Resume Information */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Resume Information</h2>
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Resume Name
                    </label>
                    <Field
                      type="text"
                      name="name"
                      id="name"
                      placeholder="e.g. Software Developer Resume"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Resume Template Selection */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Select Template</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {templates.map((template) => (
                      <label key={template.id} className={`block cursor-pointer relative`}>
                        <input
                          type="radio"
                          name="templateId"
                          value={template.id}
                          checked={values.templateId === template.id}
                          onChange={() => setFieldValue('templateId', template.id)}
                          className="sr-only"
                        />
                        <div 
                          className={`border-2 rounded-lg overflow-hidden ${
                            values.templateId === template.id ? 'border-blue-500' : 'border-gray-200'
                          }`}
                        >
                          {template.previewImage ? (
                            <img
                              src={template.previewImage}
                              alt={template.name}
                              className="w-full h-48 object-cover"
                            />
                          ) : (
                            <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-500">
                              No preview available
                            </div>
                          )}
                          <div className="p-3">
                            <h3 className="font-medium">{template.name}</h3>
                            {template.description && (
                              <p className="text-gray-500 text-sm">{template.description}</p>
                            )}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Customization Options */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Customize</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="customFontFamily" className="block text-sm font-medium text-gray-700 mb-1">
                        Font Family (Optional)
                      </label>
                      <Field
                        as="select"
                        name="customFontFamily"
                        id="customFontFamily"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Default</option>
                        <option value="Arial, sans-serif">Arial</option>
                        <option value="Helvetica, sans-serif">Helvetica</option>
                        <option value="Times New Roman, serif">Times New Roman</option>
                        <option value="Georgia, serif">Georgia</option>
                        <option value="Courier New, monospace">Courier New</option>
                      </Field>
                    </div>
                    <div>
                      <label htmlFor="customPrimaryColor" className="block text-sm font-medium text-gray-700 mb-1">
                        Primary Color (Optional)
                      </label>
                      <Field
                        type="color"
                        name="customPrimaryColor"
                        id="customPrimaryColor"
                        className="w-full h-10 px-3 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label htmlFor="customSecondaryColor" className="block text-sm font-medium text-gray-700 mb-1">
                        Secondary Color (Optional)
                      </label>
                      <Field
                        type="color"
                        name="customSecondaryColor"
                        id="customSecondaryColor"
                        className="w-full h-10 px-3 border border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                </div>

                {/* Education Selection */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Select Education</h2>
                  {educationList.length === 0 ? (
                    <p className="text-gray-500">
                      No education entries found. <a href="/education" className="text-blue-600 hover:underline">Add education</a> first.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {educationList.map((education) => (
                        <label key={education.id} className="flex items-start space-x-3">
                          <Field
                            type="checkbox"
                            name="selectedEducation"
                            value={education.id}
                            checked={values.selectedEducation.includes(education.id!)}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                              const checked = e.target.checked;
                              const id = education.id!;
                              setFieldValue(
                                'selectedEducation',
                                checked
                                  ? [...values.selectedEducation, id]
                                  : values.selectedEducation.filter((itemId: number) => itemId !== id)
                              );
                            }}
                            className="h-4 w-4 mt-1 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <div>
                            <p className="font-medium">{education.institution}</p>
                            <p className="text-gray-600 text-sm">{education.degree}{education.fieldOfStudy ? `, ${education.fieldOfStudy}` : ''}</p>
                            <p className="text-gray-500 text-xs">
                              {new Date(education.startDate).getFullYear()} - 
                              {education.isCurrentlyStudying 
                                ? 'Present' 
                                : education.endDate 
                                  ? new Date(education.endDate).getFullYear() 
                                  : 'N/A'}
                            </p>
                          </div>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Work Experience Selection */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Select Work Experience</h2>
                  {workExperiences.length === 0 ? (
                    <p className="text-gray-500">
                      No work experience entries found. <a href="/work-experience" className="text-blue-600 hover:underline">Add work experience</a> first.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {workExperiences.map((experience) => (
                        <label key={experience.id} className="flex items-start space-x-3">
                          <Field
                            type="checkbox"
                            name="selectedWorkExperiences"
                            value={experience.id}
                            checked={values.selectedWorkExperiences.includes(experience.id!)}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                              const checked = e.target.checked;
                              const id = experience.id!;
                              setFieldValue(
                                'selectedWorkExperiences',
                                checked
                                  ? [...values.selectedWorkExperiences, id]
                                  : values.selectedWorkExperiences.filter((itemId: number) => itemId !== id)
                              );
                            }}
                            className="h-4 w-4 mt-1 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <div>
                            <p className="font-medium">{experience.position}</p>
                            <p className="text-gray-600 text-sm">{experience.company}</p>
                            <p className="text-gray-500 text-xs">
                              {new Date(experience.startDate).getFullYear()} - 
                              {experience.isCurrentJob 
                                ? 'Present' 
                                : experience.endDate 
                                  ? new Date(experience.endDate).getFullYear() 
                                  : 'N/A'}
                            </p>
                          </div>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Projects Selection */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Select Projects</h2>
                  {projects.length === 0 ? (
                    <p className="text-gray-500">
                      No projects found. <a href="/projects" className="text-blue-600 hover:underline">Add projects</a> first.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {projects.map((project) => (
                        <label key={project.id} className="flex items-start space-x-3">
                          <Field
                            type="checkbox"
                            name="selectedProjects"
                            value={project.id}
                            checked={values.selectedProjects.includes(project.id!)}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                              const checked = e.target.checked;
                              const id = project.id!;
                              setFieldValue(
                                'selectedProjects',
                                checked
                                  ? [...values.selectedProjects, id]
                                  : values.selectedProjects.filter((itemId: number) => itemId !== id)
                              );
                            }}
                            className="h-4 w-4 mt-1 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <div>
                            <p className="font-medium">{project.name}</p>
                            <p className="text-gray-600 text-sm line-clamp-1">{project.description}</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {project.techStack && project.techStack.slice(0, 3).map((tech, index) => (
                                <span key={index} className="bg-gray-100 text-gray-800 px-2 text-xs rounded">
                                  {tech}
                                </span>
                              ))}
                              {project.techStack && project.techStack.length > 3 && (
                                <span className="text-gray-500 text-xs">+{project.techStack.length - 3} more</span>
                              )}
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => navigate('/')}
                    className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
                  >
                    {isSubmitting ? 'Saving...' : isEditMode ? 'Update Resume' : 'Create Resume'}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </Layout>
  );
};

export default ResumeBuilderPage;