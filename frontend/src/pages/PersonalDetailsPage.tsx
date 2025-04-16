import { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Layout from '../components/Layout';
import { getPersonalDetails, updatePersonalDetails, PersonalDetail } from '../services/personalDetails';

// Validation schema for personal details
const PersonalDetailsSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  phone: Yup.string(),
  address: Yup.string(),
  city: Yup.string(),
  state: Yup.string(),
  zipCode: Yup.string(),
  linkedIn: Yup.string().url('Must be a valid URL'),
  github: Yup.string().url('Must be a valid URL'),
  portfolio: Yup.string().url('Must be a valid URL'),
  professionalSummary: Yup.string(),
  skills: Yup.string(),
});

const PersonalDetailsPage = () => {
  const [personalDetails, setPersonalDetails] = useState<PersonalDetail | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [submitStatus, setSubmitStatus] = useState<{ success?: string; error?: string } | null>(null);

  useEffect(() => {
    const fetchPersonalDetails = async () => {
      try {
        setIsLoading(true);
        const data = await getPersonalDetails();
        setPersonalDetails(data);
      } catch (error) {
        console.error('Error fetching personal details:', error);
        // If no personal details exist yet, initialize with empty values
        setPersonalDetails({});
      } finally {
        setIsLoading(false);
      }
    };

    fetchPersonalDetails();
  }, []);

  const handleSubmit = async (values: PersonalDetail) => {
    try {
      setSubmitStatus(null);
      
      // Convert skills from string to array if provided
      if (values.skills && typeof values.skills === 'string') {
        values.skills = values.skills
          .split(',')
          .map(skill => skill.trim())
          .filter(skill => skill !== '');
      }

      const updatedDetails = await updatePersonalDetails(values);
      setPersonalDetails(updatedDetails);
      setSubmitStatus({ success: 'Personal details updated successfully!' });
      
      // Clear success message after 3 seconds
      setTimeout(() => setSubmitStatus(null), 3000);
    } catch (error) {
      console.error('Error updating personal details:', error);
      setSubmitStatus({ error: 'Failed to update personal details. Please try again.' });
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </Layout>
    );
  }

  // Convert skills array to string for form display if needed
  const initialValues = {
    ...personalDetails,
    skills: Array.isArray(personalDetails?.skills) 
      ? personalDetails.skills.join(', ') 
      : personalDetails?.skills || '',
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Personal Details</h1>
          <p className="text-gray-600 mt-2">
            Add your personal information to help employers contact you
          </p>
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

        <Formik
          initialValues={initialValues}
          validationSchema={PersonalDetailsSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="bg-white shadow rounded-lg p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Basic Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Full Name *
                    </label>
                    <Field
                      id="name"
                      name="name"
                      type="text"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <ErrorMessage name="name" component="div" className="text-red-500 text-xs mt-1" />
                  </div>

                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                      Professional Title
                    </label>
                    <Field
                      id="title"
                      name="title"
                      type="text"
                      placeholder="e.g. Software Engineer"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email Address *
                    </label>
                    <Field
                      id="email"
                      name="email"
                      type="email"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <ErrorMessage name="email" component="div" className="text-red-500 text-xs mt-1" />
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      Phone Number
                    </label>
                    <Field
                      id="phone"
                      name="phone"
                      type="text"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <ErrorMessage name="phone" component="div" className="text-red-500 text-xs mt-1" />
                  </div>
                </div>
              </div>

              <div className="bg-white shadow rounded-lg p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Address Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                      Street Address
                    </label>
                    <Field
                      id="address"
                      name="address"
                      type="text"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <ErrorMessage name="address" component="div" className="text-red-500 text-xs mt-1" />
                  </div>
                  
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                      City
                    </label>
                    <Field
                      id="city"
                      name="city"
                      type="text"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <ErrorMessage name="city" component="div" className="text-red-500 text-xs mt-1" />
                  </div>
                  
                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                      State
                    </label>
                    <Field
                      id="state"
                      name="state"
                      type="text"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <ErrorMessage name="state" component="div" className="text-red-500 text-xs mt-1" />
                  </div>
                  
                  <div>
                    <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
                      ZIP Code
                    </label>
                    <Field
                      id="zipCode"
                      name="zipCode"
                      type="text"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <ErrorMessage name="zipCode" component="div" className="text-red-500 text-xs mt-1" />
                  </div>
                </div>
              </div>

              <div className="bg-white shadow rounded-lg p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Online Presence</h2>
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label htmlFor="linkedIn" className="block text-sm font-medium text-gray-700">
                      LinkedIn URL
                    </label>
                    <Field
                      id="linkedIn"
                      name="linkedIn"
                      type="text"
                      placeholder="https://linkedin.com/in/your-profile"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <ErrorMessage name="linkedIn" component="div" className="text-red-500 text-xs mt-1" />
                  </div>
                  
                  <div>
                    <label htmlFor="github" className="block text-sm font-medium text-gray-700">
                      GitHub URL
                    </label>
                    <Field
                      id="github"
                      name="github"
                      type="text"
                      placeholder="https://github.com/your-username"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <ErrorMessage name="github" component="div" className="text-red-500 text-xs mt-1" />
                  </div>
                  
                  <div>
                    <label htmlFor="portfolio" className="block text-sm font-medium text-gray-700">
                      Portfolio URL
                    </label>
                    <Field
                      id="portfolio"
                      name="portfolio"
                      type="text"
                      placeholder="https://your-portfolio.com"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <ErrorMessage name="portfolio" component="div" className="text-red-500 text-xs mt-1" />
                  </div>
                </div>
              </div>

              <div className="bg-white shadow rounded-lg p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Professional Information</h2>
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label htmlFor="professionalSummary" className="block text-sm font-medium text-gray-700">
                      Professional Summary
                    </label>
                    <Field
                      as="textarea"
                      id="professionalSummary"
                      name="professionalSummary"
                      rows={4}
                      placeholder="Write a short summary about your professional background, skills, and career goals..."
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <ErrorMessage name="professionalSummary" component="div" className="text-red-500 text-xs mt-1" />
                  </div>
                  
                  <div>
                    <label htmlFor="skills" className="block text-sm font-medium text-gray-700">
                      Skills (comma separated)
                    </label>
                    <Field
                      as="textarea"
                      id="skills"
                      name="skills"
                      rows={2}
                      placeholder="JavaScript, React, Node.js, CSS, HTML..."
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <ErrorMessage name="skills" component="div" className="text-red-500 text-xs mt-1" />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
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
                    'Save Details'
                  )}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </Layout>
  );
};

export default PersonalDetailsPage;