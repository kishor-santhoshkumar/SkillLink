import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';
import { useRole } from '../context/RoleContext';

const UnauthorizedPage = () => {
  const navigate = useNavigate();
  const { role } = useRole();

  const handleGoHome = () => {
    const homePath = role === 'company' ? '/company/dashboard' : '/';
    navigate(homePath);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] px-4">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="mb-8">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <ShieldAlert className="w-12 h-12 text-red-600" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-[#1F3A5F] mb-4">
          Access Denied
        </h1>

        {/* Message */}
        <p className="text-lg text-slate-600 mb-8">
          You don't have permission to access this page. This page is only available for {role === 'worker' ? 'companies' : 'workers'}.
        </p>

        {/* Suggestion */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8">
          <p className="text-sm text-slate-700">
            <strong>Tip:</strong> You can switch your role using the role switcher button (🔄) in the header if you have multiple roles.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleGoBack}
            className="flex items-center justify-center gap-2 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
          <button
            onClick={handleGoHome}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-[#2563EB] text-white rounded-lg hover:bg-[#1F3A5F] transition-colors"
          >
            <Home className="w-4 h-4" />
            Go to {role === 'company' ? 'Dashboard' : 'Home'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
