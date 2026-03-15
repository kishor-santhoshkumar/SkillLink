import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useRole } from '../context/RoleContext';

/**
 * PublicRoute Component
 * For routes that should redirect to dashboard if user is already authenticated
 * Useful for login/register pages
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components to render if not authenticated
 */
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const { role } = useRole();

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

  // If authenticated, redirect to appropriate dashboard
  if (isAuthenticated) {
    const redirectPath = role === 'company' ? '/company/dashboard' : '/';
    return <Navigate to={redirectPath} replace />;
  }

  // User is not authenticated, show the public route
  return children;
};

export default PublicRoute;
