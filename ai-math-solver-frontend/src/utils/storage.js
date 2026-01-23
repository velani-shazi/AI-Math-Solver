/**
 * Storage Utilities
 * 
 * Provides safe wrapper functions for browser storage APIs:
 * - localStorage: Persistent storage (survives browser close)
 * - sessionStorage: Temporary storage (clears when browser closes)
 * 
 * Features:
 * - Automatic JSON serialization/deserialization
 * - Error handling and logging
 * - Default value support
 */

/**
 * Retrieve item from localStorage with error handling
 * Automatically parses JSON data
 * @param {string} key - Storage key
 * @param {*} [defaultValue=null] - Default value if key not found or error occurs
 * @returns {*} Parsed value or defaultValue
 */
export const getFromLocalStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    // Log error but return default - prevents app from crashing
    console.error(`Error reading from localStorage (${key}):`, error);
    return defaultValue;
  }
};

/**
 * Save item to localStorage with error handling
 * Automatically serializes data to JSON
 * @param {string} key - Storage key
 * @param {*} value - Value to store (auto-converted to JSON)
 */
export const setInLocalStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    // Log error but don't throw - prevents app from crashing
    console.error(`Error writing to localStorage (${key}):`, error);
  }
};

/**
 * Remove item from localStorage
 * @param {string} key - Storage key to remove
 */
export const removeFromLocalStorage = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing from localStorage (${key}):`, error);
  }
};

/**
 * Clear all data from localStorage
 * Use with caution - affects all stored data
 */
export const clearLocalStorage = () => {
  try {
    localStorage.clear();
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
};

/**
 * Get item from sessionStorage
 */
export const getFromSessionStorage = (key, defaultValue = null) => {
  try {
    const item = sessionStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading from sessionStorage (${key}):`, error);
    return defaultValue;
  }
};

/**
 * Set item in sessionStorage
 */
export const setInSessionStorage = (key, value) => {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing to sessionStorage (${key}):`, error);
  }
};

/**
 * Remove item from sessionStorage
 */
export const removeFromSessionStorage = (key) => {
  try {
    sessionStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing from sessionStorage (${key}):`, error);
  }
};
