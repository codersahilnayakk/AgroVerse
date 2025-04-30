import axios from 'axios';

const API_URL = '/api/users';

// Register user
const register = async (userData) => {
  const response = await axios.post(`${API_URL}/register`, userData);
  
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  
  return response.data;
};

// Login user
const login = async (userData) => {
  const response = await axios.post(`${API_URL}/login`, userData);
  
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  
  return response.data;
};

// Logout user
const logout = () => {
  localStorage.removeItem('user');
};

// Get current user profile
const getCurrentUser = async () => {
  const response = await axios.get(`${API_URL}/me`);
  return response.data;
};

// Update user profile
const updateProfile = async (profileData) => {
  const response = await axios.put(`${API_URL}/profile`, profileData);
  
  // Update stored user data
  const user = JSON.parse(localStorage.getItem('user'));
  const updatedUser = { ...user, ...response.data };
  localStorage.setItem('user', JSON.stringify(updatedUser));
  
  return response.data;
};

// Update user password
const updatePassword = async (passwordData) => {
  const response = await axios.put(`${API_URL}/password`, passwordData);
  return response.data;
};

// Request password reset
const requestPasswordReset = async (email) => {
  const response = await axios.post(`${API_URL}/reset-password`, { email });
  return response.data;
};

// Reset password with token
const resetPassword = async (token, newPassword) => {
  const response = await axios.post(`${API_URL}/reset-password/${token}`, { password: newPassword });
  return response.data;
};

// Verify email
const verifyEmail = async (token) => {
  const response = await axios.get(`${API_URL}/verify-email/${token}`);
  return response.data;
};

// Upload profile picture
const uploadProfilePicture = async (formData) => {
  const response = await axios.post(`${API_URL}/profile-picture`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  
  // Update stored user data
  const user = JSON.parse(localStorage.getItem('user'));
  const updatedUser = { ...user, profilePicture: response.data.profilePicture };
  localStorage.setItem('user', JSON.stringify(updatedUser));
  
  return response.data;
};

const authService = {
  register,
  login,
  logout,
  getCurrentUser,
  updateProfile,
  updatePassword,
  requestPasswordReset,
  resetPassword,
  verifyEmail,
  uploadProfilePicture
};

export default authService; 