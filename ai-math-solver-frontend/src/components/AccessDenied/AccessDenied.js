import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import './AccessDenied.css';

export default function AccessDenied() {
  const navigate = useNavigate();

  return (
    <div className="access-denied-container">
      <div className="access-denied-spacer"></div>
      <div className="access-denied-content">
        <div className="access-denied-icon">
          <Lock size={64} />
        </div>
        <h1 className="access-denied-title">Access Denied</h1>
        <p className="access-denied-message">
          You don't have permission to access this page.
        </p>
        <p className="access-denied-submessage">
          Please log in to continue.
        </p>
        <div className="access-denied-buttons">
          <button
            className="access-denied-btn primary"
            onClick={() => navigate('/login')}
          >
            Go to Login
          </button>
          <button
            className="access-denied-btn secondary"
            onClick={() => navigate('/')}
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
