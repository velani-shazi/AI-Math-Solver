/**
 * Forgot Password Page
 * 
 * Password recovery flow:
 * - User enters email address
 * - Backend sends password reset email
 * - Shows confirmation with instructions
 * - User clicks link in email to reset password
 * 
 * States:
 * - 'form': Show email input form
 * - 'loading': Processing request
 * - 'sent': Confirmation message shown
 * - 'error': Error occurred
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { Mail } from 'lucide-react';
import FormInput from '../components/FormInput/FormInput';
import AlertMessage from '../components/AlertMessage/AlertMessage';
import './ForgotPasswordPage.css';

/**
 * ForgotPasswordPage Component
 * Handles password reset request submission
 */
export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  // Email address entered by user
  const [email, setEmail] = useState('');
  // Current UI state
  const [status, setStatus] = useState('form'); // form, loading, sent, error
  // Success message from server
  const [message, setMessage] = useState('');
  // Error message to display
  const [error, setError] = useState('');

  /**
   * Set page title for browser tab
   */
  useEffect(() => {
    document.title = 'Forgot Password - AI Math Solver';
  }, []);

  /**
   * Handle form submission
   * Sends email to backend to trigger password reset email
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    // Validate email entered
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    // Show loading state
    setStatus('loading');

    try {
      // Send password reset request to backend
      const response = await fetch('/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        // Request successful - show confirmation
        setStatus('sent');
        setMessage(data.message);
      } else {
        // Request failed
        setStatus('error');
        setError(data.message || 'Failed to send reset email');
      }
    } catch (err) {
      // Network or server error
      setStatus('error');
      setError('An error occurred. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-wrapper">
        {/* Form state - show email input */}
        {status === 'form' && (
          <>
            <div className="forgot-password-header">
              <h1 className="forgot-password-title">Forgot Password</h1>
              <p className="forgot-password-subtitle">
                Enter your email address and we'll send you a link to reset your password.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="forgot-password-form">
              {/* Display any error or success messages */}
              <AlertMessage error={error} success={message} />

              {/* Email input field */}
              <FormInput
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                icon={<Mail size={20} />}
              />

              {/* Submit button */}
              <button type="submit" className="submit-button">
                Send Reset Link
              </button>

              {/* Link back to login */}
              <div className="back-to-login-wrapper">
                <span className="back-to-login-text">Back to </span>
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="back-to-login-link"
                >
                  Login
                </button>
              </div>
            </form>
          </>
        )}
        
        {/* Loading state - show spinner */}
        {status === 'loading' && (
          <div className="forgot-password-status">
            <div className="loading-spinner"></div>
            <p>Sending reset link...</p>
          </div>
        )}

        {/* Sent state - show success message */}
        {status === 'sent' && (
          <div className="forgot-password-status success">
            <div className="status-icon success-icon">
              <CheckCircle size={64} />
            </div>
            <h2 className="status-title">Check Your Email</h2>
            <p className="status-message">
              {message || 'If an account exists with this email, you will receive a password reset link.'}
            </p>
            <p className="status-hint">
              The link will expire in 1 hour. Please check your spam folder if you don't see it.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="submit-button"
            >
              Back to Login
            </button>
          </div>
        )}

        {/* Error state - show error message */}
        {status === 'error' && (
          <div className="forgot-password-status error">
            <div className="status-icon error-icon">
              <AlertCircle size={64} />
            </div>
            <h2 className="status-title">Something Went Wrong</h2>
            <p className="status-message">{error}</p>
            <button
              onClick={() => {
                setStatus('form');
                setEmail('');
                setError('');
              }}
              className="submit-button"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
