import React, { useState } from "react";
import "../../styles/header/Header.css";
import useAuth from "../../hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import logo from './logo.png';
// actual logo of the app needs to be added
// need to add the functionality of putting a profile picture instead of "login" and "signup" once the user has logged in
// links need to be working for the correct pages, will do this in a later push

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully!");
    navigate("/login");
  };

  return (
    <header className="header">
      <div className="container">
        <div className="logo">
          {/* Logo leads to home page */}
          <Link to="/">
            <img src={logo} alt="App Logo" className="logo-img" />
          </Link>
        </div>
        <button
          type="button"
          className={`menu-btn ${isMenuOpen ? "active" : ""}`}
          onClick={toggleMenu}
        >
          <span className="line line-1"></span>
          <span className="line line-2"></span>
          <span className="line line-3"></span>
        </button>
        <nav className={`menu ${isMenuOpen ? "open" : ""}`}>
          <li>
          <Link to="/" className="show-all-button"> HOME  </Link>
          </li>
          <li>
            <Link to="/search" className="show-all-button"> SEARCH  </Link>
          </li>
          <li>
            <Link to="/showtimes" className="show-all-button"> SHOWTIMES  </Link>
          </li>
          <li>
            <Link to="/favourites" className="show-all-button">  FAVOURITES  </Link>
          </li>
          <li>
            <Link to="/groups" className="show-all-button">  GROUPS  </Link>
          </li>
          <li>
            <Link to="/aboutus" className="show-all-button">  ABOUT US  </Link>
          </li>
          <li>{loading && <button className="nav-btn">Loading...</button>}</li>

          {/* {!loading && user && (
            <li>
              <button
                onClick={() => {
                  logout();
                  toast.success("Logged out successfully!");
                }}
                className="nav-btn"
              >
                Log Out
              </button>
            </li>
          )} */}
          {!loading && user && (
            <li className="profile-icon">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTPjLlc8_9N9l9qB0fPxZSGMtF4mfEr68qusA&s" // Replace with user profile image
                alt="User Profile"
                onClick={toggleDropdown}
              />
              {isDropdownOpen && (
                <div className="dropdown-menu">
                  <button onClick={handleLogout} className="dropdown-btn">
                    Logout
                  </button>
                  <button
                    onClick={() => navigate(`/delete/${user.id}`)}
                    className="dropdown-btn"
                  >
                    Delete Account
                  </button>
                </div>
              )}
            </li>
          )}

          {!loading && !user && (
            <button onClick={() => navigate("/login")} className="nav-btn">
              Log In
            </button>
          )}
          {!loading && !user && (
            <button onClick={() => navigate("/signup")} className="nav-btn">
              Sign Up
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
