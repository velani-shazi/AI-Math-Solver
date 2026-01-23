/**
 * Email Verification Page
 * 
 * Handles email verification flow:
 * - Receives verification token from email link (URL param: ?token=...)
 * - Validates token with backend
 * - Shows loading, success, or error states
 * - Redirects to login on success
 * 
 * User journey:
 * 1. User receives email with verification link
 * 2. Link contains token as query parameter
 * 3. Page loads and automatically verifies token
 * 4. Shows success/error message
 * 5. Auto-redirects to login on success
 */

import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, AlertCircle, Loader } from 'lucide-react';
import './VerifyEmailPage.css';

/**
 * VerifyEmailPage Component
 * Automatically verifies email token when page loads
 */
export default function VerifyEmailPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Verification status: 'loading', 'success', 'error'
  const [status, setStatus] = useState('loading');
  // Message to display to user
  const [message, setMessage] = useState('');
  // Extract verification token from URL query parameter
  const token = searchParams.get('token');

  /**
   * Verify email token on component mount
   * Makes API call to backend to validate token
   */
  useEffect(() => {
    const verifyEmail = async () => {
      // No token provided - can't proceed
      if (!token) {
        setStatus('error');
        setMessage('No verification token found. Please check your email link.');
        return;
      }

      try {
        // Send token to backend for verification
        const response = await fetch('/auth/verify-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (response.ok) {
          // Verification successful
          setStatus('success');
          setMessage(data.message);
          // Auto-redirect to login after 3 seconds
          setTimeout(() => {
            navigate('/login');
          }, 3000);
        } else {
          // Verification failed - token may be expired
          setStatus('error');
          setMessage(data.message || 'Email verification failed. Token may have expired.');
        }
      } catch (err) {
        // Network or server error
        setStatus('error');
        setMessage('An error occurred during verification. Please try again.');
        console.error(err);
      }
    };

    verifyEmail();
  }, [token, navigate]);

  return (
    <div className="verify-email-container">
      <div className="verify-email-spacer"></div>
      <div className="verify-email-wrapper">
        <div className="verify-email-content">
          {/* Loading state - show spinner while verifying */}
          {status === 'loading' && (
            <>
              <div className="verify-icon loading-icon">
                <Loader size={64} className="spinner" />
              </div>
              <h1 className="verify-title">Verifying Your Email</h1>
              <p className="verify-description">Please wait while we verify your email address...</p>
            </>
          )}

          {/* Success state - verification complete */}
          {status === 'success' && (
            <>
              <div className="verify-icon success-icon">
                <CheckCircle size={64} />
              </div>
              <h1 className="verify-title">Email Verified!</h1>
              <p className="verify-description">
                Your email has been successfully verified. Redirecting to login...
              </p>
              <div className="verify-status success-status">
                <p>{message}</p>
              </div>
            </>
          )}

          {/* Error state - verification failed */}
          {status === 'error' && (
            <>
              <div className="verify-icon error-icon">
                <AlertCircle size={64} />
              </div>
              <h1 className="verify-title">Verification Failed</h1>
              <p className="verify-description">{message}</p>
              {/* Action buttons */}
              <div className="verify-actions">
                <button
                  onClick={() => navigate('/login')}
                  className="verify-button primary"
                >
                  Back to Login
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="verify-button secondary"
                >
                  Request New Link
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
