/**
 * Authentication Context Provider
 * 
 * Manages global authentication state and provides auth methods to entire app
 * Wraps entire app to provide access to useAuth() hook
 * 
 * Responsibilities:
 * - Initialize user session on app start
 * - Store user information and JWT token
 * - Provide login/logout methods
 * - Handle session expiration
 * - Track authentication loading state
 */

import React, { createContext, useState, useEffect, useCallback } from 'react';
import { checkAuth, logout as authServiceLogout } from '../services/authService';

export const AuthContext = createContext(null);

/**
 * AuthProvider Component
 * Wraps application and provides authentication context to all children
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - Child components
 */
export function AuthProvider({ children }) {
  // Current authenticated user object (null if not authenticated)
  const [user, setUser] = useState(null);
  // Loading state during initial auth check
  const [loading, setLoading] = useState(true);
  // Error message from auth operations
  const [error, setError] = useState(null);

  /**
   * Initialize authentication on app start
   * Checks if user has valid session stored in localStorage
   */
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Check if user has valid auth token
        const result = await checkAuth();
        
        // Restore user session if token is valid
        if (result.authenticated && result.user) {
          setUser(result.user);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        setError(err.message);
        setUser(null);
      } finally {
        // Mark initialization complete - app can now render
        setLoading(false);
      }
    };

    initAuth();

    /**
     * Listen for session expiration events
     * Triggered when 401 response received from API
     */
    const handleAuthExpired = () => {
      setUser(null);
      setError('Session expired. Please login again.');
    };

    window.addEventListener('auth-expired', handleAuthExpired);

    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener('auth-expired', handleAuthExpired);
    };
  }, []);

  /**
   * Update auth state after successful login
   * @param {Object} userData - User object returned from login
   * @param {string} token - JWT token from server
   */
  const login = useCallback((userData, token) => {
    // Store token for API requests
    localStorage.setItem('jwt_token', token);
    // Update user state
    setUser(userData);
    // Clear any previous errors
    setError(null);
  }, []);

  /**
   * Clear user session and logout
   * Removes token and clears user state
   */
  const logout = useCallback(() => {
    // Call service to clear token
    authServiceLogout();
    // Clear user state
    setUser(null);
    // Clear error messages
    setError(null);
  }, []);

  /**
   * Clear error message
   * Called after user acknowledges error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Context value provided to all children
  const value = {
    user, // Current user object
    loading, // Auth initialization loading state
    error, // Error messages from auth operations
    isAuthenticated: !!user, // Boolean convenience property
    login, // Method to update auth state after login
    logout, // Method to logout user
    clearError, // Method to dismiss error messages
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
