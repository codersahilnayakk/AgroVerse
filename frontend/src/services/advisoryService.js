import axios from 'axios';
import handleApiError from '../utils/handleApiError';

const API_URL = '/api/advisory';

/**
 * Get all advisories for the current user
 * @returns {Promise<Array>} Array of advisories
 */
const getAdvisories = async () => {
  try {
    const response = await axios.get(`${API_URL}`);
    return response.data;
  } catch (error) {
    handleApiError(error, { silent: true });
    throw error;
  }
};

/**
 * Get a specific advisory by ID
 * @param {string} id - Advisory ID
 * @returns {Promise<Object>} Advisory object
 */
const getAdvisoryById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    handleApiError(error, { silent: true });
    throw error;
  }
};

/**
 * Create a new advisory
 * @param {Object} advisoryData - Advisory data (soilType, season, waterLevel, region)
 * @returns {Promise<Object>} Created advisory
 */
const createAdvisory = async (advisoryData) => {
  try {
    const response = await axios.post(API_URL, advisoryData);
    return response.data;
  } catch (error) {
    handleApiError(error, { silent: true });
    throw error;
  }
};

/**
 * Delete an advisory
 * @param {string} id - Advisory ID
 * @returns {Promise<Object>} Deletion result
 */
const deleteAdvisory = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    handleApiError(error, { silent: true });
    throw error;
  }
};

/**
 * Get crop recommendations by parameters without saving an advisory
 * @param {Object} params - Parameters for recommendation (soilType, season, waterLevel, region)
 * @returns {Promise<Object>} Recommendations
 */
const getRecommendations = async (params) => {
  try {
    const response = await axios.post(`${API_URL}/recommendations`, params);
    return response.data;
  } catch (error) {
    handleApiError(error, { silent: true });
    throw error;
  }
};

/**
 * Get compatible crops list
 * @returns {Promise<Array>} Array of crops
 */
const getCropsList = async () => {
  try {
    const response = await axios.get(`${API_URL}/crops`);
    return response.data;
  } catch (error) {
    handleApiError(error, { silent: true });
    throw error;
  }
};

/**
 * Get fertilizer recommendations for a specific crop
 * @param {Object} params - Parameters for recommendation (crop, soilType)
 * @returns {Promise<Object>} Fertilizer recommendations
 */
const getFertilizerRecommendations = async (params) => {
  try {
    const response = await axios.post(`${API_URL}/fertilizer`, params);
    return response.data;
  } catch (error) {
    handleApiError(error, { silent: true });
    throw error;
  }
};

/**
 * Get available advisory combinations (soil types, seasons, water levels)
 * @returns {Promise<Object>} Available combinations
 */
const getAdvisoryCombinations = async () => {
  try {
    const response = await axios.get(`${API_URL}/combinations`);
    return response.data;
  } catch (error) {
    handleApiError(error, { silent: true });
    throw error;
  }
};

const advisoryService = {
  getAdvisories,
  getAdvisoryById,
  createAdvisory,
  deleteAdvisory,
  getRecommendations,
  getCropsList,
  getFertilizerRecommendations,
  getAdvisoryCombinations
};

export default advisoryService; 