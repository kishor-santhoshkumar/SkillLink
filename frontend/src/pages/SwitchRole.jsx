import { useNavigate } from 'react-router-dom';
import { Wrench, Building2, ArrowLeft } from 'lucide-react';
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
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-8">
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
            className="group relative bg-gradient-to-br from-[#1F3A5F] to-[#2563EB] rounded-3xl p-12 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
          >
            {/* Emoji/Icon */}
            <div className="mb-8">
              <div className="w-32 h-32 mx-auto bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center transform group-hover:rotate-6 transition-transform duration-300">
                <Wrench className="w-16 h-16 text-white" />
              </div>
            </div>

            {/* Title */}
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              👷 Worker
            </h2>

            {/* Description */}
            <p className="text-lg text-blue-100 mb-6">
              Create your professional profile, showcase your skills, and find job opportunities
            </p>

            {/* Features */}
            <ul className="text-left space-y-2 mb-8">
              <li className="flex items-center gap-2 text-white">
                <span className="text-green-400">✓</span>
                <span>Build digital profile</span>
              </li>
              <li className="flex items-center gap-2 text-white">
                <span className="text-green-400">✓</span>
                <span>Get hired by companies</span>
              </li>
              <li className="flex items-center gap-2 text-white">
                <span className="text-green-400">✓</span>
                <span>Receive ratings & reviews</span>
              </li>
              <li className="flex items-center gap-2 text-white">
                <span className="text-green-400">✓</span>
                <span>View job opportunities</span>
              </li>
            </ul>

            {/* Button */}
            <div className="px-8 py-4 bg-white text-[#1F3A5F] rounded-xl font-bold text-lg group-hover:shadow-lg transition-shadow">
              Continue as Worker
            </div>

            {/* Hover Effect Border */}
            <div className="absolute inset-0 rounded-3xl border-4 border-transparent group-hover:border-white/30 transition-colors duration-300"></div>
          </button>

          {/* Company Card */}
          <button
            onClick={() => handleRoleSelect('company')}
            className="group relative bg-gradient-to-br from-[#2563EB] to-[#1F3A5F] rounded-3xl p-12 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
          >
            {/* Emoji/Icon */}
            <div className="mb-8">
              <div className="w-32 h-32 mx-auto bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center transform group-hover:rotate-6 transition-transform duration-300">
                <Building2 className="w-16 h-16 text-white" />
              </div>
            </div>

            {/* Title */}
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              🏢 Company
            </h2>

            {/* Description */}
            <p className="text-lg text-blue-100 mb-6">
              Find and hire skilled workers, post job opportunities, and build your team
            </p>

            {/* Features */}
            <ul className="text-left space-y-2 mb-8">
              <li className="flex items-center gap-2 text-white">
                <span className="text-green-400">✓</span>
                <span>Search skilled workers</span>
              </li>
              <li className="flex items-center gap-2 text-white">
                <span className="text-green-400">✓</span>
                <span>View detailed profiles</span>
              </li>
              <li className="flex items-center gap-2 text-white">
                <span className="text-green-400">✓</span>
                <span>Post job requests</span>
              </li>
              <li className="flex items-center gap-2 text-white">
                <span className="text-green-400">✓</span>
                <span>Contact workers directly</span>
              </li>
            </ul>

            {/* Button */}
            <div className="px-8 py-4 bg-white text-[#1F3A5F] rounded-xl font-bold text-lg group-hover:shadow-lg transition-shadow">
              Continue as Company
            </div>

            {/* Hover Effect Border */}
            <div className="absolute inset-0 rounded-3xl border-4 border-transparent group-hover:border-white/30 transition-colors duration-300"></div>
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
