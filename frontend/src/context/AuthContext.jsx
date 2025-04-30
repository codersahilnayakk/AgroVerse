import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

// Create the context
const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on load
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        
        // Set default auth header
        axios.defaults.headers.common['Authorization'] = `Bearer ${parsedUser.token}`;
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  // Register user
  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await axios.post('/api/users/register', userData);
      
      if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        setUser(response.data);
      }
      
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const login = async (userData) => {
    try {
      setLoading(true);
      const response = await axios.post('/api/users/login', userData);
      
      if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        setUser(response.data);
      }
      
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      setLoading(true);
      const response = await axios.put('/api/users/profile', userData);
      
      if (response.data) {
        // Preserve the token from the current user data
        const updatedUser = { ...response.data, token: user.token };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
      }
      
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Profile update failed';
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Verify email
  const verifyEmail = async (token) => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/users/verify-email/${token}`);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Email verification failed';
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Request password reset
  const requestPasswordReset = async (email) => {
    try {
      setLoading(true);
      const response = await axios.post('/api/users/forgot-password', { email });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Password reset request failed';
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Reset password
  const resetPassword = async (token, password) => {
    try {
      setLoading(true);
      const response = await axios.post(`/api/users/reset-password/${token}`, { password });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Password reset failed';
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Check token expiration
  const checkTokenExpiration = () => {
    if (!user || !user.token) return false;
    
    try {
      // For JWT tokens, extract the payload and check expiration
      const payload = JSON.parse(atob(user.token.split('.')[1]));
      const expiry = payload.exp * 1000; // Convert to milliseconds
      
      if (Date.now() >= expiry) {
        logout();
        toast.error('Your session has expired. Please log in again.');
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error checking token expiration:', error);
      return false;
    }
  };

  // Context value
  const contextValue = {
    user,
    loading,
    register,
    login,
    logout,
    updateProfile,
    verifyEmail,
    requestPasswordReset,
    resetPassword,
    checkTokenExpiration
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Export the context for use with useContext
export { AuthContext };

// Export default for backward compatibility
export default AuthContext; 