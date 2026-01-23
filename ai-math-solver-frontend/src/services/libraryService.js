/**
 * Library Service (Bookmarks)
 * Handles bookmarks and saved problems
 */

import { apiCall } from './api';

/**
 * Get all bookmarks
 */
export const getBookmarks = async () => {
  try {
    const response = await apiCall('/library', {
      method: 'GET',
    });

    if (response.ok) {
      return {
        success: true,
        bookmarks: response.data.bookmarks || response.data,
      };
    }

    return {
      success: false,
      error: 'Failed to fetch bookmarks',
      bookmarks: [],
    };
  } catch (error) {
    console.error('Get bookmarks error:', error);
    return {
      success: false,
      error: error.message || 'Failed to fetch bookmarks',
      bookmarks: [],
    };
  }
};

/**
 * Add a bookmark
 */
export const addBookmark = async (latex, solution, title = '') => {
  try {
    const response = await apiCall('/library', {
      method: 'POST',
      body: {
        latex,
        solution,
        title: title || latex,
      },
    });

    if (response.ok) {
      return {
        success: true,
        bookmark: response.data.bookmark || response.data,
        message: 'Bookmark added successfully',
      };
    }

    return {
      success: false,
      error: response.data.message || 'Failed to add bookmark',
    };
  } catch (error) {
    console.error('Add bookmark error:', error);
    return {
      success: false,
      error: error.message || 'Failed to add bookmark',
    };
  }
};

/**
 * Remove a bookmark
 */
export const removeBookmark = async (bookmarkId) => {
  try {
    const response = await apiCall(`/library/${bookmarkId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      return {
        success: true,
        message: 'Bookmark removed successfully',
      };
    }

    return {
      success: false,
      error: response.data.message || 'Failed to remove bookmark',
    };
  } catch (error) {
    console.error('Remove bookmark error:', error);
    return {
      success: false,
      error: error.message || 'Failed to remove bookmark',
    };
  }
};

/**
 * Update bookmark title/notes
 */
export const updateBookmark = async (bookmarkId, updates) => {
  try {
    const response = await apiCall(`/library/${bookmarkId}`, {
      method: 'PUT',
      body: updates,
    });

    if (response.ok) {
      return {
        success: true,
        bookmark: response.data.bookmark || response.data,
        message: 'Bookmark updated successfully',
      };
    }

    return {
      success: false,
      error: response.data.message || 'Failed to update bookmark',
    };
  } catch (error) {
    console.error('Update bookmark error:', error);
    return {
      success: false,
      error: error.message || 'Failed to update bookmark',
    };
  }
};
