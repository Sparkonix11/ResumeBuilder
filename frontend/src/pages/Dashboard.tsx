import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { getAllResumes } from '../services/resumes';
import { getAllTemplates } from '../services/resumeTemplates';
import { getPersonalDetails } from '../services/personalDetails';
import { getAllEducation } from '../services/education';
import { getAllWorkExperiences } from '../services/workExperience';
import { getAllProjects } from '../services/projects';

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [stats, setStats] = useState({
    resumeCount: 0,
    educationCount: 0,
    workExperienceCount: 0,
    projectCount: 0,
    templateCount: 0,
    hasPersonalDetails: false,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const [resumes, templates, personalDetails, education, workExperiences, projects] = await Promise.all([
          getAllResumes(),
          getAllTemplates(),
          getPersonalDetails().catch(() => null),
          getAllEducation().catch(() => []),
          getAllWorkExperiences().catch(() => []),
          getAllProjects().catch(() => []),
        ]);

        setStats({
          resumeCount: resumes.length,
          educationCount: education.length,
          workExperienceCount: workExperiences.length,
          projectCount: projects.length,
          templateCount: templates.length,
          hasPersonalDetails: !!personalDetails,
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const QuickActionCard = ({ title, description, link, color }: { title: string; description: string; link: string; color: string }) => (
    <Link to={link} className={`block p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow ${color}`}>
      <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
      <p className="text-white opacity-90">{description}</p>
      <div className="mt-4 text-right">
        <span className="text-white font-medium inline-flex items-center">
          Get Started
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </span>
      </div>
    </Link>
  );

  const StatCard = ({ title, value, icon }: { title: string; value: number; icon: React.ReactNode }) => (
    <div className="bg-white rounded-lg shadow p-5">
      <div className="flex items-center">
        <div className="p-3 rounded-full bg-blue-50 text-blue-600">{icon}</div>
        <div className="ml-4">
          <h3 className="font-medium text-gray-500">{title}</h3>
          <p className="text-2xl font-semibold text-gray-800">{value}</p>
        </div>
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome to your Resume Builder dashboard</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard 
                title="Your Resumes" 
                value={stats.resumeCount}
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                }
              />
              <StatCard 
                title="Work Experiences" 
                value={stats.workExperienceCount}
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                }
              />
              <StatCard 
                title="Education" 
                value={stats.educationCount}
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                  </svg>
                }
              />
              <StatCard 
                title="Projects" 
                value={stats.projectCount}
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                }
              />
            </div>

            {/* Quick Actions */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {!stats.hasPersonalDetails && (
                  <QuickActionCard 
                    title="Complete Your Profile" 
                    description="Add your personal details to get started with resume creation" 
                    link="/personal-details" 
                    color="bg-blue-600"
                  />
                )}
                
                {stats.resumeCount === 0 && stats.hasPersonalDetails && (
                  <QuickActionCard 
                    title="Create Your First Resume" 
                    description="Start building your professional resume" 
                    link="/resume-builder" 
                    color="bg-green-600"
                  />
                )}
                
                {stats.educationCount === 0 && (
                  <QuickActionCard 
                    title="Add Education" 
                    description="Include your academic background and achievements" 
                    link="/education" 
                    color="bg-purple-600"
                  />
                )}
                
                {stats.workExperienceCount === 0 && (
                  <QuickActionCard 
                    title="Add Work Experience" 
                    description="Showcase your professional experience and skills" 
                    link="/work-experience" 
                    color="bg-red-600"
                  />
                )}
                
                {stats.projectCount === 0 && (
                  <QuickActionCard 
                    title="Add Projects" 
                    description="Highlight your key projects and accomplishments" 
                    link="/projects" 
                    color="bg-yellow-600"
                  />
                )}
                
                {stats.resumeCount > 0 && (
                  <QuickActionCard 
                    title="View Your Resumes" 
                    description="Check and edit your existing resumes" 
                    link="/resume-builder" 
                    color="bg-indigo-600"
                  />
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;