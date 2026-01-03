import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import FormInput from '../FormInput/FormInput';
import AlertMessage from '../AlertMessage/AlertMessage';
import './LoginForm.css';

export default function LoginForm({ onSuccess }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailUnverified, setEmailUnverified] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setEmailUnverified(false);

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage(data.message);
        onSuccess(data.user);
        localStorage.setItem('jwt_token', data.token);
      } else if (response.status === 403 && data.emailUnverified) {
        setEmailUnverified(true);
        setUnverifiedEmail(data.email);
        setError(data.message || 'Please verify your email before logging in.');
      } else {
        setError(data.message || 'Authentication failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    try {
      const response = await fetch('/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: unverifiedEmail || email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage('Verification email sent! Check your inbox.');
        setError('');
      } else {
        setError(data.message || 'Failed to resend verification email.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    }
  };

  return (
    <>
      <AlertMessage error={error} success={successMessage} />
      
      {emailUnverified && (
        <div className="email-unverified-banner">
          <div className="banner-icon">
            <AlertCircle size={20} />
          </div>
          <div className="banner-content">
            <p className="banner-title">Email Not Verified</p>
            <p className="banner-message">
              A verification link has been sent to {unverifiedEmail || email}. Check your email and click the link to verify your account.
            </p>
            <button
              onClick={handleResendVerification}
              className="banner-button"
            >
              Resend Verification Email
            </button>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="login-form">
        <FormInput
          label="Email Address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          icon={<Mail size={20} />}
        />

        <FormInput
          label="Password"
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

        <div className="forgot-password-wrapper">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate('/forgot-password');
            }}
            className="forgot-password-link"
          >
            Forgot Password?
          </a>
        </div>

        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? 'Please wait...' : 'Sign In'}
        </button>
      </form>
    </>
  );
}