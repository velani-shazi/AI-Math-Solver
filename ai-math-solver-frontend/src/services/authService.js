/**
 * Authentication Service
 * 
 * Handles all authentication-related API calls:
 * - User login and signup
 * - Session verification
 * - Password reset and recovery
 * - Email verification
 * - Token management
 * 
 * All functions return standardized response format: { success, data/error, user, token }
 */

import { apiCall, storeToken, clearToken } from './api';

/**
 * Verify if user has an active authenticated session
 * Called on app initialization to restore user session
 * @returns {Promise<Object>} { authenticated: boolean, user: Object|null }
 */
export const checkAuth = async () => {
  const token = localStorage.getItem('jwt_token');
  
  // No token = user not authenticated
  if (!token) {
    return { authenticated: false, user: null };
  }

  try {
    const response = await apiCall('/auth/me', {
      method: 'GET',
    });

    // Token is valid and user data returned
    if (response.ok && response.data.authenticated && response.data.user) {
      return {
        authenticated: true,
        user: response.data.user,
      };
    } else {
      // Token is invalid, clear it
      clearToken();
      return { authenticated: false, user: null };
    }
  } catch (error) {
    console.error('Auth check failed:', error);
    clearToken();
    return { authenticated: false, user: null };
  }
};

/**
 * Authenticate user with email and password
 * @param {string} email - User email address
 * @param {string} password - User password
 * @returns {Promise<Object>} { success, user, token } or { success, error }
 */
export const login = async (email, password) => {
  try {
    const response = await apiCall('/auth/login', {
      method: 'POST',
      body: { email, password },
      includeAuth: false, // Login doesn't need existing auth
    });

    // Login successful - store token and return user
    if (response.ok && response.data.token) {
      storeToken(response.data.token);
      return {
        success: true,
        user: response.data.user,
        token: response.data.token,
      };
    }

    // Login failed - return error message from server
    return {
      success: false,
      error: response.data.message || 'Login failed',
    };
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      error: error.message || 'Login failed',
    };
  }
};

/**
 * Register new user with email and password
 * @param {string} email - User email address
 * @param {string} password - User password (min 8 chars recommended)
 * @param {string} name - User's full name
 * @returns {Promise<Object>} { success, user, token } or { success, error }
 */
export const signup = async (email, password, name) => {
  try {
    const response = await apiCall('/auth/signup', {
      method: 'POST',
      body: { email, password, Name: name },
      includeAuth: false, // Signup doesn't need existing auth
    });

    // Signup successful - store token and return user
    if (response.ok && response.data.token) {
      storeToken(response.data.token);
      return {
        success: true,
        user: response.data.user,
        token: response.data.token,
      };
    }

    // Signup failed - return error from server
    return {
      success: false,
      error: response.data.message || 'Signup failed',
    };
  } catch (error) {
    console.error('Signup error:', error);
    return {
      success: false,
      error: error.message || 'Signup failed',
    };
  }
};

/**
 * Logout user by clearing authentication token
 * @returns {Promise<Object>} { success: true }
 */
export const logout = () => {
  clearToken();
  return { success: true };
};

/**
 * Request password reset email
 * Sends reset link to user's email address
 * @param {string} email - User's email address
 * @returns {Promise<Object>} { success, message }
 */
export const requestPasswordReset = async (email) => {
  try {
    const response = await apiCall('/auth/forgot-password', {
      method: 'POST',
      body: { email },
      includeAuth: false,
    });

    return {
      success: response.ok,
      message: response.data.message || 'Password reset email sent',
    };
  } catch (error) {
    console.error('Password reset request error:', error);
    return {
      success: false,
      message: error.message || 'Failed to request password reset',
    };
  }
};

/**
 * Reset password using token from email
 * Called when user clicks reset link in email
 * @param {string} token - Reset token from email link
 * @param {string} newPassword - New password for user
 * @returns {Promise<Object>} { success, message }
 */
export const resetPassword = async (token, newPassword) => {
  try {
    const response = await apiCall('/auth/reset-password', {
      method: 'POST',
      body: { token, newPassword },
      includeAuth: false,
    });

    return {
      success: response.ok,
      message: response.data.message || 'Password reset successful',
    };
  } catch (error) {
    console.error('Password reset error:', error);
    return {
      success: false,
      message: error.message || 'Failed to reset password',
    };
  }
};

/**
 * Verify user's email address
 * Called when user clicks verification link in email
 * @param {string} token - Verification token from email
 * @returns {Promise<Object>} { success, message }
 */
export const verifyEmail = async (token) => {
  try {
    const response = await apiCall('/auth/verify-email', {
      method: 'POST',
      body: { token },
      includeAuth: false,
    });

    if (response.ok && response.data.token) {
      storeToken(response.data.token);
    }

    return {
      success: response.ok,
      message: response.data.message || 'Email verified',
    };
  } catch (error) {
    console.error('Email verification error:', error);
    return {
      success: false,
      message: error.message || 'Failed to verify email',
    };
  }
};
