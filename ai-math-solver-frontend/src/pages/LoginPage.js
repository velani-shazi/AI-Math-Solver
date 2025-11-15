import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm/LoginForm';
import SignupForm from '../components/SignupForm/SignupForm';
import GoogleLoginButton from '../components/GoogleLoginButton/GoogleLoginButton';
import './LoginPage.css';

export default function LoginPage({ onLogin }) {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [forgotPasswordMode, setForgotPasswordMode] = useState(false);

  const handleAuthSuccess = (userData) => {
    if (onLogin && userData) {
      onLogin(userData);
    }
    setTimeout(() => {
      navigate('/');
    }, 1500);
  };

  const handleGoogleLoginSuccess = async (credentialResponse) => {
  try {
    const response = await fetch('/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ID: credentialResponse.credential, 
        Name: credentialResponse.name,
        Email: credentialResponse.email,
        Image_URL: credentialResponse.picture
      })
    });

    if (response.ok) {
      const data = await response.json();
      onLogin(data.user, data.token); 
      navigate('/');
    } else {
      console.error('Login failed');
    }
  } catch (error) {
    console.error('Error during login:', error);
  }
};

const handleGoogleOAuthLogin = () => {
  window.location.href = '/auth/google';
};

  const handleGoogleLogin = () => {
    window.location.href = '/auth/google';
  };

  if (forgotPasswordMode) {
    return (
      <div className="login-container">
        <div className="login-wrapper">
          <div className="login-header">
            <h1 className="login-title">Forgot Password</h1>
            <p className="login-subtitle">Enter your email to reset your password</p>
          </div>
          <div className="login-form-container">
          </div>
        </div>
      </div>
    );
  }

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
            <LoginForm
              onSuccess={handleAuthSuccess}
              onForgotPassword={() => setForgotPasswordMode(true)}
            />
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