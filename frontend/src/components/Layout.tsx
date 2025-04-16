import { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => {
    return location.pathname === path ? 'bg-blue-700' : '';
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation */}
      <nav className="bg-blue-600 text-white shadow-md">
        <div className="container mx-auto px-6 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-2xl font-bold">Resume Builder</Link>
            
            {user && (
              <div className="hidden md:flex space-x-2">
                <Link 
                  to="/" 
                  className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/')}`}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/personal-details" 
                  className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/personal-details')}`}
                >
                  Personal Details
                </Link>
                <Link 
                  to="/education" 
                  className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/education')}`}
                >
                  Education
                </Link>
                <Link 
                  to="/work-experience" 
                  className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/work-experience')}`}
                >
                  Work Experience
                </Link>
                <Link 
                  to="/projects" 
                  className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/projects')}`}
                >
                  Projects
                </Link>
                <Link 
                  to="/resume-builder" 
                  className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/resume-builder')}`}
                >
                  Build Resume
                </Link>
              </div>
            )}
          </div>
          
          {user && (
            <div className="flex items-center space-x-4">
              <span className="hidden md:inline text-sm font-medium">
                Welcome, {user.name}
              </span>
              <button
                onClick={handleLogout}
                className="px-3 py-2 rounded-md text-sm font-medium bg-red-500 hover:bg-red-600 transition duration-300"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile Navigation */}
      {user && (
        <div className="md:hidden bg-blue-500 text-white overflow-x-auto whitespace-nowrap">
          <div className="flex space-x-2 p-2">
            <Link 
              to="/" 
              className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/')}`}
            >
              Dashboard
            </Link>
            <Link 
              to="/personal-details" 
              className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/personal-details')}`}
            >
              Personal
            </Link>
            <Link 
              to="/education" 
              className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/education')}`}
            >
              Education
            </Link>
            <Link 
              to="/work-experience" 
              className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/work-experience')}`}
            >
              Work
            </Link>
            <Link 
              to="/projects" 
              className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/projects')}`}
            >
              Projects
            </Link>
            <Link 
              to="/resume-builder" 
              className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/resume-builder')}`}
            >
              Resume
            </Link>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-blue-600 text-white py-4">
        <div className="container mx-auto px-6">
          <p className="text-center text-sm">
            &copy; {new Date().getFullYear()} Resume Builder. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;