// ============================================
// components/SignupForm/SignupForm.js
// ============================================
import { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';
import FormInput from '../FormInput/FormInput';
import AlertMessage from '../AlertMessage/AlertMessage';
import './SignupForm.css';

export default function SignupForm({ onSuccess }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [signupComplete, setSignupComplete] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!email || !password || !firstName || !lastName) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password, firstName, lastName, name: `${firstName} ${lastName}` }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage(data.message);
        setSignupComplete(true);
        // Don't auto-login anymore - user must verify email first
        console.log(data)
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

  if (signupComplete) {
    return (
      <div className="signup-complete-container">
        <div className="complete-icon">
          <CheckCircle size={64} />
        </div>
        <h2 className="complete-title">Account Created!</h2>
        <p className="complete-message">
          A verification email has been sent to <strong>{email}</strong>
        </p>
        <p className="complete-instruction">
          Please check your email and click the verification link to complete your registration. The link expires in 24 hours.
        </p>
        <p className="complete-hint">
          If you don't see the email, check your spam folder.
        </p>
        <button
          onClick={() => window.location.href = '/login'}
          className="complete-button"
        >
          Back to Login
        </button>
      </div>
    );
  }

  return (
    <>
      <AlertMessage error={error} success={successMessage} />
      
      <form onSubmit={handleSubmit} className="login-form">
        <div className="name-inputs-row">
          <FormInput
            label="First Name"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Emily"
            icon={<User size={20} />}
          />

          <FormInput
            label="Last Name"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Johnson"
            icon={<User size={20} />}
          />
        </div>

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

        <FormInput
          label="Confirm Password"
          type={showPassword ? 'text' : 'password'}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="••••••••"
          icon={<Lock size={20} />}
        />

        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>
    </>
  );
}