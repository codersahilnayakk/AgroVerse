// Format date to a readable string format
export const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// Truncate text to a specific length and add ellipsis
export const truncateText = (text, maxLength) => {
  if (!text) return '';
  return text.length > maxLength ? text.substr(0, maxLength).trim() + '...' : text;
};

// Convert camelCase to Title Case (e.g., "cropPlanning" to "Crop Planning")
export const camelCaseToTitleCase = (camelCase) => {
  if (!camelCase) return '';
  const titleCase = camelCase
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase());
  return titleCase;
};

// Get authentication configuration with bearer token
export const getAuthConfig = () => {
  const token = localStorage.getItem('userToken');
  
  if (!token) {
    return {};
  }
  
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Function to format file size
export const formatFileSize = (bytes) => {
  if (!bytes) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Generate random ID
export const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};

// Format currency
export const formatCurrency = (value, locale = 'en-IN', currency = 'INR') => {
  if (!value && value !== 0) return '';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

// Calculate percentage
export const calculatePercentage = (value, total) => {
  if (!value || !total) return 0;
  return Math.round((value / total) * 100);
};

// Sort array of objects by a specific property
export const sortByProperty = (array, property, ascending = true) => {
  if (!array || !Array.isArray(array)) return [];
  
  return [...array].sort((a, b) => {
    const valueA = a[property];
    const valueB = b[property];
    
    if (valueA < valueB) return ascending ? -1 : 1;
    if (valueA > valueB) return ascending ? 1 : -1;
    return 0;
  });
};

// Debounce function for search inputs
export const debounce = (func, wait) => {
  let timeout;
  
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Get query parameters from URL
export const getQueryParams = () => {
  const search = window.location.search.substring(1);
  
  if (!search) return {};
  
  return JSON.parse(
    '{"' +
    decodeURI(search)
      .replace(/"/g, '\\"')
      .replace(/&/g, '","')
      .replace(/=/g, '":"') +
    '"}'
  );
};

// Validate email format
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Get initials from name
export const getInitials = (name) => {
  if (!name) return '';
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

// Filter array by search term against multiple fields
export const filterByFields = (array, searchTerm, fields) => {
  if (!array || !Array.isArray(array) || !searchTerm || !fields) return array;
  
  const lowerCaseSearchTerm = searchTerm.toLowerCase();
  
  return array.filter(item => {
    return fields.some(field => {
      const value = item[field];
      if (typeof value === 'string') {
        return value.toLowerCase().includes(lowerCaseSearchTerm);
      }
      return false;
    });
  });
}; 