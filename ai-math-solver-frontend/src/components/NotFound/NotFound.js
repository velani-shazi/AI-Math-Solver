import { useNavigate } from 'react-router-dom';
import './NotFound.css';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <div className="not-found-spacer"></div>
        <div className="not-found-robot">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            {/* Robot Head */}
            <rect x="40" y="30" width="120" height="100" rx="10" fill="none" stroke="#db3f59" strokeWidth="3"/>
            
            {/* Robot Eyes */}
            <circle cx="70" cy="60" r="12" fill="none" stroke="#db3f59" strokeWidth="3"/>
            <circle cx="130" cy="60" r="12" fill="none" stroke="#db3f59" strokeWidth="3"/>
            <circle cx="70" cy="60" r="6" fill="#db3f59"/>
            <circle cx="130" cy="60" r="6" fill="#db3f59"/>
            
            {/* Robot Mouth */}
            <path d="M 70 95 Q 100 110 130 95" fill="none" stroke="#db3f59" strokeWidth="2" strokeLinecap="round"/>
            
            {/* Robot Body */}
            <rect x="50" y="135" width="100" height="50" rx="5" fill="none" stroke="#db3f59" strokeWidth="3"/>
            
            {/* Robot Arms */}
            <rect x="20" y="150" width="30" height="15" rx="7" fill="none" stroke="#db3f59" strokeWidth="3"/>
            <rect x="150" y="150" width="30" height="15" rx="7" fill="none" stroke="#db3f59" strokeWidth="3"/>
            
            {/* Robot Legs */}
            <rect x="65" y="188" width="12" height="20" fill="none" stroke="#db3f59" strokeWidth="2"/>
            <rect x="123" y="188" width="12" height="20" fill="none" stroke="#db3f59" strokeWidth="2"/>
            
            {/* Antenna */}
            <line x1="100" y1="30" x2="100" y2="10" stroke="#db3f59" strokeWidth="2"/>
            <circle cx="100" cy="8" r="4" fill="#db3f59"/>
          </svg>
        </div>

        <h1 className="not-found-code">404</h1>
        <h2 className="not-found-title">Page Not Found</h2>
        
        <p className="not-found-message">
          Sorry, the page you're looking for doesn't exist or has been moved.
        </p>

        <div className="not-found-buttons">
          <button
            className="not-found-btn primary"
            onClick={() => navigate('/')}
          >
            Go to Home
          </button>
          <button
            className="not-found-btn secondary"
            onClick={() => navigate(-1)}
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
