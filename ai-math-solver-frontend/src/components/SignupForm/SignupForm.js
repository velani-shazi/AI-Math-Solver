// ============================================
// components/SignupForm/SignupForm.js
// ============================================
import { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import FormInput from '../FormInput/FormInput';
import AlertMessage from '../AlertMessage/AlertMessage';
import './SignupForm.css';

export default function SignupForm({ onSuccess }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!email || !password || !name) {
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
        body: JSON.stringify({ email, password, name }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage(data.message);
        onSuccess(data.user);
        localStorage.setItem('jwt_token', data.token);
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

  return (
    <>
      <AlertMessage error={error} success={successMessage} />
      
      <form onSubmit={handleSubmit} className="login-form">
        <FormInput
          label="Full Name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your Name"
          icon={<User size={20} />}
        />

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
          {loading ? 'Please wait...' : 'Create Account'}
        </button>
      </form>
    </>
  );
}