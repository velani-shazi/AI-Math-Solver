/**
 * Custom Hook: useForm
 * 
 * Manages form state and submission logic
 * Provides form values, validation errors, and submission handling
 * 
 * Features:
 * - Track form field values and changes
 * - Track touched fields (for showing validation on blur)
 * - Handle form submission with loading state
 * - Reset form to initial values
 * - Set field values and errors programmatically
 * 
 * @param {Object} initialValues - Initial form field values
 * @param {Function} onSubmit - Callback function when form is submitted
 * @returns {Object} Form state and handlers
 */

import { useState, useCallback } from 'react';

export function useForm(initialValues, onSubmit) {
  // Form field values
  const [values, setValues] = useState(initialValues);
  // Validation errors for each field
  const [errors, setErrors] = useState({});
  // Track which fields have been touched by user
  const [touched, setTouched] = useState({});
  // Loading state during form submission
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Handle input field change
   * Updates field value in state, handles checkboxes and text inputs
   */
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }, []);

  /**
   * Handle input field blur
   * Marks field as touched for showing validation errors
   */
  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
  }, []);

  /**
   * Reset form to initial state
   * Clears values, errors, and touched fields
   */
  const handleReset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  /**
   * Handle form submission
   * Prevents default, shows loading state, calls onSubmit callback
   */
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setIsSubmitting(true);

      try {
        // Call parent component's submit handler
        await onSubmit(values);
      } catch (err) {
        console.error('Form submission error:', err);
      } finally {
        // Clear loading state regardless of success/failure
        setIsSubmitting(false);
      }
    },
    [values, onSubmit]
  );

  /**
   * Programmatically set a field's value
   * Useful for dynamic field updates
   */
  const setFieldValue = useCallback((name, value) => {
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  /**
   * Programmatically set a field's error message
   * Used by validation logic
   */
  const setFieldError = useCallback((name, error) => {
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  }, []);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    handleReset,
    setFieldValue,
    setFieldError,
  };
}
