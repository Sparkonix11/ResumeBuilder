import { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Layout from '../components/Layout';
import { getPersonalDetails, updatePersonalDetails, PersonalDetails } from '../services/personalDetails';

const personalDetailsSchema = Yup.object().shape({
  phone: Yup.string().nullable(),
  address: Yup.string().nullable(),
  city: Yup.string().nullable(),
  state: Yup.string().nullable(),
  zipCode: Yup.string().nullable(),
  country: Yup.string().nullable(),
  title: Yup.string().nullable(),
  professionalSummary: Yup.string().nullable(),
  linkedIn: Yup.string().nullable(),
  github: Yup.string().nullable(),
  portfolio: Yup.string().nullable(),
});

const PersonalDetailsPage = () => {
  const [details, setDetails] = useState<PersonalDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');

  useEffect(() => {
    const fetchPersonalDetails = async () => {
      try {
        const data = await getPersonalDetails();
        setDetails(data);
        if (data.skills) {
          setSkills(data.skills);
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching personal details:', err);
        setError('Failed to load your personal details. Please try again later.');
        setLoading(false);
      }
    };

    fetchPersonalDetails();
  }, []);

  const handleSubmit = async (values: PersonalDetails) => {
    try {
      const dataToSubmit = {
        ...values,
        skills
      };
      
      await updatePersonalDetails(dataToSubmit);
      setSuccess('Personal details updated successfully!');
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (err) {
      console.error('Error updating personal details:', err);
      setError('Failed to update personal details. Please try again.');
    }
  };

  const addSkill = () => {
    if (skillInput && !skills.includes(skillInput)) {
      setSkills([...skills, skillInput]);
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <p>Loading personal details...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Personal Details</h1>
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
            initialValues={{
              phone: details?.phone || '',
              address: details?.address || '',
              city: details?.city || '',
              state: details?.state || '',
              zipCode: details?.zipCode || '',
              country: details?.country || '',
              title: details?.title || '',
              professionalSummary: details?.professionalSummary || '',
              linkedIn: details?.linkedIn || '',
              github: details?.github || '',
              portfolio: details?.portfolio || '',
            }}
            validationSchema={personalDetailsSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-6">
                {/* Professional Information */}
                <div>
                  <h2 className="text-xl font-semibold mb-4">Professional Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                        Professional Title
                      </label>
                      <Field
                        type="text"
                        name="title"
                        id="title"
                        placeholder="e.g. Full Stack Developer"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                      <ErrorMessage name="title" component="p" className="text-red-500 text-xs mt-1" />
                    </div>

                    <div className="md:col-span-2">
                      <label htmlFor="professionalSummary" className="block text-sm font-medium text-gray-700 mb-1">
                        Professional Summary
                      </label>
                      <Field
                        as="textarea"
                        name="professionalSummary"
                        id="professionalSummary"
                        rows={4}
                        placeholder="Write a short professional summary..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                      <ErrorMessage name="professionalSummary" component="p" className="text-red-500 text-xs mt-1" />
                    </div>
                  </div>
                </div>

                {/* Skills */}
                <div>
                  <h2 className="text-xl font-semibold mb-4">Skills</h2>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {skills.map((skill, index) => (
                      <div key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center">
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
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
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      placeholder="Add a skill..."
                      className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addSkill();
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={addSkill}
                      className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 transition duration-300"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Contact Information */}
                <div>
                  <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <Field
                        type="tel"
                        name="phone"
                        id="phone"
                        placeholder="Your phone number"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                      <ErrorMessage name="phone" component="p" className="text-red-500 text-xs mt-1" />
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div>
                  <h2 className="text-xl font-semibold mb-4">Address</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                        Street Address
                      </label>
                      <Field
                        type="text"
                        name="address"
                        id="address"
                        placeholder="Your street address"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                      <ErrorMessage name="address" component="p" className="text-red-500 text-xs mt-1" />
                    </div>

                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                        City
                      </label>
                      <Field
                        type="text"
                        name="city"
                        id="city"
                        placeholder="Your city"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                      <ErrorMessage name="city" component="p" className="text-red-500 text-xs mt-1" />
                    </div>

                    <div>
                      <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                        State/Province
                      </label>
                      <Field
                        type="text"
                        name="state"
                        id="state"
                        placeholder="Your state"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                      <ErrorMessage name="state" component="p" className="text-red-500 text-xs mt-1" />
                    </div>

                    <div>
                      <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                        ZIP / Postal Code
                      </label>
                      <Field
                        type="text"
                        name="zipCode"
                        id="zipCode"
                        placeholder="Your ZIP code"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                      <ErrorMessage name="zipCode" component="p" className="text-red-500 text-xs mt-1" />
                    </div>

                    <div>
                      <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                        Country
                      </label>
                      <Field
                        type="text"
                        name="country"
                        id="country"
                        placeholder="Your country"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                      <ErrorMessage name="country" component="p" className="text-red-500 text-xs mt-1" />
                    </div>
                  </div>
                </div>

                {/* Online Profiles */}
                <div>
                  <h2 className="text-xl font-semibold mb-4">Online Profiles</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="linkedIn" className="block text-sm font-medium text-gray-700 mb-1">
                        LinkedIn URL
                      </label>
                      <Field
                        type="url"
                        name="linkedIn"
                        id="linkedIn"
                        placeholder="https://linkedin.com/in/yourprofile"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                      <ErrorMessage name="linkedIn" component="p" className="text-red-500 text-xs mt-1" />
                    </div>

                    <div>
                      <label htmlFor="github" className="block text-sm font-medium text-gray-700 mb-1">
                        GitHub URL
                      </label>
                      <Field
                        type="url"
                        name="github"
                        id="github"
                        placeholder="https://github.com/yourusername"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                      <ErrorMessage name="github" component="p" className="text-red-500 text-xs mt-1" />
                    </div>

                    <div>
                      <label htmlFor="portfolio" className="block text-sm font-medium text-gray-700 mb-1">
                        Portfolio Website
                      </label>
                      <Field
                        type="url"
                        name="portfolio"
                        id="portfolio"
                        placeholder="https://yourwebsite.com"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                      <ErrorMessage name="portfolio" component="p" className="text-red-500 text-xs mt-1" />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
                  >
                    {isSubmitting ? 'Saving...' : 'Save Details'}
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

export default PersonalDetailsPage;