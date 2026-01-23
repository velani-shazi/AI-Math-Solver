/**
 * Validation Utilities
 * 
 * Provides reusable validation functions for:
 * - Email format validation
 * - Password strength checking
 * - Form field validation
 * Used throughout the application for input validation
 */

/**
 * Validate email format using regex
 * @param {string} email - Email address to validate
 * @returns {boolean} True if email format is valid
 */
export const validateEmail = (email) => {
  // Basic email regex: something@something.something
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Check password strength against multiple criteria
 * Returns object with validation results for each criterion
 * @param {string} password - Password to validate
 * @returns {Object} { isValid, hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChars }
 */
export const validatePassword = (password) => {
  return {
    isValid: password.length >= 8, // Minimum 8 characters required
    hasUpperCase: /[A-Z]/.test(password), // At least one uppercase letter
    hasLowerCase: /[a-z]/.test(password), // At least one lowercase letter
    hasNumbers: /\d/.test(password), // At least one digit
    hasSpecialChars: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password), // Special characters
  };
};

/**
 * Validate individual form field based on field name
 * Returns error object with field-specific error messages
 * @param {string} name - Field name (email, password, name)
 * @param {string} value - Field value to validate
 * @returns {Object} Errors object with field validation messages
 */
export const validateField = (name, value) => {
  const errors = {};

  switch (name) {
    case 'email':
      // Email validation: required and proper format
      if (!value) {
        errors.email = 'Email is required';
      } else if (!validateEmail(value)) {
        errors.email = 'Please enter a valid email';
      }
      break;

    case 'password':
      // Password validation: required and minimum length
      if (!value) {
        errors.password = 'Password is required';
      } else if (value.length < 8) {
        errors.password = 'Password must be at least 8 characters';
      }
      break;

    case 'name':
      // Name validation: required and minimum length
      if (!value) {
        errors.name = 'Name is required';
      } else if (value.trim().length < 2) {
        errors.name = 'Name must be at least 2 characters';
      }
      break;

    default:
      break;
  }

  return errors;
};
