import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, FileText, ClipboardList, User, X, Building2, Search, RefreshCw, Briefcase } from 'lucide-react';
import { useRole } from '../context/RoleContext';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { role } = useRole();

  const handleSwitchRole = () => {
    navigate('/switch-role');
    onClose();
  };

  // Worker menu items
  const workerMenuItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: User, label: 'Dashboard', path: '/worker-dashboard' },
    { icon: FileText, label: 'Describe Your Work', path: '/paragraph' },
    { icon: ClipboardList, label: 'Easy Form', path: '/form' },
    { icon: Briefcase, label: 'Jobs', path: '/jobs' },
    { icon: User, label: 'My Profile', path: '/profile' },
  ];

  // Company menu items
  const companyMenuItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Building2, label: 'Dashboard', path: '/company/dashboard-new' },
    { icon: Search, label: 'Search Workers', path: '/company/search' },
    { icon: Briefcase, label: 'Jobs', path: '/company/jobs' },
    { icon: User, label: 'My Workers', path: '/company/my-workers' },
    { icon: Building2, label: 'Company Profile', path: '/company/profile' },
  ];

  const menuItems = role === 'company' ? companyMenuItems : workerMenuItems;

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40 transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            {/* Logo Image */}
            <img 
              src="/logo.png" 
              alt="SkillLink Logo" 
              className="h-32 w-auto object-contain"
              onError={(e) => {
                // Show text if logo not found
                e.target.style.display = 'none';
                e.target.nextElementSibling.style.display = 'block';
              }}
            />
            <h2 className="text-2xl font-bold text-[#1F3A5F] hidden">SkillLink</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors duration-200"
            aria-label="Close menu"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Menu Items */}
        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={onClose}
                    className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 ${
                      active
                        ? 'bg-[#1e40af] text-white shadow-md'
                        : 'text-slate-700 hover:bg-blue-50 hover:text-[#1e40af]'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </li>
              );
            })}
            
            {/* Switch Role Button */}
            <li>
              <button
                onClick={handleSwitchRole}
                className="w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 text-slate-700 hover:bg-blue-50 hover:text-[#1e40af] border-t border-slate-200 mt-4 pt-4"
              >
                <RefreshCw className="w-5 h-5" />
                <span className="font-medium">Switch Role</span>
              </button>
            </li>
          </ul>
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-slate-200">
          <p className="text-sm text-slate-500 text-center">
            AI-Powered Skilled Worker Platform
          </p>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
