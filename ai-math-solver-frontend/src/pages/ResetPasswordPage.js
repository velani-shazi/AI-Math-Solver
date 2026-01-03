import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';
import FormInput from '../components/FormInput/FormInput';
import AlertMessage from '../components/AlertMessage/AlertMessage';
import './ResetPasswordPage.css';

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState('form'); // form, loading, success, error
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setError('No reset token found. Please check your email link.');
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!password || !confirmPassword) {
      setError('Please fill in all password fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setStatus('loading');

    try {
      const response = await fetch('/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: password }),
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
        setError(data.message || 'Password reset failed. Token may have expired.');
      }
    } catch (err) {
      setStatus('error');
      setError('An error occurred. Please try again.');
      console.error(err);
    }
  };

  return (
    <>
      <div style={{ height: '100px', backgroundColor: '#f6f4f4' }}></div>
      <div className="reset-password-container">
        <div className="reset-password-wrapper">
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
              <AlertMessage error={error} success={message} />

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

              <FormInput
                label="Confirm Password"
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                icon={<Lock size={20} />}
              />

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

              <button
                type="submit"
                className="submit-button"
                disabled={!password || !confirmPassword}
              >
                Reset Password
              </button>

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

          {status === 'loading' && (
            <div className="reset-password-status">
              <div className="loading-spinner"></div>
              <p>Resetting your password...</p>
            </div>
          )}

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
