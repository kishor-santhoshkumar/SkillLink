import { useState } from 'react';
import { X, Briefcase, Wrench } from 'lucide-react';
import { useRole } from '../context/RoleContext';

const RoleSwitcher = ({ isOpen, onClose }) => {
  const { role, switchRole } = useRole();
  const [selected, setSelected] = useState(role);

  const handleSwitch = () => {
    switchRole(selected);
    onClose();
    // Reload to update routes
    window.location.reload();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-2xl font-bold text-[#1F3A5F]">Select Your Role</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          <p className="text-slate-600 mb-6 text-center">
            Choose how you want to use SkillLink
          </p>

          {/* Role Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Worker Card */}
            <button
              onClick={() => setSelected('worker')}
              className={`p-8 rounded-xl border-2 transition-all duration-200 text-left ${
                selected === 'worker'
                  ? 'border-[#2563EB] bg-blue-50 shadow-lg'
                  : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
              }`}
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className={`p-4 rounded-full ${
                  selected === 'worker' ? 'bg-[#2563EB]' : 'bg-slate-100'
                }`}>
                  <Wrench className={`w-12 h-12 ${
                    selected === 'worker' ? 'text-white' : 'text-slate-600'
                  }`} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#1F3A5F] mb-2">
                    Worker
                  </h3>
                  <p className="text-sm text-slate-600">
                    Create your professional profile and showcase your skills
                  </p>
                </div>
                {selected === 'worker' && (
                  <div className="mt-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#2563EB] text-white">
                      Selected
                    </span>
                  </div>
                )}
              </div>
            </button>

            {/* Company Card */}
            <button
              onClick={() => setSelected('company')}
              className={`p-8 rounded-xl border-2 transition-all duration-200 text-left ${
                selected === 'company'
                  ? 'border-[#2563EB] bg-blue-50 shadow-lg'
                  : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
              }`}
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className={`p-4 rounded-full ${
                  selected === 'company' ? 'bg-[#2563EB]' : 'bg-slate-100'
                }`}>
                  <Briefcase className={`w-12 h-12 ${
                    selected === 'company' ? 'text-white' : 'text-slate-600'
                  }`} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#1F3A5F] mb-2">
                    Company
                  </h3>
                  <p className="text-sm text-slate-600">
                    Find and hire skilled workers for your projects
                  </p>
                </div>
                {selected === 'company' && (
                  <div className="mt-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#2563EB] text-white">
                      Selected
                    </span>
                  </div>
                )}
              </div>
            </button>
          </div>

          {/* Continue Button */}
          <div className="mt-8">
            <button
              onClick={handleSwitch}
              className="w-full px-6 py-3 bg-[#2563EB] text-white rounded-xl font-semibold shadow-lg hover:bg-[#1d4ed8] transition-all duration-300"
            >
              Continue as {selected === 'worker' ? 'Worker' : 'Company'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleSwitcher;
