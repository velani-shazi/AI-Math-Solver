/**
 * Navbar Component
 * 
 * Top navigation bar displayed on all pages
 * Provides:
 * - Logo/home link
 * - Navigation links to main pages
 * - User profile dropdown menu (when authenticated)
 * - Login/Logout buttons
 * - Responsive navigation for different screen sizes
 * 
 * @param {Object} props - Component props
 * @param {string} props.logo - Logo image source
 * @param {Object|null} props.user - Authenticated user object (null if not logged in)
 * @param {Function} props.onLogout - Callback when user logs out
 */

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle, FaBookOpen, FaHistory } from "react-icons/fa";
import Avvvatars from 'avvvatars-react'
import "./Navbar.css";

/**
 * Navbar Component
 * Displays navigation bar with links and user menu
 */
function Navbar({ logo, user, onLogout }) {
  console.log(user);
  // Track dropdown menu visibility
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  /**
   * Toggle dropdown menu visibility
   */
  const toggleDropdown = () => setShowDropdown(!showDropdown);

  /**
   * Handle user logout
   * Makes logout request to backend, clears token, and updates auth state
   */
  const handleLogout = async () => {
  try {
    // Get stored JWT token
    const token = localStorage.getItem('jwt_token');
    
    // Notify backend of logout
    await fetch("/auth/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
    });

    // Clear token from localStorage
    localStorage.removeItem('jwt_token');
    
    // Update parent component's auth state
    if (onLogout) {
      onLogout();
    }
    
    // Redirect to login
    navigate("/login");
  } catch (error) {
    console.error("Error during logout:", error);
    // Clear token even if logout request fails
    localStorage.removeItem('jwt_token');
    if (onLogout) {
      onLogout();
    }
    navigate("/login");
  }
};

  /**
   * Handle profile menu click
   * Close dropdown and navigate to account page
   */
  const handleProfileClick = () => {
    setShowDropdown(false);
    navigate("/account");
  };

  /**
   * Handle settings menu click
   * Close dropdown and navigate to account settings
   */
  const handleSettingsClick = () => {
    setShowDropdown(false);
    navigate("/account");
  };

  const handleLoginOptionsClick = () => {
    setShowDropdown(false);
    navigate("/account");
  };

  const handleHistoryClick = () => {
    if (user?.ID) {
      navigate(`/history`);
    }
  };

  const handleClickOutside = (e) => {
    if (!e.target.closest('.avatar')) {
      setShowDropdown(false);
    }
  };

  useState(() => {
    if (showDropdown) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showDropdown]);

  return (
    <nav className="navigation-bar">
      <Link to="/">
        <img className="company-logo" src={logo} alt="company logo" />
      </Link>

      {!user ? (
        <div className="login-button">
          <Link to="/login">Login</Link>
        </div>
      ) : (
        <div className="nav-items">
          <div className="library">
            <FaBookOpen className="library-icon" />
            <Link className="library-link" to="/bookmarks">
              bookmarks
            </Link>
          </div>

          <div className="avatar" onClick={toggleDropdown}>
            {user.Image_URL ? (
              <img
                src={user.Image_URL}
                alt="User Avatar"
                className="avatar-image"
              />
            ) : (
              <Avvvatars 
                value={`${user.Name}@gmail.com`} 
                style="shape"
                size={40}
              />
            )}

            <div
              id="dropdownMenu"
              className={`dropdown-content ${showDropdown ? "show" : ""}`}
            >
              <button onClick={handleProfileClick}>Profile Details</button>
              <button onClick={handleLoginOptionsClick}>Login Options</button>
              <button onClick={handleSettingsClick}>Settings</button>
              <button onClick={handleLogout}>Logout</button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;