import axios from 'axios';
import handleApiError from '../utils/handleApiError';

const API_URL = '/api/chatbot';

/**
 * Send a message to the RAG chatbot
 * @param {string} query - The user's question text
 * @param {string} language - BCP-47 language code (e.g. 'en-IN', 'hi-IN')
 * @param {boolean} isVoiceInitiated - Whether the message came from voice input
 * @param {string|null} sessionId - Existing session ID to continue, or null for new
 * @returns {Promise<Object>} { response, sessionId, referencedSchemes, isVoiceInitiated, language }
 */
const sendMessage = async (query, language = 'en-IN', isVoiceInitiated = false, sessionId = null) => {
  try {
    const payload = { query, language, isVoiceInitiated };
    if (sessionId) payload.sessionId = sessionId;

    const response = await axios.post(`${API_URL}/message`, payload);
    return response.data;
  } catch (error) {
    handleApiError(error, { silent: true });
    throw error;
  }
};

/**
 * Get all chat sessions for the logged-in user
 * @returns {Promise<Array>} Array of session summaries
 */
const getHistory = async () => {
  try {
    const response = await axios.get(`${API_URL}/history`);
    return response.data;
  } catch (error) {
    handleApiError(error, { silent: true });
    throw error;
  }
};

/**
 * Get a specific chat session by ID
 * @param {string} sessionId
 * @returns {Promise<Object>} Full session with messages
 */
const getSession = async (sessionId) => {
  try {
    const response = await axios.get(`${API_URL}/history/${sessionId}`);
    return response.data;
  } catch (error) {
    handleApiError(error, { silent: true });
    throw error;
  }
};

/**
 * Delete all chat history for the logged-in user
 * @returns {Promise<Object>} { message }
 */
const clearHistory = async () => {
  try {
    const response = await axios.delete(`${API_URL}/history`);
    return response.data;
  } catch (error) {
    handleApiError(error, { silent: true });
    throw error;
  }
};

/**
 * Get the predefined quick-action buttons
 * @returns {Promise<Array>} Quick action objects
 */
const getQuickActions = async () => {
  try {
    const response = await axios.get(`${API_URL}/quick-actions`);
    return response.data;
  } catch (error) {
    handleApiError(error, { silent: true });
    throw error;
  }
};
/**
 * Guided crop help flow — sends step + selections to get next options or final result
 * @param {string} step - 'start' | 'soil' | 'season' | 'result'
 * @param {Object} flowData - { soilType?, season?, waterLevel? }
 * @param {string|null} sessionId - Existing session ID
 * @param {string} language - BCP-47 language code (e.g. 'en-IN', 'hi-IN')
 * @returns {Promise<Object>} { response, options, flowType, flowStep, flowData, sessionId? }
 */
const cropHelpFlow = async (step, flowData = {}, sessionId = null, language = 'en-IN') => {
  try {
    const payload = { step, language, ...flowData };
    if (sessionId) payload.sessionId = sessionId;

    const response = await axios.post(`${API_URL}/crop-help`, payload);
    return response.data;
  } catch (error) {
    handleApiError(error, { silent: true });
    throw error;
  }
};

const chatbotService = {
  sendMessage,
  cropHelpFlow,
  getHistory,
  getSession,
  clearHistory,
  getQuickActions,
};

export default chatbotService;
