import { useState, useEffect } from 'react';
import AccessDenied from '../components/AccessDenied/AccessDenied';
import './AccountsCenter.css';

function AccountsCenter({ user, onLogout }) {
  const [userData, setUserData] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);

  const getAuthHeaders = () => {
  const token = localStorage.getItem('jwt_token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

  useEffect(() => {
    if (user) {
      setUserData(user);
      const nameParts = user.Name.split(' ');
      setFirstName(nameParts[0] || '');
      setLastName(nameParts.slice(1).join(' ') || '');
    }
  }, [user]);

  if (!user) {
    return <AccessDenied />;
  }

  const handleSaveChanges = async () => {
  if (!user) return;
  
  setLoading(true);
  try {
    const response = await fetch(`/users/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        Name: `${firstName} ${lastName}`.trim()
      })
    });
    
    if (response.ok) {
      const data = await response.json();
      setUserData(data.user);
      alert('Changes saved successfully!');
    } else {
      if (response.status === 401) {
        localStorage.removeItem('jwt_token');
        alert('Session expired. Please log in again.');
        window.location.href = '/login';
      } else {
        const error = await response.json();
        alert(`Failed to save changes: ${error.message}`);
      }
    }
  } catch (err) {
    console.error('Error saving changes:', err);
    alert('Failed to save changes. Please try again.');
  } finally {
    setLoading(false);
  }
};

const handleClearHistory = async () => {
  if (!user) return;
  
  if (!window.confirm('Are you sure you want to clear your history?')) return;
  
  setLoading(true);
  try {
    const response = await fetch(`/users/history`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    
    if (response.ok) {
      alert('History cleared successfully!');
    } else {
      if (response.status === 401) {
        localStorage.removeItem('jwt_token');
        alert('Session expired. Please log in again.');
        window.location.href = '/login';
      } else {
        const error = await response.json();
        alert(`Failed to clear history: ${error.message}`);
      }
    }
  } catch (err) {
    console.error('Error clearing history:', err);
    alert('Failed to clear history. Please try again.');
  } finally {
    setLoading(false);
  }
};

  const handleClearLibrary = async () => {
  if (!user) return;
  
  if (!window.confirm('Are you sure you want to clear all bookmarks?')) return;
  
  setLoading(true);
  try {
    const response = await fetch(`/users/library`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    
    if (response.ok) {
      alert('Bookmarks cleared successfully!');
    } else {
      if (response.status === 401) {
        localStorage.removeItem('jwt_token');
        alert('Session expired. Please log in again.');
        window.location.href = '/login';
      } else {
        const error = await response.json();
        alert(`Failed to clear bookmarks: ${error.message}`);
      }
    }
  } catch (err) {
    console.error('Error clearing bookmarks:', err);
    alert('Failed to clear bookmarks. Please try again.');
  } finally {
    setLoading(false);
  }
};

  const handleDeleteAccount = async () => {
  if (!user) return;
  
  if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) return;
  
  const confirmText = window.prompt('Type "DELETE" to confirm account deletion:');
  if (confirmText !== 'DELETE') {
    alert('Account deletion cancelled.');
    return;
  }
  
  setLoading(true);
  try {
    const response = await fetch(`/users/profile`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    
    if (response.ok) {
      localStorage.removeItem('jwt_token');
      alert('Account deleted successfully. You will be redirected to the home page.');
      if (onLogout) onLogout();
      window.location.href = '/';
    } else {
      const error = await response.json();
      alert(`Failed to delete account: ${error.message}`);
    }
  } catch (err) {
    console.error('Error deleting account:', err);
    alert('Failed to delete account. Please try again.');
  } finally {
    setLoading(false);
  }
};

const handleLogout = async () => {
  try {
    const token = localStorage.getItem('jwt_token');
    
    await fetch('/auth/logout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    localStorage.removeItem('jwt_token');
    if (onLogout) onLogout();
    window.location.href = '/login';
  } catch (err) {
    console.error('Error logging out:', err);
    localStorage.removeItem('jwt_token');
    if (onLogout) onLogout();
    window.location.href = '/login';
  }
};

  if (!user) {
    return (
      <div className="login-prompt-container">
        <div>
          <h2 className="login-prompt-heading">Please log in to view your account settings</h2>
          <button className="login-button" onClick={() => window.location.href = '/login'}>
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="accounts-center-container">
      <div className="accounts-center-wrapper">
        <div className="sidebar-container">
          <div className="sidebar">
            <h2 className="sidebar-heading">Account Settings</h2>
            
            <div className="sidebar-item" onClick={() => document.getElementById('pd')?.scrollIntoView({ behavior: 'smooth' })}>
              <svg viewBox="0 0 24 24" className="sidebar-icon" fill="none">
                <path opacity="0.4" d="M12.1207 12.78C12.0507 12.77 11.9607 12.77 11.8807 12.78C10.1207 12.72 8.7207 11.28 8.7207 9.50998C8.7207 7.69998 10.1807 6.22998 12.0007 6.22998C13.8107 6.22998 15.2807 7.69998 15.2807 9.50998C15.2707 11.28 13.8807 12.72 12.1207 12.78Z" stroke="#292D32" strokeWidth="1.5" />
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#292D32" strokeWidth="1.5" />
              </svg>
              <span className="sidebar-text">Profile Details</span>
            </div>

            <div className="sidebar-item" onClick={() => document.getElementById('ld')?.scrollIntoView({ behavior: 'smooth' })}>
              <svg viewBox="0 0 24 24" className="sidebar-icon" fill="none">
                <path d="M2.00098 11.999L16.001 11.999M16.001 11.999L12.501 8.99902M16.001 11.999L12.501 14.999" stroke="#1C274C" strokeWidth="1.5" />
                <path d="M9.00195 7C9.01406 4.82497 9.11051 3.64706 9.87889 2.87868C10.7576 2 12.1718 2 15.0002 2L16.0002 2C18.8286 2 20.2429 2 21.1215 2.87868C22.0002 3.75736 22.0002 5.17157 22.0002 8L22.0002 16C22.0002 18.8284 22.0002 20.2426 21.1215 21.1213C20.2429 22 18.8286 22 16.0002 22H15.0002C12.1718 22 10.7576 22 9.87889 21.1213C9.11051 20.3529 9.01406 19.175 9.00195 17" stroke="#1C274C" strokeWidth="1.5" />
              </svg>
              <span className="sidebar-text">Login Options</span>
            </div>

            <div className="sidebar-item" onClick={() => document.getElementById('s')?.scrollIntoView({ behavior: 'smooth' })}>
              <svg viewBox="0 0 24 24" className="sidebar-icon" fill="none">
                <circle cx="12" cy="12" r="3" stroke="#1C274C" strokeWidth="1.5" />
                <path d="M13.7654 2.15224C13.3978 2 12.9319 2 12 2C11.0681 2 10.6022 2 10.2346 2.15224C9.74457 2.35523 9.35522 2.74458 9.15223 3.23463C9.05957 3.45834 9.0233 3.7185 9.00911 4.09799C8.98826 4.65568 8.70226 5.17189 8.21894 5.45093C7.73564 5.72996 7.14559 5.71954 6.65219 5.45876C6.31645 5.2813 6.07301 5.18262 5.83294 5.15102C5.30704 5.08178 4.77518 5.22429 4.35436 5.5472C4.03874 5.78938 3.80577 6.1929 3.33983 6.99993C2.87389 7.80697 2.64092 8.21048 2.58899 8.60491C2.51976 9.1308 2.66227 9.66266 2.98518 10.0835C3.13256 10.2756 3.3397 10.437 3.66119 10.639C4.1338 10.936 4.43789 11.4419 4.43786 12C4.43783 12.5581 4.13375 13.0639 3.66118 13.3608C3.33965 13.5629 3.13248 13.7244 2.98508 13.9165C2.66217 14.3373 2.51966 14.8691 2.5889 15.395C2.64082 15.7894 2.87379 16.193 3.33973 17C3.80568 17.807 4.03865 18.2106 4.35426 18.4527C4.77508 18.7756 5.30694 18.9181 5.83284 18.8489C6.07289 18.8173 6.31632 18.7186 6.65204 18.5412C7.14547 18.2804 7.73556 18.27 8.2189 18.549C8.70224 18.8281 8.98826 19.3443 9.00911 19.9021C9.02331 20.2815 9.05957 20.5417 9.15223 20.7654C9.35522 21.2554 9.74457 21.6448 10.2346 21.8478C10.6022 22 11.0681 22 12 22C12.9319 22 13.3978 22 13.7654 21.8478C14.2554 21.6448 14.6448 21.2554 14.8477 20.7654C14.9404 20.5417 14.9767 20.2815 14.9909 19.902C15.0117 19.3443 15.2977 18.8281 15.781 18.549C16.2643 18.2699 16.8544 18.2804 17.3479 18.5412C17.6836 18.7186 17.927 18.8172 18.167 18.8488C18.6929 18.9181 19.2248 18.7756 19.6456 18.4527C19.9612 18.2105 20.1942 17.807 20.6601 16.9999C21.1261 16.1929 21.3591 15.7894 21.411 15.395C21.4802 14.8691 21.3377 14.3372 21.0148 13.9164C20.8674 13.7243 20.6602 13.5628 20.3387 13.3608C19.8662 13.0639 19.5621 12.558 19.5621 11.9999C19.5621 11.4418 19.8662 10.9361 20.3387 10.6392C20.6603 10.4371 20.8675 10.2757 21.0149 10.0835C21.3378 9.66273 21.4803 9.13087 21.4111 8.60497C21.3592 8.21055 21.1262 7.80703 20.6602 7C20.1943 6.19297 19.9613 5.78945 19.6457 5.54727C19.2249 5.22436 18.693 5.08185 18.1671 5.15109C17.9271 5.18269 17.6837 5.28136 17.3479 5.4588C16.8545 5.71959 16.2644 5.73002 15.7811 5.45096C15.2977 5.17191 15.0117 4.65566 14.9909 4.09794C14.9767 3.71848 14.9404 3.45833 14.8477 3.23463C14.6448 2.74458 14.2554 2.35523 13.7654 2.15224Z" stroke="#1C274C" strokeWidth="1.5" />
              </svg>
              <span className="sidebar-text">Settings</span>
            </div>

            <div className="sidebar-item-logout" onClick={handleLogout}>
              <svg viewBox="0 0 24 24" className="sidebar-icon" fill="none">
                <path d="M15 11.25C15.4142 11.25 15.75 11.5858 15.75 12C15.75 12.4142 15.4142 12.75 15 12.75H4.02744L5.98809 14.4306C6.30259 14.7001 6.33901 15.1736 6.06944 15.4881C5.79988 15.8026 5.3264 15.839 5.01191 15.5694L1.51191 12.5694C1.34567 12.427 1.25 12.2189 1.25 12C1.25 11.7811 1.34567 11.573 1.51191 11.4306L5.01191 8.43056C5.3264 8.16099 5.79988 8.19741 6.06944 8.51191C6.33901 8.8264 6.30259 9.29988 5.98809 9.56944L4.02744 11.25H15Z" fill="#1C274C" />
              </svg>
              <span className="sidebar-text">Logout</span>
            </div>
          </div>
        </div>

        <div className="content-container">
          <div id="pd" className="content-section">
            <h2 className="section-heading">Profile Details</h2>
            <div className="profile-grid">
              <label htmlFor="fname" className="form-label">First name:</label>
              <label htmlFor="lname" className="form-label">Last name:</label>
              <input
                type="text"
                id="fname"
                name="fname"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                disabled={loading}
                className="form-input"
              />
              <input
                type="text"
                id="lname"
                name="lname"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                disabled={loading}
                className="form-input"
              />
              <label htmlFor="regdate" className="form-label">Registration Date:</label>
              <div></div>
              <input
                type="text"
                id="regdate"
                name="regdate"
                value={userData ? new Date(userData.Registration_Date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}
                disabled
                className="form-input-disabled"
              />
            </div>
            <button 
              onClick={handleSaveChanges} 
              disabled={loading}
              className="save-button"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>

          <div id="ld" className="content-section">
            <h2 className="section-heading">Login Options</h2>
            <div className="login-options-grid">
              <label htmlFor="email" className="form-label">Email:</label>
              <input
                type="text"
                id="email"
                name="email"
                value={userData?.Email || ''}
                disabled
                className="form-input-disabled"
              />
              <label htmlFor="google" className="form-label">Google:</label>
              <input
                type="text"
                id="google"
                name="google"
                value={userData?.Google_Linked ? 'Connected' : 'Not Connected'}
                disabled
                className="form-input-disabled"
              />
              <label htmlFor="local" className="form-label">Local Authentication:</label>
              <input
                type="text"
                id="local"
                name="local"
                value={userData?.Local_Auth ? 'Enabled' : 'Disabled'}
                disabled
                className="form-input-disabled"
              />
            </div>
          </div>

          <div id="s" className="content-section">
            <h2 className="section-heading">Settings</h2>
            <div className="settings-container">
              <div className="settings-row-history">
                <label htmlFor="history" className="settings-label">History:</label>
                <button 
                  onClick={handleClearHistory} 
                  disabled={loading}
                  className="clear-button"
                >
                  Clear
                </button>
              </div>
              <div className="settings-row-bookmarks">
                <label htmlFor="library" className="settings-label">Bookmarks:</label>
                <button 
                  onClick={handleClearLibrary} 
                  disabled={loading}
                  className="clear-button"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>

          <div id="da" className="content-section">
            <h2 className="section-heading-warning">Delete Account</h2>
            <p className="delete-warning">
              Warning: This action is permanent and cannot be undone. All your data will be deleted.
            </p>
            <button 
              onClick={handleDeleteAccount} 
              disabled={loading}
              className="delete-button"
            >
              {loading ? 'Deleting...' : 'Delete Account'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccountsCenter;