import { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    const userDataString = localStorage.getItem('user');

    if (token && userDataString) {
      try {
        const userData = JSON.parse(userDataString);
        setUser(userData);
        console.log('✅ User authenticated from localStorage:', userData.name, '-', userData.role);
      } catch (error) {
        console.error('❌ Error parsing user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
      }
    } else {
      setUser(null);
    }
    
    setLoading(false);
  };

  const login = async (email, password) => {
    try {
      console.log('🔐 LOGIN: Attempting login for', email);
      const response = await api.post('/auth/login', { email, password });
      
      console.log('📥 Login response:', response.data);
      
      // Backend structure: { success: true, data: { user info }, token: "..." }
      const token = response.data.token;
      const userData = response.data.data;

      console.log('🎫 Token:', token?.substring(0, 20) + '...');
      console.log('👤 User data:', userData);

      if (!userData || !userData.role) {
        throw new Error('User data is missing role information');
      }

      // Store in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      console.log('💾 Data stored in localStorage');

      // Set user state
      setUser(userData);

      console.log('✅ Login successful - User role:', userData.role);

      // Return success with user role for navigation
      return { 
        success: true, 
        role: userData.role,
        user: userData
      };
    } catch (error) {
      console.error('❌ Login error:', error);
      console.error('❌ Error response:', error.response);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Login failed',
      };
    }
  };

  const logout = () => {
    console.log('�� Logging out...');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
