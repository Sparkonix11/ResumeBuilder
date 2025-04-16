import { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Layout from '../components/Layout';
import { getAllWorkExperiences, getWorkExperienceById, createWorkExperience, updateWorkExperience, deleteWorkExperience, WorkExperience } from '../services/workExperience';

const workExperienceSchema = Yup.object().shape({
  company: Yup.string().required('Company name is required'),
  position: Yup.string().required('Position is required'),
  startDate: Yup.date().required('Start date is required'),
  endDate: Yup.date().nullable().when('isCurrentJob', {
    is: false,
    then: Yup.date().required('End date is required'),
  }),
  isCurrentJob: Yup.boolean(),
  location: Yup.string(),
  description: Yup.string(),
  responsibilities: Yup.string()
});

const initialValues = {
  company: '',
  position: '',
  startDate: '',
  endDate: '',
  isCurrentJob: false,
  location: '',
  description: '',
  responsibilities: ''
};

const WorkExperiencePage = () => {
  const [experiences, setExperiences] = useState<WorkExperience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentExperience, setCurrentExperience] = useState<WorkExperience | null>(null);

  useEffect(() => {
    fetchWorkExperiences();
  }, []);

  const fetchWorkExperiences = async () => {
    try {
      setLoading(true);
      const data = await getAllWorkExperiences();
      setExperiences(data);
    } catch (err) {
      console.error('Error fetching work experiences:', err);
      setError('Failed to load work experiences. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: any, { resetForm }: { resetForm: () => void }) => {
    try {
      if (isEditing && currentExperience?.id) {
        await updateWorkExperience(currentExperience.id, values);
        setSuccess('Work experience updated successfully!');
      } else {
        await createWorkExperience(values);
        setSuccess('Work experience added successfully!');
      }
      
      // Refresh the list
      await fetchWorkExperiences();
      
      // Reset form and editing state
      resetForm();
      setIsEditing(false);
      setCurrentExperience(null);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (err) {
      console.error('Error saving work experience:', err);
      setError('Failed to save work experience. Please try again.');
    }
  };

  const handleEdit = (experience: WorkExperience) => {
    setCurrentExperience(experience);
    setIsEditing(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this work experience?')) {
      try {
        await deleteWorkExperience(id);
        setSuccess('Work experience deleted successfully!');
        await fetchWorkExperiences();
        
        // Hide success message after 3 seconds
        setTimeout(() => {
          setSuccess('');
        }, 3000);
      } catch (err) {
        console.error('Error deleting work experience:', err);
        setError('Failed to delete work experience. Please try again.');
      }
    }
  };

  const handleCancel = (resetForm: () => void) => {
    resetForm();
    setIsEditing(false);
    setCurrentExperience(null);
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
          <h1 className="text-2xl font-bold">Work Experience</h1>
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

        {/* Work Experience Form */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">
            {isEditing ? 'Edit Work Experience' : 'Add Work Experience'}
          </h2>
          <Formik
            initialValues={
              currentExperience
                ? {
                    ...currentExperience,
                    startDate: formatDate(currentExperience.startDate),
                    endDate: formatDate(currentExperience.endDate),
                  }
                : initialValues
            }
            enableReinitialize={true}
            validationSchema={workExperienceSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, resetForm, values }) => (
              <Form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                      Company
                    </label>
                    <Field
                      type="text"
                      name="company"
                      id="company"
                      placeholder="Company Name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                    <ErrorMessage name="company" component="p" className="text-red-500 text-xs mt-1" />
                  </div>

                  <div>
                    <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">
                      Position
                    </label>
                    <Field
                      type="text"
                      name="position"
                      id="position"
                      placeholder="Job Title"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                    <ErrorMessage name="position" component="p" className="text-red-500 text-xs mt-1" />
                  </div>

                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <Field
                      type="text"
                      name="location"
                      id="location"
                      placeholder="City, Country"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                    <ErrorMessage name="location" component="p" className="text-red-500 text-xs mt-1" />
                  </div>

                  <div className="flex items-center mt-6">
                    <Field
                      type="checkbox"
                      name="isCurrentJob"
                      id="isCurrentJob"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isCurrentJob" className="ml-2 block text-sm text-gray-700">
                      I currently work here
                    </label>
                  </div>

                  <div>
                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date
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
                      End Date
                    </label>
                    <Field
                      type="date"
                      name="endDate"
                      id="endDate"
                      disabled={values.isCurrentJob}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                    />
                    <ErrorMessage name="endDate" component="p" className="text-red-500 text-xs mt-1" />
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <Field
                      as="textarea"
                      name="description"
                      id="description"
                      rows={3}
                      placeholder="Brief description of the company and your role"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                    <ErrorMessage name="description" component="p" className="text-red-500 text-xs mt-1" />
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="responsibilities" className="block text-sm font-medium text-gray-700 mb-1">
                      Responsibilities
                    </label>
                    <Field
                      as="textarea"
                      name="responsibilities"
                      id="responsibilities"
                      rows={4}
                      placeholder="List your key responsibilities and achievements"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                    <p className="text-gray-500 text-xs mt-1">Tip: Use bullet points (• ) for each responsibility</p>
                    <ErrorMessage name="responsibilities" component="p" className="text-red-500 text-xs mt-1" />
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
                    {isSubmitting ? 'Saving...' : isEditing ? 'Update' : 'Add Experience'}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>

        {/* Work Experience List */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Work History</h2>
          
          {loading && <p>Loading work history...</p>}
          
          {!loading && experiences.length === 0 && (
            <p className="text-gray-500">No work experience added yet.</p>
          )}
          
          {!loading && experiences.length > 0 && (
            <div className="space-y-6">
              {experiences.map((experience) => (
                <div key={experience.id} className="border-b pb-4 last:border-b-0 last:pb-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex flex-col md:flex-row md:items-center md:gap-2">
                        <h3 className="text-lg font-medium">{experience.position}</h3>
                        <span className="hidden md:inline text-gray-500">•</span>
                        <span className="text-gray-700">{experience.company}</span>
                        {experience.location && (
                          <>
                            <span className="hidden md:inline text-gray-500">•</span>
                            <span className="text-gray-500">{experience.location}</span>
                          </>
                        )}
                      </div>
                      <p className="text-gray-500 text-sm">
                        {new Date(experience.startDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })} - 
                        {experience.isCurrentJob 
                          ? ' Present' 
                          : experience.endDate 
                            ? ` ${new Date(experience.endDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })}` 
                            : ' N/A'}
                      </p>
                      {experience.description && <p className="text-gray-600 mt-2">{experience.description}</p>}
                      {experience.responsibilities && (
                        <div className="mt-2">
                          <p className="font-medium text-gray-700">Responsibilities:</p>
                          <div className="text-gray-600 whitespace-pre-line pl-4">
                            {experience.responsibilities}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(experience)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => experience.id && handleDelete(experience.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
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

export default WorkExperiencePage;