import { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Layout from '../components/Layout';
import { getAllEducation, createEducation, updateEducation, deleteEducation, Education } from '../services/education';

const educationSchema = Yup.object().shape({
  institution: Yup.string().required('Institution name is required'),
  degree: Yup.string().required('Degree is required'),
  fieldOfStudy: Yup.string(),
  startDate: Yup.date().required('Start date is required'),
  endDate: Yup.date().nullable().when('isCurrentlyStudying', {
    is: false,
    then: Yup.date().required('End date is required'),
  }),
  isCurrentlyStudying: Yup.boolean(),
  description: Yup.string(),
});

const initialValues = {
  institution: '',
  degree: '',
  fieldOfStudy: '',
  startDate: '',
  endDate: '',
  isCurrentlyStudying: false,
  description: '',
};

const EducationPage = () => {
  const [educationList, setEducationList] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentEducation, setCurrentEducation] = useState<Education | null>(null);

  useEffect(() => {
    fetchEducation();
  }, []);

  const fetchEducation = async () => {
    try {
      setLoading(true);
      const data = await getAllEducation();
      setEducationList(data);
    } catch (err) {
      console.error('Error fetching education:', err);
      setError('Failed to load education history. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: any, { resetForm }: { resetForm: () => void }) => {
    try {
      if (isEditing && currentEducation?.id) {
        await updateEducation(currentEducation.id, values);
        setSuccess('Education updated successfully!');
      } else {
        await createEducation(values);
        setSuccess('Education added successfully!');
      }
      
      // Refresh the list
      await fetchEducation();
      
      // Reset form and editing state
      resetForm();
      setIsEditing(false);
      setCurrentEducation(null);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (err) {
      console.error('Error saving education:', err);
      setError('Failed to save education. Please try again.');
    }
  };

  const handleEdit = (education: Education) => {
    setCurrentEducation(education);
    setIsEditing(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this education entry?')) {
      try {
        await deleteEducation(id);
        setSuccess('Education deleted successfully!');
        await fetchEducation();
        
        // Hide success message after 3 seconds
        setTimeout(() => {
          setSuccess('');
        }, 3000);
      } catch (err) {
        console.error('Error deleting education:', err);
        setError('Failed to delete education. Please try again.');
      }
    }
  };

  const handleCancel = (resetForm: () => void) => {
    resetForm();
    setIsEditing(false);
    setCurrentEducation(null);
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
          <h1 className="text-2xl font-bold">Education</h1>
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

        {/* Education Form */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">
            {isEditing ? 'Edit Education' : 'Add Education'}
          </h2>
          <Formik
            initialValues={
              currentEducation
                ? {
                    ...currentEducation,
                    startDate: formatDate(currentEducation.startDate),
                    endDate: formatDate(currentEducation.endDate),
                  }
                : initialValues
            }
            enableReinitialize={true}
            validationSchema={educationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, resetForm, values, setFieldValue }) => (
              <Form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="institution" className="block text-sm font-medium text-gray-700 mb-1">
                      Institution
                    </label>
                    <Field
                      type="text"
                      name="institution"
                      id="institution"
                      placeholder="University or School Name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                    <ErrorMessage name="institution" component="p" className="text-red-500 text-xs mt-1" />
                  </div>

                  <div>
                    <label htmlFor="degree" className="block text-sm font-medium text-gray-700 mb-1">
                      Degree
                    </label>
                    <Field
                      type="text"
                      name="degree"
                      id="degree"
                      placeholder="e.g. Bachelor's, Master's, PhD"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                    <ErrorMessage name="degree" component="p" className="text-red-500 text-xs mt-1" />
                  </div>

                  <div>
                    <label htmlFor="fieldOfStudy" className="block text-sm font-medium text-gray-700 mb-1">
                      Field of Study
                    </label>
                    <Field
                      type="text"
                      name="fieldOfStudy"
                      id="fieldOfStudy"
                      placeholder="e.g. Computer Science"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                    <ErrorMessage name="fieldOfStudy" component="p" className="text-red-500 text-xs mt-1" />
                  </div>

                  <div className="flex items-center mt-6">
                    <Field
                      type="checkbox"
                      name="isCurrentlyStudying"
                      id="isCurrentlyStudying"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isCurrentlyStudying" className="ml-2 block text-sm text-gray-700">
                      I am currently studying here
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
                      End Date {values.isCurrentlyStudying && '(or Expected)'}
                    </label>
                    <Field
                      type="date"
                      name="endDate"
                      id="endDate"
                      disabled={values.isCurrentlyStudying}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                    />
                    <ErrorMessage name="endDate" component="p" className="text-red-500 text-xs mt-1" />
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                      Description (Optional)
                    </label>
                    <Field
                      as="textarea"
                      name="description"
                      id="description"
                      rows={4}
                      placeholder="Additional information about your studies, achievements, etc."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                    <ErrorMessage name="description" component="p" className="text-red-500 text-xs mt-1" />
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
                    {isSubmitting ? 'Saving...' : isEditing ? 'Update' : 'Add Education'}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>

        {/* Education List */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Education History</h2>
          
          {loading && <p>Loading education history...</p>}
          
          {!loading && educationList.length === 0 && (
            <p className="text-gray-500">No education history added yet.</p>
          )}
          
          {!loading && educationList.length > 0 && (
            <div className="space-y-6">
              {educationList.map((education) => (
                <div key={education.id} className="border-b pb-4 last:border-b-0 last:pb-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium">{education.institution}</h3>
                      <p className="text-gray-700">
                        {education.degree}{education.fieldOfStudy ? `, ${education.fieldOfStudy}` : ''}
                      </p>
                      <p className="text-gray-500 text-sm">
                        {new Date(education.startDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })} - 
                        {education.isCurrentlyStudying 
                          ? ' Present' 
                          : education.endDate 
                            ? ` ${new Date(education.endDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })}` 
                            : ' N/A'}
                      </p>
                      {education.description && <p className="text-gray-600 mt-2">{education.description}</p>}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(education)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => education.id && handleDelete(education.id)}
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

export default EducationPage;