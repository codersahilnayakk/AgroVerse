// Get user data from local storage
export const getUserFromStorage = () => {
  const userJSON = localStorage.getItem('user');
  if (!userJSON) return null;
  
  try {
    return JSON.parse(userJSON);
  } catch (error) {
    console.error('Error parsing user data from localStorage:', error);
    return null;
  }
};

// Get user token from storage
export const getUserTokenFromStorage = () => {
  const user = getUserFromStorage();
  return user?.token || '';
};

// Save user data to local storage
export const saveUserToStorage = (userData) => {
  localStorage.setItem('user', JSON.stringify(userData));
};

// Remove user data from local storage
export const removeUserFromStorage = () => {
  localStorage.removeItem('user');
};

// Check if token is expired
export const isTokenExpired = (token) => {
  if (!token) return true;
  
  try {
    // Token structure: header.payload.signature
    const payload = token.split('.')[1];
    const decodedPayload = JSON.parse(atob(payload));
    
    // Check if exp exists and compare with current time
    if (decodedPayload.exp) {
      const expirationTime = decodedPayload.exp * 1000; // Convert to milliseconds
      return Date.now() >= expirationTime;
    }
    
    return false;
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true; // Assume expired on error
  }
};

// Format error message from API response
export const formatAuthError = (error) => {
  if (error.response && error.response.data) {
    if (error.response.data.message) {
      return error.response.data.message;
    }
    if (error.response.data.error) {
      return error.response.data.error;
    }
  }
  return error.message || 'Authentication failed. Please try again.';
};

// Check if user has a specific role
export const hasRole = (user, role) => {
  if (!user || !user.roles) return false;
  return user.roles.includes(role);
};

// Check if user is admin
export const isAdmin = (user) => {
  return hasRole(user, 'admin');
};

// Check if a user has a specific permission
export const hasPermission = (user, permission) => {
  if (!user || !user.permissions) return false;
  return user.permissions.includes(permission);
}; 