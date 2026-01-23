/**
 * Reset Password Page
 * 
 * Completes password reset flow:
 * - User receives link from email (contains token in URL)
 * - User enters new password twice
 * - Backend validates token and updates password
 * - User redirected to login on success
 * 
 * States:
 * - 'form': Show password input form
 * - 'loading': Processing password reset
 * - 'success': Reset completed
 * - 'error': Reset failed
 */

import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';
import FormInput from '../components/FormInput/FormInput';
import AlertMessage from '../components/AlertMessage/AlertMessage';
import './ResetPasswordPage.css';

/**
 * ResetPasswordPage Component
 * Handles new password submission
 */
export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // New password entered by user
  const [password, setPassword] = useState('');
  // Password confirmation
  const [confirmPassword, setConfirmPassword] = useState('');
  // Show/hide password toggle
  const [showPassword, setShowPassword] = useState(false);
  // Current UI state
  const [status, setStatus] = useState('form'); // form, loading, success, error
  // Success message
  const [message, setMessage] = useState('');
  // Error message
  const [error, setError] = useState('');
  // Extract reset token from URL query parameter
  const token = searchParams.get('token');

  /**
   * Validate token on page load
   * If no token provided, show error
   */
  useEffect(() => {
    if (!token) {
      setStatus('error');
      setError('No reset token found. Please check your email link.');
    }
  }, [token]);

  /**
   * Handle password reset form submission
   * Validates passwords match and meet requirements
   * Sends to backend for processing
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    // Validate both passwords entered
    if (!password || !confirmPassword) {
      setError('Please fill in all password fields');
      return;
    }

    // Check passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Check minimum length
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    // Show loading state
    setStatus('loading');

    try {
      // Send password reset request to backend
      const response = await fetch('/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Password reset successful
        setStatus('success');
        setMessage(data.message);
        // Auto-redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        // Reset failed - token may be expired
        setStatus('error');
        setError(data.message || 'Password reset failed. Token may have expired.');
      }
    } catch (err) {
      // Network or server error
      setStatus('error');
      setError('An error occurred. Please try again.');
      console.error(err);
    }
  };

  return (
    <>
      {/* Spacer to match page layout */}
      <div style={{ height: '100px', backgroundColor: '#f6f4f4' }}></div>
      <div className="reset-password-container">
        <div className="reset-password-wrapper">
          {/* Form state - show password input */}
          {status === 'form' && (
            <>
              <div className="reset-password-header">
                <div className="reset-password-icon">
                  <Lock size={48} />
                </div>
                <h1 className="reset-password-title">Reset Password</h1>
                <p className="reset-password-subtitle">
                  Enter your new password below to reset your account.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="reset-password-form">
                {/* Display any error or success messages */}
                <AlertMessage error={error} success={message} />

                {/* New password input with show/hide toggle */}
                <FormInput
                  label="New Password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  icon={<Lock size={20} />}
                  rightButton={{
                    onClick: () => setShowPassword(!showPassword),
                    icon: showPassword ? <EyeOff size={20} /> : <Eye size={20} />
                  }}
                />

                {/* Confirm password input */}
                <FormInput
                  label="Confirm Password"
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  icon={<Lock size={20} />}
                />

                {/* Show password requirements checklist */}
                <div className="password-requirements">
                  <p className="requirement-title">Password must contain:</p>
                  <ul className="requirement-list">
                    <li className={password.length >= 6 ? 'met' : ''}>
                      At least 6 characters
                    </li>
                    <li className={password === confirmPassword && password ? 'met' : ''}>
                      Passwords match
                    </li>
                  </ul>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="submit-button"
                  disabled={!password || !confirmPassword}
                >
                  Reset Password
                </button>

                {/* Back to login link */}
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="back-to-login-button"
                >
                  Back to Login
                </button>
              </form>
            </>
          )}

          {/* Loading state - show spinner */}
          {status === 'loading' && (
            <div className="reset-password-status">
              <div className="loading-spinner"></div>
              <p>Resetting your password...</p>
            </div>
          )}

          {/* Success state - password reset complete */}
          {status === 'success' && (
            <div className="reset-password-status success">
              <div className="status-icon success-icon">
                <CheckCircle size={64} />
              </div>
              <h2 className="status-title">Password Reset Successful!</h2>
              <p className="status-message">
                {message || 'Your password has been successfully reset.'}
              </p>
              <p className="status-hint">Redirecting to login page...</p>
              <button
                onClick={() => navigate('/login')}
                className="submit-button"
              >
                Go to Login
              </button>
            </div>
          )}

          {/* Error state - reset failed */}
          {status === 'error' && (
            <div className="reset-password-status error">
              <div className="status-icon error-icon">
                <AlertCircle size={64} />
              </div>
              <h2 className="status-title">Reset Failed</h2>
              <p className="status-message">{error}</p>
              <button
                onClick={() => navigate('/login')}
                className="submit-button"
              >
                Back to Login
              </button>
              <button
                onClick={() => navigate('/forgot-password')}
                className="back-to-login-button"
              >
                Request New Link
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
