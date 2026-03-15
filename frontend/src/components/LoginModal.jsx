import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Loader2, LogIn } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';

const LoginModal = ({ isOpen, onClose, onSwitchToRegister }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username_or_phone: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://127.0.0.1:8000/auth/login', formData);
      
      // Login with user data (role is automatically set from user.role)
      login(response.data);
      onClose();
      
      // Navigate to appropriate dashboard based on user role
      setTimeout(() => {
        if (response.data.user?.role === 'company') {
          navigate('/company/dashboard');
        } else {
          navigate('/');
        }
      }, 100);
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    console.log('Google login initiated...');
    setLoading(true);
    setError('');

    try {
      console.log('Sending token to backend...');
      const response = await axios.post('http://127.0.0.1:8000/auth/google-login', {
        token: credentialResponse.credential
      });
      
      console.log('Backend response:', response.data);
      
      if (response.data && response.data.access_token) {
        console.log('Login successful, calling login function...');
        
        // Login with user data (role is automatically set from user.role)
        login(response.data);
        console.log('Closing modal...');
        onClose();
        
        // Navigate to appropriate dashboard based on user role
        setTimeout(() => {
          if (response.data.user?.role === 'company') {
            navigate('/company/dashboard');
          } else {
            navigate('/');
          }
        }, 100);
      } else {
        console.error('Invalid response format:', response.data);
        setError('Invalid response from server');
      }
    } catch (err) {
      console.error('Google login error:', err);
      console.error('Error response:', err.response?.data);
      setError(err.response?.data?.detail || 'Google login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError('Google login failed. Please try again.');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-2xl font-bold text-[#1F3A5F]">Sign In</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Google Login */}
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              size="large"
              text="signin_with"
              shape="rectangular"
              logo_alignment="left"
            />
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-slate-500">OR</span>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Username or Phone Number
              </label>
              <input
                type="text"
                value={formData.username_or_phone}
                onChange={(e) => setFormData({ ...formData, username_or_phone: e.target.value })}
                placeholder="Enter username or phone"
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Enter password"
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                required
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
                  Signing In...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Register Link */}
          <div className="text-center">
            <p className="text-sm text-slate-600">
              Don't have an account?{' '}
              <button
                onClick={onSwitchToRegister}
                className="text-[#2563EB] font-semibold hover:underline"
              >
                Create Account
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
