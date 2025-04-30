import { format, formatDistanceToNow } from 'date-fns';

/**
 * Formats a date for display in the application
 * @param {string|Date} dateInput - Date string or Date object to format
 * @param {Object} options - Formatting options
 * @param {boolean} options.includeTime - Whether to include the time
 * @param {boolean} options.includeRelative - Whether to include relative time (e.g. "2 days ago")
 * @returns {string} Formatted date string
 */
const formatDate = (dateInput, options = {}) => {
  if (!dateInput) return 'Unknown date';
  
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  
  // Return invalid date message if date is invalid
  if (isNaN(date.getTime())) return 'Invalid date';
  
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  // If includeRelative is true, show relative time for recent dates
  if (options.includeRelative) {
    // Less than a minute
    if (diffInSeconds < 60) {
      return 'Just now';
    }
    
    // Less than an hour
    if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    }
    
    // Less than a day
    if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    }
    
    // Less than a week
    if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
  }
  
  // Format the date
  const formattedDate = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
  
  // Add time if requested
  if (options.includeTime) {
    const formattedTime = date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
    return `${formattedDate} at ${formattedTime}`;
  }
  
  return formattedDate;
};

/**
 * Format a date with both date and time
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date and time
 */
const formatDateTime = (date) => {
  if (!date) return 'N/A';
  
  try {
    const dateObj = new Date(date);
    return format(dateObj, 'PPp'); // Mar 15, 2023, 3:45 PM
  } catch (error) {
    console.error('Error formatting date and time:', error);
    return 'Invalid date';
  }
};

/**
 * Format a date as relative time (e.g., "5 days ago")
 * @param {string|Date} date - Date to format
 * @returns {string} Relative time
 */
const formatRelativeTime = (date) => {
  if (!date) return 'N/A';
  
  try {
    const dateObj = new Date(date);
    return formatDistanceToNow(dateObj, { addSuffix: true });
  } catch (error) {
    console.error('Error formatting relative time:', error);
    return 'Invalid date';
  }
};

/**
 * Format a date for display in application forms
 * @param {string|Date} date - Date to format
 * @returns {string} Date formatted as YYYY-MM-DD for input[type="date"]
 */
const formatForDateInput = (date) => {
  if (!date) return '';
  
  try {
    const dateObj = new Date(date);
    return format(dateObj, 'yyyy-MM-dd');
  } catch (error) {
    console.error('Error formatting date for input:', error);
    return '';
  }
};

/**
 * Get a formatted date range display
 * @param {string|Date} startDate - Start date
 * @param {string|Date} endDate - End date
 * @returns {string} Formatted date range
 */
const formatDateRange = (startDate, endDate) => {
  if (!startDate || !endDate) return 'N/A';
  
  try {
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);
    return `${format(startDateObj, 'PP')} - ${format(endDateObj, 'PP')}`;
  } catch (error) {
    console.error('Error formatting date range:', error);
    return 'Invalid date range';
  }
};

export default formatDate;

export {
  formatDateTime,
  formatRelativeTime,
  formatForDateInput,
  formatDateRange
}; 