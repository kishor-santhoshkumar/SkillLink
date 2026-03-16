import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useRole } from '../context/RoleContext';
import { useAuth } from '../context/AuthContext';

const SwitchRole = () => {
  const navigate = useNavigate();
  const { switchRole } = useRole();
  const { isAuthenticated } = useAuth();

  const handleRoleSelect = (selectedRole) => {
    switchRole(selectedRole);
    
    // Navigate to appropriate dashboard
    if (selectedRole === 'company') {
      navigate('/company/dashboard');
    } else {
      navigate('/');
    }
    
    // Reload to update navigation
    window.location.reload();
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex items-center justify-center px-4 py-8">
      {/* Back Button */}
      <button
        onClick={handleGoBack}
        className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="hidden sm:inline">Back</span>
      </button>

      <div className="max-w-6xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#1F3A5F] mb-4">
            Switch Role
          </h1>
          <p className="text-xl sm:text-2xl text-slate-600">
            Choose how you want to use SkillLink
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Worker Card */}
          <button
            onClick={() => handleRoleSelect('worker')}
            className="group relative rounded-3xl p-12 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden min-h-[500px] flex flex-col justify-end"
            style={{
              backgroundImage: 'url(/worker-role-bg.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {/* Button at bottom */}
            <div className="px-8 py-4 bg-white text-[#1F3A5F] rounded-xl font-bold text-lg group-hover:shadow-lg transition-shadow text-center">
              Continue as Worker
            </div>

            {/* Hover Effect Border */}
            <div className="absolute inset-0 rounded-3xl border-4 border-transparent group-hover:border-white/30 transition-colors duration-300 pointer-events-none"></div>
          </button>

          {/* Company Card */}
          <button
            onClick={() => handleRoleSelect('company')}
            className="group relative rounded-3xl p-12 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden min-h-[500px] flex flex-col justify-end"
            style={{
              backgroundImage: 'url(/company-role-bg.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {/* Button at bottom */}
            <div className="px-8 py-4 bg-white text-[#1F3A5F] rounded-xl font-bold text-lg group-hover:shadow-lg transition-shadow text-center">
              Continue as Company
            </div>

            {/* Hover Effect Border */}
            <div className="absolute inset-0 rounded-3xl border-4 border-transparent group-hover:border-white/30 transition-colors duration-300 pointer-events-none"></div>
          </button>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-12">
          <p className="text-slate-600 text-lg">
            {isAuthenticated 
              ? 'You can switch roles anytime from the header menu'
              : 'Select your role to continue'
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default SwitchRole;
