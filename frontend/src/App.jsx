/**
 * Main App Component
 * Root component with routing and layout
 */
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layout/MainLayout';
import HomePage from './pages/HomePage';
import ParagraphPage from './pages/ParagraphPage';
import EasyForm from './pages/EasyForm';
import ProfileSimple from './pages/ProfileSimple';
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy';
import ContactSupport from './pages/ContactSupport';
import FAQ from './pages/FAQ';
import ForgotPassword from './pages/ForgotPassword';
import EditProfile from './pages/EditProfile';
import { useRole } from './context/RoleContext';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Company pages
import CompanyHome from './pages/company/CompanyHome';
import CompanyDashboard from './pages/company/Dashboard';
import CompanyDashboardNew from './pages/company/CompanyDashboard';
import CompanyProfile from './pages/company/CompanyProfile';
import SearchWorkers from './pages/company/SearchWorkers';
import WorkerDetail from './pages/company/WorkerDetail';
import CompanyJobs from './pages/company/CompanyJobs';
import MyWorkers from './pages/company/MyWorkers';
import SwitchRole from './pages/SwitchRole';

// Worker pages
import JobsWorker from './pages/JobsWorker';
import WorkerDashboard from './pages/WorkerDashboard';

function App() {
  const { role } = useRole();
  const { isAuthenticated, user } = useAuth();

  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          {/* Home - Role-based home page */}
          <Route index element={
            isAuthenticated && (user?.role === 'company' || role === 'company') ? 
              <CompanyHome /> : 
              <HomePage />
          } />
          
          {/* Worker routes - Protected, require authentication and worker role */}
          <Route 
            path="worker-dashboard" 
            element={
              <ProtectedRoute requiredRole="worker">
                <WorkerDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="paragraph" 
            element={
              <ProtectedRoute requiredRole="worker">
                <ParagraphPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="form" 
            element={
              <ProtectedRoute requiredRole="worker">
                <EasyForm />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="profile" 
            element={
              <ProtectedRoute requiredRole="worker">
                <ProfileSimple />
              </ProtectedRoute>
            } 
          />

          {/* Company routes - Protected, require authentication and company role */}
          <Route 
            path="company/dashboard-new" 
            element={
              <ProtectedRoute requiredRole="company">
                <CompanyDashboardNew />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="company/dashboard" 
            element={
              <ProtectedRoute requiredRole="company">
                <CompanyDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="company/profile" 
            element={
              <ProtectedRoute requiredRole="company">
                <CompanyProfile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="company/search" 
            element={
              <ProtectedRoute requiredRole="company">
                <SearchWorkers />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="worker/:workerId" 
            element={
              <ProtectedRoute requiredRole="company">
                <WorkerDetail />
              </ProtectedRoute>
            } 
          />

          {/* Worker Jobs Route - Protected, require authentication and worker role */}
          <Route 
            path="jobs" 
            element={
              <ProtectedRoute requiredRole="worker">
                <JobsWorker />
              </ProtectedRoute>
            } 
          />

          {/* Company Jobs Route - Protected, require authentication and company role */}
          <Route 
            path="company/jobs" 
            element={
              <ProtectedRoute requiredRole="company">
                <CompanyJobs />
              </ProtectedRoute>
            } 
          />

          {/* My Workers Route - Protected, require authentication and company role */}
          <Route 
            path="company/my-workers" 
            element={
              <ProtectedRoute requiredRole="company">
                <MyWorkers />
              </ProtectedRoute>
            } 
          />

          {/* Switch Role - Available to everyone */}
          <Route path="switch-role" element={<SwitchRole />} />

          {/* Terms of Service - Public page */}
          <Route path="terms-of-service" element={<TermsOfService />} />

          {/* Privacy Policy - Public page */}
          <Route path="privacy-policy" element={<PrivacyPolicy />} />

          {/* Contact & Support - Public page */}
          <Route path="contact" element={<ContactSupport />} />

          {/* FAQ - Public page */}
          <Route path="faq" element={<FAQ />} />

          {/* Forgot Password - Public page */}
          <Route path="forgot-password" element={<ForgotPassword />} />

          {/* Edit Profile - Protected */}
          <Route 
            path="edit-profile" 
            element={
              <ProtectedRoute>
                <EditProfile />
              </ProtectedRoute>
            } 
          />

          {/* Fallback for invalid routes */}
          <Route path="*" element={
            <Navigate to={isAuthenticated ? (role === 'company' ? '/company/dashboard' : '/') : '/'} replace />
          } />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
