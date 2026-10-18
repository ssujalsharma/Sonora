import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  User,
  LogOut,
  UploadCloud,
  Sparkles,
  ShieldCheck,
  Disc,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function TopNav({ onOpenArtistModal }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, isArtist, logout, openAuth } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const initial = user?.username ? user.username.charAt(0).toUpperCase() : "U";

  return (
    <header className="topbar">
      <div className="topbar-left">
        <div className="history-buttons">
          <button
            className="round-button"
            onClick={() => navigate(-1)}
            aria-label="Back"
            title="Go back"
            id="nav-back-btn"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            className="round-button"
            onClick={() => navigate(1)}
            aria-label="Forward"
            title="Go forward"
            id="nav-forward-btn"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Quick page breadcrumb/tag */}
        <div className="topbar-tag">
          {location.pathname === "/" && <span className="topbar-badge">Home Stream</span>}
          {location.pathname.startsWith("/search") && <span className="topbar-badge">Explore & Find</span>}
          {location.pathname.startsWith("/library") && <span className="topbar-badge">Your Library</span>}
          {location.pathname.startsWith("/album") && <span className="topbar-badge">Album Details</span>}
        </div>
      </div>

      <div className="topbar-right">
        {/* Quick Artist Upload Button if logged in as artist */}
        {isArtist && (
          <button
            className="topbar-artist-upload-btn"
            onClick={onOpenArtistModal}
            id="topbar-artist-upload"
          >
            <UploadCloud size={16} />
            <span>Upload Music</span>
          </button>
        )}

        {isAuthenticated ? (
          <div className="profile-wrapper" ref={dropdownRef}>
            <button
              className="profile-pill"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              id="profile-dropdown-btn"
            >
              <span className="avatar">{initial}</span>
              <span className="profile-name">{user?.username}</span>
              <span className={`role-badge ${user?.role}`}>
                {user?.role === "artist" ? "Artist" : "Listener"}
              </span>
            </button>

            {dropdownOpen && (
              <div className="profile-dropdown">
                <div className="dropdown-user-header">
                  <div className="dropdown-avatar">{initial}</div>
                  <div className="dropdown-user-details">
                    <span className="dropdown-username">{user?.username}</span>
                    <span className="dropdown-email">{user?.email}</span>
                    <span className="dropdown-role-tag">
                      {isArtist ? "Verified Artist / Creator" : "Premium Listener"}
                    </span>
                  </div>
                </div>

                <div className="dropdown-divider" />

                {isArtist && (
                  <button
                    className="dropdown-item"
                    onClick={() => {
                      setDropdownOpen(false);
                      onOpenArtistModal();
                    }}
                  >
                    <UploadCloud size={16} />
                    <span>Artist Studio Upload</span>
                  </button>
                )}

                <button
                  className="dropdown-item"
                  onClick={() => {
                    setDropdownOpen(false);
                    navigate("/library");
                  }}
                >
                  <Disc size={16} />
                  <span>My Saved Music</span>
                </button>

                <div className="dropdown-divider" />

                <button
                  className="dropdown-item danger"
                  onClick={() => {
                    setDropdownOpen(false);
                    logout();
                  }}
                  id="logout-btn"
                >
                  <LogOut size={16} />
                  <span>Log out</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="auth-buttons-group">
            <button
              className="signup-button"
              onClick={() => openAuth("signup")}
              id="signup-btn"
            >
              Sign up
            </button>
            <button
              className="login-button"
              onClick={() => openAuth("login")}
              id="login-btn"
            >
              Log in
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
