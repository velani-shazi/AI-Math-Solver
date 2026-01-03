import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, AlertCircle, Loader } from 'lucide-react';
import './VerifyEmailPage.css';

export default function VerifyEmailPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('loading'); // loading, success, error
  const [message, setMessage] = useState('');
  const token = searchParams.get('token');

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus('error');
        setMessage('No verification token found. Please check your email link.');
        return;
      }

      try {
        const response = await fetch('/auth/verify-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (response.ok) {
          setStatus('success');
          setMessage(data.message);
          setTimeout(() => {
            navigate('/login');
          }, 3000);
        } else {
          setStatus('error');
          setMessage(data.message || 'Email verification failed. Token may have expired.');
        }
      } catch (err) {
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
          {status === 'loading' && (
            <>
              <div className="verify-icon loading-icon">
                <Loader size={64} className="spinner" />
              </div>
              <h1 className="verify-title">Verifying Your Email</h1>
              <p className="verify-description">Please wait while we verify your email address...</p>
            </>
          )}

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

          {status === 'error' && (
            <>
              <div className="verify-icon error-icon">
                <AlertCircle size={64} />
              </div>
              <h1 className="verify-title">Verification Failed</h1>
              <p className="verify-description">{message}</p>
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
