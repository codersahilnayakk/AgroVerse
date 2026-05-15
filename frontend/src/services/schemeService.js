import axios from 'axios';

// Get all schemes with optional search query
const getSchemes = async (searchQuery = '') => {
  const queryString = searchQuery ? `?search=${encodeURIComponent(searchQuery)}` : '';
  const response = await axios.get(`/api/schemes${queryString}`);
  return response.data;
};

// Search schemes by a search term
const searchSchemes = async (searchTerm) => {
  const response = await axios.get(`/api/schemes/search?query=${encodeURIComponent(searchTerm)}`);
  return response.data;
};

// Get a single scheme by ID
const getSchemeById = async (schemeId) => {
  const response = await axios.get(`/api/schemes/${schemeId}`);
  return response.data;
};

const schemeService = {
  getSchemes,
  searchSchemes,
  getSchemeById,
  getUserApplications: async () => {
    // Placeholder until backend API is implemented
    return [];
  },
  getUserBookmarks: async () => {
    // Placeholder until backend API is implemented
    return [];
  }
};

export default schemeService; 