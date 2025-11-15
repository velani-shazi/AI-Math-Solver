import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle, FaBookOpen, FaHistory } from "react-icons/fa";
import Avvvatars from 'avvvatars-react'
import "./Navbar.css";

function Navbar({ logo, user, onLogout }) {
  console.log(user);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => setShowDropdown(!showDropdown);

  const handleLogout = async () => {
  try {
    const token = localStorage.getItem('jwt_token');
    
    await fetch("/auth/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
    });

    localStorage.removeItem('jwt_token');
    
    if (onLogout) {
      onLogout();
    }
    
    navigate("/login");
  } catch (error) {
    console.error("Error during logout:", error);
    localStorage.removeItem('jwt_token');
    if (onLogout) {
      onLogout();
    }
    navigate("/login");
  }
};

  const handleProfileClick = () => {
    setShowDropdown(false);
    navigate("/account");
  };

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