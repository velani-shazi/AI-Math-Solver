/**
 * Login/Signup Page
 * 
 * Dual-purpose authentication page:
 * - Toggle between login and signup forms
 * - Supports email/password authentication
 * - Supports Google OAuth authentication
 * - Routes user to home after successful auth
 * 
 * Users can:
 * - Login with existing credentials
 * - Create new account
 * - Login with Google
 * - Reset password from login form
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm/LoginForm';
import SignupForm from '../components/SignupForm/SignupForm';
import GoogleLoginButton from '../components/GoogleLoginButton/GoogleLoginButton';
import { useAuth } from '../hooks/useAuth';
import './LoginPage.css';

/**
 * LoginPage Component
 * Manages authentication form display and submission
 */
export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  // Track whether to show login or signup form
  const [isLogin, setIsLogin] = useState(true);

  /**
   * Handle successful authentication
   * Updates auth context and redirects to home
   * @param {Object} userData - User object from server
   * @param {string} token - JWT authentication token
   */
  const handleAuthSuccess = (userData, token) => {
    if (userData && token) {
      // Update global auth state with user data and token
      login(userData, token);
    }
    // Redirect after brief delay to show success message
    setTimeout(() => {
      navigate('/');
    }, 1500);
  };

  /**
   * Initiate Google OAuth flow
   * Redirects to backend Google auth endpoint
   */
  const handleGoogleLogin = () => {
    window.location.href = '/auth/google';
  };

  return (
    <div className="login-container">
      <div className="login-wrapper">
        <div className="login-header">
          <h1 className="login-title">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="login-subtitle">
            {isLogin ? 'Sign in to your account' : 'Join us today'}
          </p>
        </div>

        <div className="login-form-container">
          {/* Toggle between login and signup forms */}
          {isLogin ? (
            <LoginForm onSuccess={handleAuthSuccess} />
          ) : (
            <SignupForm onSuccess={handleAuthSuccess} />
          )}

          {/* Divider between email/password and social login */}
          <div className="divider">
            <div className="divider-line"></div>
            <span className="divider-text">OR</span>
            <div className="divider-line"></div>
          </div>

          {/* Google OAuth button */}
          <GoogleLoginButton onClick={handleGoogleLogin} />

          {/* Toggle between login and signup */}
          <div className="toggle-auth-wrapper">
            <p className="toggle-auth-text">
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="toggle-auth-button"
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}