import axios from 'axios';

// Add a request interceptor to automatically add the token to all API requests
axios.interceptors.request.use(
  config => {
    // Get token from localStorage
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (user && user.token) {
      // Add token to headers
      config.headers['Authorization'] = `Bearer ${user.token}`;
    }
    
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token expiration
axios.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    // Handle authentication errors
    if (error.response && error.response.status === 401) {
      // Check if the error is due to an expired or invalid token
      if (error.response.data && 
          (error.response.data.message === 'Not authorized, token failed' || 
           error.response.data.message === 'Not authorized, no token')) {
        // Clear localStorage and redirect to login
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default axios; 