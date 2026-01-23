/**
 * Error Utilities
 * 
 * Provides centralized error handling and formatting
 * Converts various error types to consistent, user-friendly messages
 * Helps maintain consistent error UX across application
 */

/**
 * Extract error message from various error types
 * Handles: string errors, Error objects, API response errors
 * @param {string|Error|Object} error - Error in any format
 * @returns {string} User-friendly error message
 */
export const getErrorMessage = (error) => {
  // Direct string error
  if (typeof error === 'string') {
    return error;
  }

  // Error object with message property
  if (error?.message) {
    return error.message;
  }

  // API response with error property
  if (error?.error) {
    return error.error;
  }

  // Fallback generic message
  return 'An unexpected error occurred. Please try again.';
};

/**
 * Format error response from API calls
 * Extracts user-friendly message from API error response
 * @param {Object|string} response - API error response
 * @returns {string} Formatted error message for user
 */
export const formatApiError = (response) => {
  // No response (network error)
  if (!response) {
    return 'Network error. Please check your connection.';
  }

  // Response is a string
  if (typeof response === 'string') {
    return response;
  }

  // Response has message property (most API errors)
  if (response.message) {
    return response.message;
  }

  // Response has error property
  if (response.error) {
    return response.error;
  }

  // Fallback generic message
  return 'Something went wrong. Please try again.';
};

/**
 * Handle API error and show appropriate message
export const handleApiError = (error, defaultMessage = 'An error occurred') => {
  console.error('API Error:', error);
  
  if (error?.response?.status === 401) {
    return 'Session expired. Please login again.';
  }

  if (error?.response?.status === 403) {
    return 'You do not have permission to perform this action.';
  }

  if (error?.response?.status === 404) {
    return 'Resource not found.';
  }

  if (error?.response?.status === 500) {
    return 'Server error. Please try again later.';
  }

  return getErrorMessage(error) || defaultMessage;
};
