/**
 * API Base Configuration and Request Handler
 * 
 * This module provides centralized API communication with the backend.
 * It handles:
 * - Authentication headers with JWT tokens
 * - Generic HTTP request logic
 * - Automatic error handling and token refresh on 401 responses
 * - Token storage and retrieval
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || '';

/**
 * Get authorization headers with JWT token
 * @returns {Object} Headers object with Authorization header if token exists
 */
export const getAuthHeaders = () => {
  const token = localStorage.getItem('jwt_token');
  const headers = {
    'Content-Type': 'application/json',
  };
  
  // Include Bearer token if user is authenticated
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

/**
 * Store JWT token in localStorage
 * @param {string} token - JWT token from server
 */
export const storeToken = (token) => {
  localStorage.setItem('jwt_token', token);
};

/**
 * Generic API request handler with automatic error handling
 * @param {string} endpoint - API endpoint (e.g., '/api/auth/login')
 * @param {Object} options - Request options
 * @param {string} [options.method='GET'] - HTTP method
 * @param {Object} [options.body=null] - Request body (auto-JSON stringified)
 * @param {Object} [options.headers={}] - Additional headers to merge
 * @param {boolean} [options.includeAuth=true] - Include auth headers
 * @returns {Promise<Object>} Response data from server
 */
export const apiCall = async (endpoint, options = {}) => {
  const {
    method = 'GET',
    body = null,
    headers = {},
    includeAuth = true,
    ...restOptions
  } = options;

  const url = `${API_BASE_URL}${endpoint}`;
  
  // Merge auth headers with custom headers
  const requestOptions = {
    method,
    headers: {
      ...getAuthHeaders(),
      ...headers,
    },
    ...restOptions,
  };

  // Auto-stringify body if provided
  if (body) {
    requestOptions.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, requestOptions);
    
    // Handle 401 Unauthorized - clear token and notify listeners
    if (response.status === 401 && includeAuth) {
      localStorage.removeItem('jwt_token');
      // Dispatch custom event for auth-expired to notify context/components
      window.dispatchEvent(new CustomEvent('auth-expired'));
    }

    const data = await response.json();
    
    // Return standardized response format
    return {
      ok: response.ok,
      status: response.status,
      data,
    };
  } catch (error) {
    // Log network errors for debugging
    console.error('API Error:', error);
    throw error;
  }
};
/**
 * Check if token is expired
 */
export const isTokenExpired = () => {
  const token = localStorage.getItem('jwt_token');
  return !token;
};

/**
 * Clear JWT token
 */
export const clearToken = () => {
  localStorage.removeItem('jwt_token');
};
