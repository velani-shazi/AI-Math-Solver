import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm/LoginForm';
import SignupForm from '../components/SignupForm/SignupForm';
import GoogleLoginButton from '../components/GoogleLoginButton/GoogleLoginButton';
import './LoginPage.css';

export default function LoginPage({ onLogin }) {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);

  const handleAuthSuccess = (userData) => {
    if (onLogin && userData) {
      onLogin(userData);
    }
    setTimeout(() => {
      navigate('/');
    }, 1500);
  };

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
          {isLogin ? (
            <LoginForm onSuccess={handleAuthSuccess} />
          ) : (
            <SignupForm onSuccess={handleAuthSuccess} />
          )}

          <div className="divider">
            <div className="divider-line"></div>
            <span className="divider-text">OR</span>
            <div className="divider-line"></div>
          </div>

          <GoogleLoginButton onClick={handleGoogleLogin} />

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