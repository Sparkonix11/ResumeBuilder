import { useState, useEffect } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import Layout from '../components/Layout';
import FormField from '../components/FormField';
import FormSection from '../components/FormSection';
import Button from '../components/Button';
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
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Education</h1>
            <p className="text-gray-600 mt-2">
              Add your educational background to your resume
            </p>
          </div>
          <Button
            onClick={handleAddNew}
            variant="primary"
            size="md"
            className="flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add Education
          </Button>
        </div>

        {submitStatus?.success && (
          <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded-md shadow-sm transition-all animate-fadeIn" role="alert">
            <div className="flex">
              <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <p>{submitStatus.success}</p>
            </div>
          </div>
        )}

        {submitStatus?.error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md shadow-sm" role="alert">
            <div className="flex">
              <svg className="h-5 w-5 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              <p>{submitStatus.error}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Education List */}
          <div className="lg:col-span-1">
            <FormSection title="Your Education" className="h-full">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : educationList.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <p>No education entries yet.</p>
                  <p>Click "Add Education" to get started.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {educationList.map((education) => (
                    <div 
                      key={education.id} 
                      className="border border-gray-100 rounded-lg p-4 hover:bg-blue-50 transition-colors duration-150 group relative shadow-sm hover:shadow"
                    >
                      <h3 className="font-semibold text-gray-800">{education.degree}</h3>
                      <p className="text-sm text-gray-600">{education.institution}</p>
                      {education.fieldOfStudy && (
                        <p className="text-xs text-gray-500">{education.fieldOfStudy}</p>
                      )}
                      <p className="text-xs text-gray-500">
                        {formatDate(education.startDate)} - {education.isCurrentlyStudying ? 'Present' : formatDate(education.endDate!)}
                      </p>
                      <div className="mt-3 flex justify-end space-x-2">
                        <Button
                          onClick={() => handleEdit(education.id!)}
                          variant="outline" 
                          size="xs"
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleDelete(education.id!)}
                          variant="danger"
                          size="xs"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </FormSection>
          </div>

          {/* Education Form */}
          <div className="lg:col-span-2">
            <FormSection 
              title={formMode === 'add' ? 'Add New Education' : 'Edit Education'} 
              description={formMode === 'add' ? 'Add details about your education' : 'Update your education information'}
            >
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
                        <FormField
                          name="institution"
                          label="Institution / University"
                          placeholder="e.g. Stanford University"
                          required
                        />
                      </div>

                      <FormField
                        name="degree"
                        label="Degree / Certificate"
                        placeholder="e.g. Bachelor of Science"
                        required
                      />

                      <FormField
                        name="fieldOfStudy"
                        label="Field of Study"
                        placeholder="e.g. Computer Science"
                      />

                      <FormField
                        name="location"
                        label="Location"
                        placeholder="e.g. San Francisco, CA"
                      />

                      <FormField
                        name="gpa"
                        label="GPA"
                        placeholder="e.g. 3.8/4.0"
                      />

                      <div className="flex flex-col justify-center">
                        <div className="flex items-center mb-2">
                          <input
                            id="isCurrentlyStudying"
                            name="isCurrentlyStudying"
                            type="checkbox"
                            checked={values.isCurrentlyStudying}
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

                      <FormField
                        name="startDate"
                        label="Start Date"
                        type="date"
                        required
                      />

                      {!values.isCurrentlyStudying && (
                        <FormField
                          name="endDate"
                          label="End Date"
                          type="date"
                          required
                        />
                      )}

                      <div className="md:col-span-2">
                        <FormField
                          as="textarea"
                          name="description"
                          label="Description"
                          placeholder="Additional information about your education, courses, achievements, etc."
                          rows={3}
                        />
                      </div>
                    </div>

                    <div className="flex justify-end mt-6 space-x-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleAddNew}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        variant="primary"
                        disabled={isSubmitting}
                        isLoading={isSubmitting}
                      >
                        {formMode === 'add' ? 'Add Education' : 'Update Education'}
                      </Button>
                    </div>
                  </Form>
                )}
              </Formik>
            </FormSection>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EducationPage;