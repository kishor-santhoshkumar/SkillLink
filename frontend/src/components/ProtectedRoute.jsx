import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useRole } from '../context/RoleContext';

/**
 * ProtectedRoute Component
 * Protects routes by requiring authentication and optionally a specific role
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components to render if authorized
 * @param {string} props.requiredRole - Optional role required to access route ('worker' or 'company')
 * @param {boolean} props.requireAuth - Whether authentication is required (default: true)
 */
const ProtectedRoute = ({ children, requiredRole = null, requireAuth = true }) => {
  const { isAuthenticated, loading } = useAuth();
  const { role } = useRole();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#2563EB] mx-auto"></div>
          <p className="mt-4 text-lg text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Check authentication requirement
  if (requireAuth && !isAuthenticated) {
    // Redirect to home page (which will show login modal)
    // Save the attempted location to redirect back after login
    return <Navigate to="/" state={{ from: location, showLogin: true }} replace />;
  }

  // Check role requirement
  if (requiredRole && role !== requiredRole) {
    // Redirect to appropriate dashboard based on current role
    const redirectPath = role === 'company' ? '/company/dashboard' : '/';
    return <Navigate to={redirectPath} replace />;
  }

  // User is authenticated and has correct role (if required)
  return children;
};

export default ProtectedRoute;
