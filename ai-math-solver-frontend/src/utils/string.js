/**
 * String Utilities
 * Helper functions for common string manipulation tasks
 * Used throughout the application for formatting and transforming text
 */

/**
 * Capitalize the first letter of a string
 * @param {string} str - String to capitalize
 * @returns {string} String with first letter capitalized
 * @example capitalize('hello') -> 'Hello'
 */
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Truncate a string to specified length and append ending
 * Useful for displaying long text in constrained UI space
 * @param {string} str - String to truncate
 * @param {number} [length=100] - Maximum length before truncation
 * @param {string} [ending='...'] - Text to append when truncated
 * @returns {string} Truncated string
 * @example truncate('hello world is great', 10) -> 'hello w...'
 */
export const truncate = (str, length = 100, ending = '...') => {
  if (!str) return '';
  if (str.length > length) {
    return str.substring(0, length - ending.length) + ending;
  }
  return str;
};

/**
 * Format LaTeX expression for display
 * Removes escaped characters to normalize LaTeX for display
 * @param {string} latex - LaTeX expression to format
 * @returns {string} Formatted LaTeX
 */
export const formatLatex = (latex) => {
  if (!latex) return '';
  // Remove double backslashes and format for display
  return latex.replace(/\\\\/g, '\\');
};

/**
 * Extract first name from full name string
 * Splits by space and returns first part
 * @param {string} fullName - Full name (e.g., "John Doe")
 * @returns {string} First name
 * @example getFirstName('John Doe') -> 'John'
 */
export const getFirstName = (fullName) => {
  if (!fullName) return '';
  return fullName.split(' ')[0];
};

/**
 * Extract last name from full name string
 * If only one name provided, returns empty string
 * @param {string} fullName - Full name (e.g., "John Doe")
 * @returns {string} Last name (or part after first name)
 * @example getLastName('John Doe Smith') -> 'Doe Smith'
 */
export const getLastName = (fullName) => {
  if (!fullName) return '';
  const parts = fullName.split(' ');
  return parts.length > 1 ? parts.slice(1).join(' ') : '';
};

/**
 * Debounce function execution
 * Delays function call until specified time has passed without new calls
 * Useful for reducing API calls on input changes or window resize
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 * @example const debouncedSearch = debounce(searchAPI, 300)
 */
export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    // Clear previous timeout
    clearTimeout(timeoutId);
    // Set new timeout - only executes if no new calls within delay
    timeoutId = setTimeout(() => func(...args), delay);
  };
};
