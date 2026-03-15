import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => {
    // Initialize token from localStorage
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      // Set axios header immediately on initialization
      axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
    }
    return savedToken;
  });
  const [loading, setLoading] = useState(true);

  // Configure axios defaults and fetch user info
  useEffect(() => {
    if (token) {
      // Ensure axios header is set
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // Only fetch user info if we don't have it yet
      if (!user) {
        fetchUserInfo();
      } else {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUserInfo = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/auth/me');
      setUser(response.data);
      console.log('User info fetched:', response.data);
    } catch (error) {
      console.error('Failed to fetch user info:', error);
      // If token is invalid, clear everything
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = (tokenData) => {
    const { access_token, user: userData } = tokenData;
    
    // Store token
    localStorage.setItem('token', access_token);
    
    // Set axios header immediately
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
    
    // Set state
    setToken(access_token);
    setUser(userData);
    setLoading(false);
    
    // Log for debugging
    console.log('Login successful:', { 
      username: userData?.username, 
      role: userData?.role,
      id: userData?.id 
    });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('selectedRole'); // Clear selected role too
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
    console.log('Logged out successfully');
  };

  const value = {
    user,
    setUser,
    token,
    loading,
    login,
    logout,
    isAuthenticated: !!token && !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
