import { useState, useRef, useEffect } from 'react';
import { Menu, User, LogIn, LogOut, RefreshCw, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useRole } from '../context/RoleContext';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';
import NotificationBell from './NotificationBell';

const Header = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { role } = useRole();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleEditProfile = () => {
    setShowDropdown(false);
    navigate('/edit-profile');
  };

  const handleLogout = () => {
    setShowDropdown(false);
    logout();
  };

  const handleAuthClick = () => {
    if (isAuthenticated) {
      setShowLoginModal(false);
    } else {
      setShowLoginModal(true);
    }
  };

  const handleRoleSwitchClick = () => {
    navigate('/switch-role');
  };

  const switchToRegister = () => {
    setShowLoginModal(false);
    setShowRegisterModal(true);
  };

  const switchToLogin = () => {
    setShowRegisterModal(false);
    setShowLoginModal(true);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-sm z-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative flex items-center justify-between h-20">
            {/* Left: Hamburger Menu */}
            <button
              onClick={onMenuClick}
              className="p-2.5 rounded-xl hover:bg-slate-100 transition-all duration-200 hover:scale-105"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6 text-slate-700" />
            </button>

            {/* Center: Logo */}
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <button 
                onClick={() => navigate('/')}
                className="group flex items-center gap-3 transition-all duration-300"
              >
                {/* Logo Image */}
                <img 
                  src="/logo.png" 
                  alt="SkillLink Logo" 
                  className="h-32 w-auto object-contain group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    // Fallback to gradient box if logo not found
                    e.target.style.display = 'none';
                    e.target.nextElementSibling.style.display = 'flex';
                  }}
                />
                {/* Fallback gradient box (hidden if logo loads) */}
                <div className="w-20 h-20 bg-gradient-to-br from-[#1F3A5F] to-[#2563EB] rounded-xl hidden items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                  <span className="text-white font-bold text-3xl">S</span>
                </div>
              </button>
            </div>

            {/* Right: Notification Bell + Role Switcher + Auth Button */}
            <div className="flex items-center gap-2">
              {/* Notification Bell */}
              <NotificationBell />

              {/* Role Switcher Button */}
              <button
                onClick={handleRoleSwitchClick}
                className="nav-link flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-100 transition-all duration-200 group"
                title="Switch role"
              >
                <RefreshCw className="w-4 h-4 text-slate-600 group-hover:rotate-180 transition-transform duration-500" />
                <span className="hidden sm:inline text-sm font-medium text-slate-600 capitalize">
                  {role}
                </span>
              </button>

              {/* Auth Button */}
              {isAuthenticated ? (
                <div className="relative" ref={dropdownRef}>
                  {/* Profile Button - Opens Dropdown */}
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-slate-100 transition-all duration-200 group"
                    title={user?.username}
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-[#2563EB] to-[#1F3A5F] rounded-lg flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span className="hidden sm:inline text-sm font-medium text-slate-700">
                      {user?.username}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                      {/* Edit Profile Option */}
                      <button
                        onClick={handleEditProfile}
                        className="w-full px-4 py-3 text-left text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors duration-150 flex items-center gap-3 group"
                      >
                        <User className="w-4 h-4 text-[#1e40af] group-hover:scale-110 transition-transform" />
                        <span>Edit Profile</span>
                      </button>

                      {/* Divider */}
                      <div className="h-px bg-slate-200" />

                      {/* Logout Option */}
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-3 text-left text-sm font-medium text-red-600 hover:bg-red-50 transition-colors duration-150 flex items-center gap-3 group"
                      >
                        <LogOut className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={handleAuthClick}
                  className="premium-button premium-button-primary px-5 py-2.5 text-sm flex items-center gap-2 group"
                >
                  <LogIn className="w-4 h-4 icon-slide icon-slide-right" />
                  <span className="font-semibold">Sign In</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Modals */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSwitchToRegister={switchToRegister}
      />
      <RegisterModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onSwitchToLogin={switchToLogin}
      />
    </>
  );
};

export default Header;
