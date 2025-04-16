import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import './App.css';

// Import pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import PersonalDetailsPage from './pages/PersonalDetailsPage';
import EducationPage from './pages/EducationPage';
import WorkExperiencePage from './pages/WorkExperiencePage';
import ProjectsPage from './pages/ProjectsPage';
import ResumeBuilderPage from './pages/ResumeBuilderPage';
import ResumePreviewPage from './pages/ResumePreviewPage';

// Protected route wrapper component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/personal-details" element={
            <ProtectedRoute>
              <PersonalDetailsPage />
            </ProtectedRoute>
          } />
          
          <Route path="/education" element={
            <ProtectedRoute>
              <EducationPage />
            </ProtectedRoute>
          } />
          
          <Route path="/work-experience" element={
            <ProtectedRoute>
              <WorkExperiencePage />
            </ProtectedRoute>
          } />
          
          <Route path="/projects" element={
            <ProtectedRoute>
              <ProjectsPage />
            </ProtectedRoute>
          } />
          
          <Route path="/resume-builder" element={
            <ProtectedRoute>
              <ResumeBuilderPage />
            </ProtectedRoute>
          } />
          
          <Route path="/resume-preview/:id" element={
            <ProtectedRoute>
              <ResumePreviewPage />
            </ProtectedRoute>
          } />
          
          {/* Default route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
