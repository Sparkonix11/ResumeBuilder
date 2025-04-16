import { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Layout from '../components/Layout';
import { getAllProjects, getProjectById, createProject, updateProject, deleteProject, Project } from '../services/projects';

// Validation schema for project form
const ProjectSchema = Yup.object().shape({
  name: Yup.string().required('Project name is required'),
  description: Yup.string().required('Description is required'),
  techStack: Yup.string().required('Tech stack is required'),
  startDate: Yup.date(),
  endDate: Yup.date().when('isOngoing', {
    is: false,
    then: Yup.date(),
  }),
  isOngoing: Yup.boolean(),
  projectUrl: Yup.string().url('Must be a valid URL'),
  repoUrl: Yup.string().url('Must be a valid URL'),
  image: Yup.string(),
});

const ProjectsPage = () => {
  const [projectList, setProjectList] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  const [submitStatus, setSubmitStatus] = useState<{ success?: string; error?: string } | null>(null);

  useEffect(() => {
    fetchProjectList();
  }, []);

  const fetchProjectList = async () => {
    try {
      setIsLoading(true);
      const data = await getAllProjects();
      setProjectList(data);
    } catch (error) {
      console.error('Error fetching project list:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNew = () => {
    setCurrentProject(null);
    setFormMode('add');
  };

  const handleEdit = async (id: number) => {
    try {
      setIsLoading(true);
      const project = await getProjectById(id);
      setCurrentProject(project);
      setFormMode('edit');
    } catch (error) {
      console.error(`Error fetching project with id ${id}:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await deleteProject(id);
        setSubmitStatus({ success: 'Project deleted successfully!' });
        fetchProjectList();
      } catch (error) {
        console.error(`Error deleting project with id ${id}:`, error);
        setSubmitStatus({ error: 'Failed to delete project. Please try again.' });
      }
      
      // Clear success message after 3 seconds
      setTimeout(() => setSubmitStatus(null), 3000);
    }
  };

  const handleSubmit = async (values: Project) => {
    try {
      setSubmitStatus(null);
      
      // Convert techStack from string to array if provided
      if (values.techStack && typeof values.techStack === 'string') {
        values.techStack = values.techStack
          .split(',')
          .map(tech => tech.trim())
          .filter(tech => tech !== '');
      }
      
      if (formMode === 'add') {
        await createProject(values);
        setSubmitStatus({ success: 'Project added successfully!' });
      } else {
        await updateProject(currentProject!.id!, values);
        setSubmitStatus({ success: 'Project updated successfully!' });
      }
      
      fetchProjectList();
      handleAddNew(); // Reset form after submission
      
      // Clear success message after 3 seconds
      setTimeout(() => setSubmitStatus(null), 3000);
    } catch (error) {
      console.error('Error submitting project form:', error);
      setSubmitStatus({ error: 'Failed to save project. Please try again.' });
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  // Initial values for the form
  const initialValues: Project = currentProject ? {
    ...currentProject,
    techStack: Array.isArray(currentProject.techStack) 
      ? currentProject.techStack.join(', ') 
      : currentProject.techStack
  } : {
    name: '',
    description: '',
    techStack: '',
    startDate: '',
    endDate: '',
    isOngoing: false,
    projectUrl: '',
    repoUrl: '',
    image: '',
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Projects</h1>
            <p className="text-gray-600 mt-2">
              Showcase your portfolio of projects and technical achievements
            </p>
          </div>
          <button
            onClick={handleAddNew}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add Project
          </button>
        </div>

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
          {/* Project List */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Your Projects</h2>
              
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : projectList.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No projects yet.</p>
                  <p>Click "Add Project" to get started.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {projectList.map((project) => (
                    <div key={project.id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <h3 className="font-semibold text-gray-800">{project.name}</h3>
                      <p className="text-xs text-gray-500 mt-1">
                        {Array.isArray(project.techStack) 
                          ? project.techStack.join(', ') 
                          : project.techStack}
                      </p>
                      <div className="mt-3 flex justify-end space-x-2">
                        <button 
                          onClick={() => handleEdit(project.id!)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(project.id!)}
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
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

          {/* Project Form */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                {formMode === 'add' ? 'Add New Project' : 'Edit Project'}
              </h2>

              <Formik
                initialValues={initialValues}
                validationSchema={ProjectSchema}
                onSubmit={handleSubmit}
                enableReinitialize
              >
                {({ isSubmitting, values, setFieldValue }) => (
                  <Form>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                          Project Name *
                        </label>
                        <Field
                          id="name"
                          name="name"
                          type="text"
                          placeholder="e.g. E-commerce Website, Task Management App"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <ErrorMessage name="name" component="div" className="text-red-500 text-xs mt-1" />
                      </div>

                      <div className="md:col-span-2">
                        <label htmlFor="techStack" className="block text-sm font-medium text-gray-700">
                          Technology Stack *
                        </label>
                        <Field
                          id="techStack"
                          name="techStack"
                          type="text"
                          placeholder="React, Node.js, MongoDB, etc."
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <p className="mt-1 text-sm text-gray-500">
                          Comma-separated list of technologies used
                        </p>
                        <ErrorMessage name="techStack" component="div" className="text-red-500 text-xs mt-1" />
                      </div>

                      <div className="md:col-span-2">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                          Project Description *
                        </label>
                        <Field
                          as="textarea"
                          id="description"
                          name="description"
                          rows={4}
                          placeholder="Describe the purpose, features, and achievements of your project..."
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <ErrorMessage name="description" component="div" className="text-red-500 text-xs mt-1" />
                      </div>

                      <div>
                        <label htmlFor="projectUrl" className="block text-sm font-medium text-gray-700">
                          Project URL
                        </label>
                        <Field
                          id="projectUrl"
                          name="projectUrl"
                          type="text"
                          placeholder="https://myproject.com"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <ErrorMessage name="projectUrl" component="div" className="text-red-500 text-xs mt-1" />
                      </div>

                      <div>
                        <label htmlFor="repoUrl" className="block text-sm font-medium text-gray-700">
                          Repository URL
                        </label>
                        <Field
                          id="repoUrl"
                          name="repoUrl"
                          type="text"
                          placeholder="https://github.com/username/repository"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <ErrorMessage name="repoUrl" component="div" className="text-red-500 text-xs mt-1" />
                      </div>

                      <div>
                        <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                          Start Date
                        </label>
                        <Field
                          id="startDate"
                          name="startDate"
                          type="date"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <ErrorMessage name="startDate" component="div" className="text-red-500 text-xs mt-1" />
                      </div>

                      <div className="flex flex-col">
                        <div className="flex items-center mb-2">
                          <Field
                            id="isOngoing"
                            name="isOngoing"
                            type="checkbox"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                              setFieldValue('isOngoing', e.target.checked);
                              if (e.target.checked) {
                                setFieldValue('endDate', '');
                              }
                            }}
                          />
                          <label htmlFor="isOngoing" className="ml-2 block text-sm text-gray-700">
                            This is an ongoing project
                          </label>
                        </div>

                        {!values.isOngoing && (
                          <>
                            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                              End Date
                            </label>
                            <Field
                              id="endDate"
                              name="endDate"
                              type="date"
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </>
                        )}
                        <ErrorMessage name="endDate" component="div" className="text-red-500 text-xs mt-1" />
                      </div>

                      <div className="md:col-span-2">
                        <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                          Project Image URL
                        </label>
                        <Field
                          id="image"
                          name="image"
                          type="text"
                          placeholder="https://example.com/project-image.jpg"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <p className="mt-1 text-sm text-gray-500">
                          URL to an image showcasing your project
                        </p>
                        <ErrorMessage name="image" component="div" className="text-red-500 text-xs mt-1" />
                      </div>
                    </div>

                    <div className="flex justify-end mt-6 space-x-3">
                      <button
                        type="button"
                        onClick={handleAddNew}
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
                          formMode === 'add' ? 'Add Project' : 'Update Project'
                        )}
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProjectsPage;