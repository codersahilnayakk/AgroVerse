import { toast } from 'react-toastify';

/**
 * Handles API errors consistently throughout the application
 * 
 * @param {Error} error - The error object from the API call
 * @param {Object} options - Options for error handling
 * @param {string} options.defaultMessage - Default error message if one cannot be extracted
 * @param {Function} options.callback - Optional callback function to execute after handling the error
 * @param {boolean} options.silent - If true, doesn't show a toast notification
 * @returns {string} The error message
 */
const handleApiError = (error, options = {}) => {
  const { 
    defaultMessage = 'Something went wrong. Please try again.', 
    callback = null,
    silent = false
  } = options;
  
  // Extract the error message from the response
  let errorMessage = defaultMessage;
  
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    const { data, status } = error.response;
    
    // Handle different status codes
    if (status === 401) {
      errorMessage = 'Your session has expired. Please log in again.';
      // If we have an unauthorized error, we might want to redirect to login
      // or refresh the token
    } else if (status === 403) {
      errorMessage = 'You do not have permission to perform this action.';
    } else if (status === 404) {
      errorMessage = 'The requested resource was not found.';
    } else if (status === 429) {
      errorMessage = 'Too many requests. Please try again later.';
    } else if (status >= 500) {
      errorMessage = 'Server error. Please try again later.';
    }
    
    // Try to get a more specific error message from the response
    if (data) {
      if (data.message) {
        errorMessage = data.message;
      } else if (data.error) {
        errorMessage = data.error;
      } else if (typeof data === 'string') {
        errorMessage = data;
      }
    }
  } else if (error.request) {
    // The request was made but no response was received
    errorMessage = 'No response from server. Please check your internet connection.';
  } else {
    // Something happened in setting up the request that triggered an Error
    errorMessage = error.message || defaultMessage;
  }
  
  // Log the error for debugging
  console.error('API Error:', error);
  
  // Show toast notification unless silent is true
  if (!silent) {
    toast.error(errorMessage);
  }
  
  // Execute callback if provided
  if (callback && typeof callback === 'function') {
    callback(errorMessage, error);
  }
  
  return errorMessage;
};

export default handleApiError; 