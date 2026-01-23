/**
 * User Service
 * Handles user profile, preferences, and related API calls
 */

import { apiCall } from './api';

/**
 * Update user profile
 */
export const updateUserProfile = async (userData) => {
  try {
    const response = await apiCall('/users/profile', {
      method: 'PUT',
      body: userData,
    });

    if (response.ok) {
      return {
        success: true,
        user: response.data.user,
        message: 'Profile updated successfully',
      };
    }

    return {
      success: false,
      error: response.data.message || 'Failed to update profile',
    };
  } catch (error) {
    console.error('Profile update error:', error);
    return {
      success: false,
      error: error.message || 'Failed to update profile',
    };
  }
};

/**
 * Delete user account
 */
export const deleteUserAccount = async () => {
  try {
    const response = await apiCall('/users/profile', {
      method: 'DELETE',
    });

    return {
      success: response.ok,
      message: response.data.message || 'Account deleted',
    };
  } catch (error) {
    console.error('Account deletion error:', error);
    return {
      success: false,
      error: error.message || 'Failed to delete account',
    };
  }
};

/**
 * Clear user history
 */
export const clearUserHistory = async () => {
  try {
    const response = await apiCall('/users/history', {
      method: 'DELETE',
    });

    return {
      success: response.ok,
      message: 'History cleared successfully',
    };
  } catch (error) {
    console.error('Clear history error:', error);
    return {
      success: false,
      error: error.message || 'Failed to clear history',
    };
  }
};

/**
 * Clear user bookmarks/library
 */
export const clearUserLibrary = async () => {
  try {
    const response = await apiCall('/users/library', {
      method: 'DELETE',
    });

    return {
      success: response.ok,
      message: 'Bookmarks cleared successfully',
    };
  } catch (error) {
    console.error('Clear library error:', error);
    return {
      success: false,
      error: error.message || 'Failed to clear bookmarks',
    };
  }
};

/**
 * Get user activity
 */
export const getUserActivity = async () => {
  try {
    const response = await apiCall('/activity', {
      method: 'GET',
    });

    if (response.ok) {
      return {
        success: true,
        activity: response.data,
      };
    }

    return {
      success: false,
      error: 'Failed to fetch activity',
    };
  } catch (error) {
    console.error('Get activity error:', error);
    return {
      success: false,
      error: error.message || 'Failed to fetch activity',
    };
  }
};
