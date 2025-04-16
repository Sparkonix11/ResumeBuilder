import { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Layout from '../components/Layout';
import { getAllProjects, getProjectById, createProject, updateProject, deleteProject, Project } from '../services/projects';

const projectSchema = Yup.object().shape({
  name: Yup.string().required('Project name is required'),
  description: Yup.string().required('Project description is required'),
  techStack: Yup.array().of(Yup.string()).min(1, 'Add at least one technology'),
  startDate: Yup.date(),
  endDate: Yup.date().nullable().when('isOngoing', {
    is: false,
    then: Yup.date(),
  }),
  isOngoing: Yup.boolean(),
  repoUrl: Yup.string().url('Enter a valid URL').nullable(),
  projectUrl: Yup.string().url('Enter a valid URL').nullable(),
  image: Yup.string().nullable(),
});

const initialValues = {
  name: '',
  description: '',
  techStack: [] as string[],
  startDate: '',
  endDate: '',
  isOngoing: false,
  repoUrl: '',
  projectUrl: '',
  image: '',
};

const ProjectsPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [techInput, setTechInput] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await getAllProjects();
      setProjects(data);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError('Failed to load projects. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: any, { resetForm }: { resetForm: () => void }) => {
    try {
      if (isEditing && currentProject?.id) {
        await updateProject(currentProject.id, values);
        setSuccess('Project updated successfully!');
      } else {
        await createProject(values);
        setSuccess('Project added successfully!');
      }
      
      // Refresh the list
      await fetchProjects();
      
      // Reset form and editing state
      resetForm();
      setIsEditing(false);
      setCurrentProject(null);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (err) {
      console.error('Error saving project:', err);
      setError('Failed to save project. Please try again.');
    }
  };

  const handleEdit = (project: Project) => {
    setCurrentProject(project);
    setIsEditing(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await deleteProject(id);
        setSuccess('Project deleted successfully!');
        await fetchProjects();
        
        // Hide success message after 3 seconds
        setTimeout(() => {
          setSuccess('');
        }, 3000);
      } catch (err) {
        console.error('Error deleting project:', err);
        setError('Failed to delete project. Please try again.');
      }
    }
  };

  const handleCancel = (resetForm: () => void) => {
    resetForm();
    setIsEditing(false);
    setCurrentProject(null);
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Projects</h1>
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

        {/* Project Form */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">
            {isEditing ? 'Edit Project' : 'Add Project'}
          </h2>
          <Formik
            initialValues={
              currentProject
                ? {
                    ...currentProject,
                    startDate: formatDate(currentProject.startDate),
                    endDate: formatDate(currentProject.endDate),
                  }
                : initialValues
            }
            enableReinitialize={true}
            validationSchema={projectSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, resetForm, values, setFieldValue }) => (
              <Form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Project Name
                    </label>
                    <Field
                      type="text"
                      name="name"
                      id="name"
                      placeholder="Project Name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                    <ErrorMessage name="name" component="p" className="text-red-500 text-xs mt-1" />
                  </div>
                  
                  <div className="flex items-center mt-6">
                    <Field
                      type="checkbox"
                      name="isOngoing"
                      id="isOngoing"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isOngoing" className="ml-2 block text-sm text-gray-700">
                      This is an ongoing project
                    </label>
                  </div>

                  <div>
                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date (Optional)
                    </label>
                    <Field
                      type="date"
                      name="startDate"
                      id="startDate"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                    <ErrorMessage name="startDate" component="p" className="text-red-500 text-xs mt-1" />
                  </div>

                  <div>
                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                      End Date (Optional)
                    </label>
                    <Field
                      type="date"
                      name="endDate"
                      id="endDate"
                      disabled={values.isOngoing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                    />
                    <ErrorMessage name="endDate" component="p" className="text-red-500 text-xs mt-1" />
                  </div>
                  
                  <div>
                    <label htmlFor="repoUrl" className="block text-sm font-medium text-gray-700 mb-1">
                      Repository URL (Optional)
                    </label>
                    <Field
                      type="url"
                      name="repoUrl"
                      id="repoUrl"
                      placeholder="https://github.com/username/repo"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                    <ErrorMessage name="repoUrl" component="p" className="text-red-500 text-xs mt-1" />
                  </div>

                  <div>
                    <label htmlFor="projectUrl" className="block text-sm font-medium text-gray-700 mb-1">
                      Project URL (Optional)
                    </label>
                    <Field
                      type="url"
                      name="projectUrl"
                      id="projectUrl"
                      placeholder="https://myproject.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                    <ErrorMessage name="projectUrl" component="p" className="text-red-500 text-xs mt-1" />
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <Field
                      as="textarea"
                      name="description"
                      id="description"
                      rows={4}
                      placeholder="Describe your project..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                    <ErrorMessage name="description" component="p" className="text-red-500 text-xs mt-1" />
                  </div>

                  {/* Tech Stack */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Technologies Used
                    </label>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {values.techStack.map((tech, index) => (
                        <div key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center">
                          {tech}
                          <button
                            type="button"
                            onClick={() => {
                              const newTechStack = values.techStack.filter((_, i) => i !== index);
                              setFieldValue('techStack', newTechStack);
                            }}
                            className="ml-2 text-blue-600 hover:text-blue-800"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="flex">
                      <input
                        type="text"
                        value={techInput}
                        onChange={(e) => setTechInput(e.target.value)}
                        placeholder="Add a technology..."
                        className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            if (techInput && !values.techStack.includes(techInput)) {
                              setFieldValue('techStack', [...values.techStack, techInput]);
                              setTechInput('');
                            }
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (techInput && !values.techStack.includes(techInput)) {
                            setFieldValue('techStack', [...values.techStack, techInput]);
                            setTechInput('');
                          }
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 transition duration-300"
                      >
                        Add
                      </button>
                    </div>
                    <ErrorMessage name="techStack" component="p" className="text-red-500 text-xs mt-1" />
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  {isEditing && (
                    <button
                      type="button"
                      onClick={() => handleCancel(resetForm)}
                      className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition duration-300"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
                  >
                    {isSubmitting ? 'Saving...' : isEditing ? 'Update Project' : 'Add Project'}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>

        {/* Project List */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Your Projects</h2>
          
          {loading && <p>Loading projects...</p>}
          
          {!loading && projects.length === 0 && (
            <p className="text-gray-500">No projects added yet.</p>
          )}
          
          {!loading && projects.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((project) => (
                <div key={project.id} className="border rounded-lg overflow-hidden shadow-sm">
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-medium">{project.name}</h3>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(project)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => project.id && handleDelete(project.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    
                    {(project.startDate || project.endDate) && (
                      <p className="text-gray-500 text-sm">
                        {project.startDate ? new Date(project.startDate).toLocaleDateString() : ''} 
                        {project.startDate && (project.endDate || project.isOngoing) ? ' - ' : ''}
                        {project.isOngoing ? 'Present' : project.endDate ? new Date(project.endDate).toLocaleDateString() : ''}
                      </p>
                    )}
                    
                    <p className="text-gray-600 mt-2 line-clamp-3">{project.description}</p>
                    
                    <div className="mt-3">
                      <div className="flex flex-wrap gap-2">
                        {project.techStack && project.techStack.map((tech, index) => (
                          <span key={index} className="bg-gray-100 text-gray-800 px-2 py-1 text-xs rounded">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mt-4 flex gap-4">
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
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ProjectsPage;