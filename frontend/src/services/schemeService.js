import axios from 'axios';

// Get all schemes with optional search query
const getSchemes = async (searchQuery = '') => {
  const queryString = searchQuery ? `?search=${encodeURIComponent(searchQuery)}` : '';
  const response = await axios.get(`/api/schemes${queryString}`);
  return response.data;
};

// Search schemes by a search term
const searchSchemes = async (searchTerm) => {
  const response = await axios.get(`/api/schemes/search?term=${encodeURIComponent(searchTerm)}`);
  return response.data;
};

// Get schemes by category
const getSchemesByCategory = async (category) => {
  const response = await axios.get(`/api/schemes/category/${category}`);
  return response.data;
};

// Get user's bookmarked schemes
const getUserBookmarks = async () => {
  const response = await axios.get('/api/schemes/bookmarks');
  return response.data;
};

// Check if user has bookmarked a scheme
const checkBookmark = async (schemeId) => {
  const response = await axios.get(`/api/schemes/${schemeId}/bookmarked`);
  return response.data.bookmarked;
};

// Toggle bookmark on a scheme
const toggleBookmark = async (schemeId) => {
  const response = await axios.post(`/api/schemes/${schemeId}/bookmark`);
  return response.data;
};

// Get a single scheme by ID
const getSchemeById = async (schemeId) => {
  const response = await axios.get(`/api/schemes/${schemeId}`);
  return response.data;
};

// Get user's scheme applications
const getUserApplications = async () => {
  const response = await axios.get('/api/applications');
  return response.data;
};

// Apply for a scheme
const applyForScheme = async (schemeId, applicationData) => {
  const response = await axios.post(`/api/schemes/${schemeId}/apply`, applicationData);
  return response.data;
};

// Upload documents for an application
const uploadDocument = async (applicationId, formData) => {
  const response = await axios.post(`/api/applications/${applicationId}/documents`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

const schemeService = {
  getSchemes,
  searchSchemes,
  getSchemesByCategory,
  getUserBookmarks,
  checkBookmark,
  toggleBookmark,
  getSchemeById,
  getUserApplications,
  applyForScheme,
  uploadDocument
};

export default schemeService; 