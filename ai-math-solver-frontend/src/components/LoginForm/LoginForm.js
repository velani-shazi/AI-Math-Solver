import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import FormInput from '../FormInput/FormInput';
import AlertMessage from '../AlertMessage/AlertMessage';
import './LoginForm.css';

export default function LoginForm({ onSuccess, onForgotPassword }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

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

  return (
    <>
      <AlertMessage error={error} success={successMessage} />
      
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
              onForgotPassword();
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