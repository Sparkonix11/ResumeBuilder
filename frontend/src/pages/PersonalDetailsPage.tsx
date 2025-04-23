import { useState, useEffect } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import Layout from '../components/Layout';
import FormField from '../components/FormField';
import FormSection from '../components/FormSection';
import Button from '../components/Button';
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
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Personal Details</h1>
          <p className="text-gray-600 mt-2">
            Add your personal information to help employers contact you
          </p>
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

        <Formik
          initialValues={initialValues}
          validationSchema={PersonalDetailsSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ isSubmitting }) => (
            <Form>
              <FormSection 
                title="Basic Information" 
                description="Enter your core contact details"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField 
                    name="name" 
                    label="Full Name" 
                    required 
                    placeholder="John Doe" 
                  />
                  <FormField 
                    name="title" 
                    label="Professional Title" 
                    placeholder="e.g. Software Engineer" 
                  />
                  <FormField 
                    name="email" 
                    label="Email Address" 
                    type="email" 
                    required 
                    placeholder="johndoe@example.com" 
                  />
                  <FormField 
                    name="phone" 
                    label="Phone Number" 
                    placeholder="+1 (555) 123-4567" 
                  />
                </div>
              </FormSection>

              <FormSection 
                title="Address Information"
                description="Where potential employers can reach you"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <FormField 
                      name="address" 
                      label="Street Address" 
                      placeholder="123 Main Street" 
                    />
                  </div>
                  
                  <FormField 
                    name="city" 
                    label="City" 
                    placeholder="New York" 
                  />
                  
                  <FormField 
                    name="state" 
                    label="State" 
                    placeholder="NY" 
                  />
                  
                  <FormField 
                    name="zipCode" 
                    label="ZIP Code" 
                    placeholder="10001" 
                  />
                </div>
              </FormSection>

              <FormSection 
                title="Online Presence"
                description="Share your professional online profiles"
              >
                <div className="grid grid-cols-1 gap-6">
                  <FormField 
                    name="linkedIn" 
                    label="LinkedIn URL" 
                    placeholder="https://linkedin.com/in/your-profile" 
                  />
                  
                  <FormField 
                    name="github" 
                    label="GitHub URL" 
                    placeholder="https://github.com/your-username" 
                  />
                  
                  <FormField 
                    name="portfolio" 
                    label="Portfolio URL" 
                    placeholder="https://your-portfolio.com" 
                  />
                </div>
              </FormSection>

              <FormSection 
                title="Professional Information"
                description="Highlight your expertise and skills"
              >
                <div className="grid grid-cols-1 gap-6">
                  <FormField 
                    name="professionalSummary" 
                    label="Professional Summary" 
                    as="textarea" 
                    rows={4}
                    placeholder="Write a short summary about your professional background, skills, and career goals..." 
                  />
                  
                  <FormField 
                    name="skills" 
                    label="Skills (comma separated)" 
                    as="textarea" 
                    rows={2}
                    placeholder="JavaScript, React, Node.js, CSS, HTML..." 
                  />
                </div>
              </FormSection>

              <div className="flex justify-end mt-6">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  isLoading={isSubmitting}
                  disabled={isSubmitting}
                >
                  Save Details
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </Layout>
  );
};

export default PersonalDetailsPage;