import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Loader2, UserPlus } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useRole } from '../context/RoleContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

const RegisterModal = ({ isOpen, onClose, onSwitchToLogin }) => {
  const navigate = useNavigate();
  const { switchRole } = useRole();
  const [formData, setFormData] = useState({
    username: '',
    phone_number: '',
    password: '',
    confirm_password: '',
    email: '',
    role: 'worker'  // NEW: Default role
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate passwords match
    if (formData.password !== formData.confirm_password) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/auth/register`, formData);
      
      // Sync role before login
      switchRole(formData.role);
      
      // Login
      login(response.data);
      
      // Close modal
      onClose();
      
      // Navigate to appropriate dashboard
      setTimeout(() => {
        if (formData.role === 'company') {
          navigate('/company/dashboard');
        } else {
          navigate('/');
        }
      }, 100);
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-2xl font-bold text-[#1F3A5F]">Create Account</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role Selection */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                I am a *
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'worker' })}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    formData.role === 'worker'
                      ? 'border-[#2563EB] bg-blue-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                  disabled={loading}
                >
                  <div className="text-center">
                    <span className="text-2xl mb-2 block">👷</span>
                    <span className="font-semibold text-sm">Worker</span>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'company' })}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    formData.role === 'company'
                      ? 'border-[#2563EB] bg-blue-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                  disabled={loading}
                >
                  <div className="text-center">
                    <span className="text-2xl mb-2 block">🏢</span>
                    <span className="font-semibold text-sm">Company</span>
                  </div>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Username *
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="Choose a username"
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                required
                minLength={3}
                disabled={loading}
              />
              <p className="text-xs text-slate-500 mt-1">Minimum 3 characters</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                value={formData.phone_number}
                onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                placeholder="Enter your phone number"
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                required
                minLength={10}
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Email (Optional)
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter your email"
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Password *
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Create a password"
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                required
                minLength={6}
                disabled={loading}
              />
              <p className="text-xs text-slate-500 mt-1">Minimum 6 characters</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Confirm Password *
              </label>
              <input
                type="password"
                value={formData.confirm_password}
                onChange={(e) => setFormData({ ...formData, confirm_password: e.target.value })}
                placeholder="Confirm your password"
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                required
                minLength={6}
                disabled={loading}
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded-r-xl">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#2563EB] text-white rounded-xl font-semibold shadow-lg hover:bg-[#1d4ed8] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  Create Account
                </>
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="text-center mt-6">
            <p className="text-sm text-slate-600">
              Already have an account?{' '}
              <button
                onClick={onSwitchToLogin}
                className="text-[#2563EB] font-semibold hover:underline"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterModal;
