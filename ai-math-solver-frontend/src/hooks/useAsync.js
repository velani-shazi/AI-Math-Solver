/**
 * Custom Hook: useAsync
 * 
 * Manages async operations state (loading, success, error)
 * Useful for handling API calls and other async operations
 * 
 * Features:
 * - Automatic state management (pending, success, error)
 * - Optional immediate execution on mount
 * - Supports passing arguments to async function
 * - Tracks operation status and results
 * 
 * @param {Function} asyncFunction - Async function to execute
 * @param {boolean} [immediate=true] - Execute immediately on mount
 * @returns {Object} { execute, status, data, error }
 * 
 * @example
 * const { execute, status, data } = useAsync(fetchData, false);
 * // Call execute() manually when needed
 */

import { useState, useCallback } from 'react';

export function useAsync(asyncFunction, immediate = true) {
  // Current status of async operation: 'idle' | 'pending' | 'success' | 'error'
  const [status, setStatus] = useState('idle');
  // Result data from successful async operation
  const [data, setData] = useState(null);
  // Error thrown by async operation
  const [error, setError] = useState(null);

  /**
   * Execute the async function with provided arguments
   * Updates status and data/error accordingly
   */
  const execute = useCallback(
    async (...args) => {
      // Reset state for new operation
      setStatus('pending');
      setData(null);
      setError(null);

      try {
        // Execute async function with any passed arguments
        const result = await asyncFunction(...args);
        setData(result);
        setStatus('success');
        return result;
      } catch (err) {
        // Store error and mark as failed
        setError(err);
        setStatus('error');
        throw err;
      }
    },
    [asyncFunction]
  );

  // Execute immediately on mount if requested
  React.useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return { execute, status, data, error };
}

import React from 'react';
