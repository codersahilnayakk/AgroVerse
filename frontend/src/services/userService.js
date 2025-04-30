import axios from 'axios';

const API_URL = '/api/users';

// Get user profile
const getProfile = async () => {
  const response = await axios.get(`${API_URL}/profile`);
  return response.data;
};

// Update user profile
const updateProfile = async (userData) => {
  const response = await axios.put(`${API_URL}/profile`, userData);
  return response.data;
};

// Get user dashboard stats
const getDashboardStats = async () => {
  const response = await axios.get(`${API_URL}/dashboard`);
  return response.data;
};

// Update user password
const updatePassword = async (passwordData) => {
  const response = await axios.put(`${API_URL}/password`, passwordData);
  return response.data;
};

const userService = {
  getProfile,
  updateProfile,
  getDashboardStats,
  updatePassword
};

export default userService; 