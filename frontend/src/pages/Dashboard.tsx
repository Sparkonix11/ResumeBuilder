import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { getAllResumes, Resume } from '../services/resumes';

const Dashboard = () => {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const data = await getAllResumes();
        setResumes(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching resumes:', err);
        setError('Failed to load resumes. Please try again later.');
        setLoading(false);
      }
    };

    fetchResumes();
  }, []);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <Link 
            to="/resume-builder" 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
          >
            Create New Resume
          </Link>
        </div>

        {/* Resume Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Total Resumes</h2>
            <p className="text-3xl font-bold text-blue-600">{resumes.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Resume Templates</h2>
            <p className="text-3xl font-bold text-blue-600">3</p> {/* This could fetch from API */}
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Projects</h2>
            <p className="text-3xl font-bold text-blue-600">5</p> {/* This could fetch from API */}
          </div>
        </div>

        {/* Recent Resumes */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Your Resumes</h2>
          
          {loading && <p>Loading resumes...</p>}
          
          {error && <p className="text-red-500">{error}</p>}
          
          {!loading && !error && resumes.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">You haven't created any resumes yet.</p>
              <Link 
                to="/resume-builder" 
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
              >
                Create Your First Resume
              </Link>
            </div>
          )}
          
          {!loading && !error && resumes.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Template
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {resumes.map((resume) => (
                    <tr key={resume.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {resume.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {resume.createdAt ? new Date(resume.createdAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {resume.templateId || 'Default'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Link 
                            to={`/resume-preview/${resume.id}`} 
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Preview
                          </Link>
                          <Link 
                            to={`/resume-builder/${resume.id}`} 
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Edit
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Link 
            to="/personal-details" 
            className="bg-white p-6 rounded-lg shadow-md hover:bg-gray-50 transition duration-300"
          >
            <h3 className="text-lg font-medium text-blue-600">Personal Details</h3>
            <p className="text-gray-500 mt-2">Update your personal information</p>
          </Link>
          <Link 
            to="/education" 
            className="bg-white p-6 rounded-lg shadow-md hover:bg-gray-50 transition duration-300"
          >
            <h3 className="text-lg font-medium text-blue-600">Education</h3>
            <p className="text-gray-500 mt-2">Manage your education history</p>
          </Link>
          <Link 
            to="/work-experience" 
            className="bg-white p-6 rounded-lg shadow-md hover:bg-gray-50 transition duration-300"
          >
            <h3 className="text-lg font-medium text-blue-600">Work Experience</h3>
            <p className="text-gray-500 mt-2">Update your work history</p>
          </Link>
          <Link 
            to="/projects" 
            className="bg-white p-6 rounded-lg shadow-md hover:bg-gray-50 transition duration-300"
          >
            <h3 className="text-lg font-medium text-blue-600">Projects</h3>
            <p className="text-gray-500 mt-2">Manage your project portfolio</p>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;