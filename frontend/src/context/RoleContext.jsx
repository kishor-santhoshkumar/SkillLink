import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const RoleContext = createContext();

export const RoleProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  
  // For authenticated users: role comes from user data
  // For unauthenticated users: role can be switched freely
  const [selectedRole, setSelectedRole] = useState(() => {
    return localStorage.getItem('selectedRole') || 'worker';
  });

  // Determine the active role
  const role = isAuthenticated ? (user?.role || 'worker') : selectedRole;

  // Sync role to localStorage for display/debugging
  useEffect(() => {
    localStorage.setItem('role', role);
  }, [role]);

  // Sync authenticated user's role
  useEffect(() => {
    if (isAuthenticated && user?.role) {
      // When user logs in, update selectedRole to match their actual role
      setSelectedRole(user.role);
      localStorage.setItem('selectedRole', user.role);
    }
  }, [isAuthenticated, user]);

  const switchRole = (newRole) => {
    if (isAuthenticated) {
      console.warn('Cannot switch role while authenticated. Role is determined by your account.');
      return;
    }
    
    console.log('Switching role to:', newRole);
    setSelectedRole(newRole);
    localStorage.setItem('selectedRole', newRole);
  };

  const value = {
    role,
    switchRole,
    isWorker: role === 'worker',
    isCompany: role === 'company',
    canSwitchRole: !isAuthenticated // Can only switch when not logged in
  };

  return (
    <RoleContext.Provider value={value}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within RoleProvider');
  }
  return context;
};

export default RoleContext;
