import { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Layout from '../components/Layout';
import { 
  getAllEducation, 
  getEducationById, 
  createEducation, 
  updateEducation, 
  deleteEducation,
  Education 
} from '../services/education';

// Validation schema for education form
const EducationSchema = Yup.object().shape({
  institution: Yup.string().required('Institution name is required'),
  degree: Yup.string().required('Degree is required'),
  fieldOfStudy: Yup.string(),
  startDate: Yup.date().required('Start date is required'),
  endDate: Yup.date().when('isCurrentlyStudying', {
    is: false,
    then: Yup.date().required('End date is required when not currently studying'),
  }),
  isCurrentlyStudying: Yup.boolean(),
  location: Yup.string(),
  gpa: Yup.string(),
  description: Yup.string(),
});

const EducationPage = () => {
  const [educationList, setEducationList] = useState<Education[]>([]);
  const [currentEducation, setCurrentEducation] = useState<Education | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  const [submitStatus, setSubmitStatus] = useState<{ success?: string; error?: string } | null>(null);

  useEffect(() => {
    fetchEducationList();
  }, []);

  const fetchEducationList = async () => {
    try {
      setIsLoading(true);
      const data = await getAllEducation();
      setEducationList(data);
    } catch (error) {
      console.error('Error fetching education list:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNew = () => {
    setCurrentEducation(null);
    setFormMode('add');
  };

  const handleEdit = async (id: number) => {
    try {
      setIsLoading(true);
      const education = await getEducationById(id);
      setCurrentEducation(education);
      setFormMode('edit');
    } catch (error) {
      console.error(`Error fetching education with id ${id}:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this education entry?')) {
      try {
        await deleteEducation(id);
        setSubmitStatus({ success: 'Education entry deleted successfully!' });
        fetchEducationList();
      } catch (error) {
        console.error(`Error deleting education with id ${id}:`, error);
        setSubmitStatus({ error: 'Failed to delete education entry. Please try again.' });
      }
      
      // Clear success message after 3 seconds
      setTimeout(() => setSubmitStatus(null), 3000);
    }
  };

  const handleSubmit = async (values: Education) => {
    try {
      setSubmitStatus(null);
      
      if (formMode === 'add') {
        await createEducation(values);
        setSubmitStatus({ success: 'Education added successfully!' });
      } else {
        await updateEducation(currentEducation!.id!, values);
        setSubmitStatus({ success: 'Education updated successfully!' });
      }
      
      fetchEducationList();
      handleAddNew(); // Reset form after submission
      
      // Clear success message after 3 seconds
      setTimeout(() => setSubmitStatus(null), 3000);
    } catch (error) {
      console.error('Error submitting education form:', error);
      setSubmitStatus({ error: 'Failed to save education. Please try again.' });
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  // Initial values for the form
  const initialValues: Education = currentEducation || {
    institution: '',
    degree: '',
    fieldOfStudy: '',
    startDate: '',
    endDate: '',
    isCurrentlyStudying: false,
    location: '',
    gpa: '',
    description: '',
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Education</h1>
            <p className="text-gray-600 mt-2">
              Add your educational background to your resume
            </p>
          </div>
          <button
            onClick={handleAddNew}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add Education
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
          {/* Education List */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Your Education</h2>
              
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : educationList.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No education entries yet.</p>
                  <p>Click "Add Education" to get started.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {educationList.map((education) => (
                    <div key={education.id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <h3 className="font-semibold text-gray-800">{education.degree}</h3>
                      <p className="text-sm text-gray-600">{education.institution}</p>
                      {education.fieldOfStudy && (
                        <p className="text-xs text-gray-500">{education.fieldOfStudy}</p>
                      )}
                      <p className="text-xs text-gray-500">
                        {formatDate(education.startDate)} - {education.isCurrentlyStudying ? 'Present' : formatDate(education.endDate!)}
                      </p>
                      <div className="mt-3 flex justify-end space-x-2">
                        <button 
                          onClick={() => handleEdit(education.id!)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(education.id!)}
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

          {/* Education Form */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                {formMode === 'add' ? 'Add New Education' : 'Edit Education'}
              </h2>

              <Formik
                initialValues={initialValues}
                validationSchema={EducationSchema}
                onSubmit={handleSubmit}
                enableReinitialize
              >
                {({ isSubmitting, values, setFieldValue }) => (
                  <Form>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label htmlFor="institution" className="block text-sm font-medium text-gray-700">
                          Institution / University *
                        </label>
                        <Field
                          id="institution"
                          name="institution"
                          type="text"
                          placeholder="e.g. Stanford University"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <ErrorMessage name="institution" component="div" className="text-red-500 text-xs mt-1" />
                      </div>

                      <div>
                        <label htmlFor="degree" className="block text-sm font-medium text-gray-700">
                          Degree / Certificate *
                        </label>
                        <Field
                          id="degree"
                          name="degree"
                          type="text"
                          placeholder="e.g. Bachelor of Science"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <ErrorMessage name="degree" component="div" className="text-red-500 text-xs mt-1" />
                      </div>

                      <div>
                        <label htmlFor="fieldOfStudy" className="block text-sm font-medium text-gray-700">
                          Field of Study
                        </label>
                        <Field
                          id="fieldOfStudy"
                          name="fieldOfStudy"
                          type="text"
                          placeholder="e.g. Computer Science"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <ErrorMessage name="fieldOfStudy" component="div" className="text-red-500 text-xs mt-1" />
                      </div>

                      <div>
                        <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                          Location
                        </label>
                        <Field
                          id="location"
                          name="location"
                          type="text"
                          placeholder="e.g. San Francisco, CA"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <ErrorMessage name="location" component="div" className="text-red-500 text-xs mt-1" />
                      </div>

                      <div>
                        <label htmlFor="gpa" className="block text-sm font-medium text-gray-700">
                          GPA
                        </label>
                        <Field
                          id="gpa"
                          name="gpa"
                          type="text"
                          placeholder="e.g. 3.8/4.0"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <ErrorMessage name="gpa" component="div" className="text-red-500 text-xs mt-1" />
                      </div>

                      <div className="flex flex-col">
                        <div className="flex items-center mb-2">
                          <Field
                            id="isCurrentlyStudying"
                            name="isCurrentlyStudying"
                            type="checkbox"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                              setFieldValue('isCurrentlyStudying', e.target.checked);
                              if (e.target.checked) {
                                setFieldValue('endDate', '');
                              }
                            }}
                          />
                          <label htmlFor="isCurrentlyStudying" className="ml-2 block text-sm text-gray-700">
                            I am currently studying here
                          </label>
                        </div>
                      </div>

                      <div>
                        <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                          Start Date *
                        </label>
                        <Field
                          id="startDate"
                          name="startDate"
                          type="date"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <ErrorMessage name="startDate" component="div" className="text-red-500 text-xs mt-1" />
                      </div>

                      <div>
                        {!values.isCurrentlyStudying && (
                          <>
                            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                              End Date *
                            </label>
                            <Field
                              id="endDate"
                              name="endDate"
                              type="date"
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <ErrorMessage name="endDate" component="div" className="text-red-500 text-xs mt-1" />
                          </>
                        )}
                      </div>

                      <div className="md:col-span-2">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                          Description
                        </label>
                        <Field
                          as="textarea"
                          id="description"
                          name="description"
                          rows={3}
                          placeholder="Additional information about your education, courses, achievements, etc."
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <ErrorMessage name="description" component="div" className="text-red-500 text-xs mt-1" />
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
                          formMode === 'add' ? 'Add Education' : 'Update Education'
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

export default EducationPage;