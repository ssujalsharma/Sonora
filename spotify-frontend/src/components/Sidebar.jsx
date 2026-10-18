import React from "react";
import { NavLink } from "react-router-dom";
import {
  Home,
  Search,
  Library,
  Plus,
  Heart,
  Music2,
  Sparkles,
  Radio,
  UploadCloud,
  Disc3,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { usePlayer } from "../context/PlayerContext";

export default function Sidebar({ onOpenArtistModal }) {
  const { isArtist, isAuthenticated, user, openAuth } = useAuth();
  const { likedSongIds, isPlaying, currentTrack } = usePlayer();

  return (
    <aside className="sidebar">
      {/* Brand */}
      <div className="brand">
        <div className="brand-icon-wrapper">
          <Music2 size={28} />
          {isPlaying && (
            <span className="live-pulse" title="Playing music" />
          )}
        </div>
        <div className="brand-text">
          <span>sonora</span>
          <span className="brand-badge">PRO</span>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="main-nav">
        <NavLink
          to="/"
          end
          className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
        >
          <Home size={22} />
          <span>Home</span>
        </NavLink>

        <NavLink
          to="/search"
          className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
        >
          <Search size={22} />
          <span>Search</span>
        </NavLink>

        <NavLink
          to="/library"
          className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
        >
          <Library size={22} />
          <span>Your Library</span>
        </NavLink>
      </nav>

      {/* Artist Section if Artist */}
      {isArtist && (
        <div className="artist-sidebar-box">
          <div className="artist-box-header">
            <Sparkles size={16} />
            <span>Artist Studio</span>
          </div>
          <p className="artist-box-desc">Upload tracks & release albums to the platform.</p>
          <button
            className="artist-upload-btn"
            onClick={onOpenArtistModal}
            id="sidebar-upload-btn"
          >
            <UploadCloud size={18} />
            <span>Studio Upload</span>
          </button>
        </div>
      )}

      {/* Playlists & Collections */}
      <div className="library-heading">
        <span>Playlists</span>
        <button
          className="icon-button"
          aria-label="Create playlist"
          onClick={() => {
            if (!isAuthenticated) openAuth("login");
          }}
          title="Create playlist"
        >
          <Plus size={18} />
        </button>
      </div>

      <div className="playlist-list">
        <NavLink
          to="/library?tab=liked"
          className={({ isActive }) =>
            `playlist-item ${isActive ? "active-playlist" : ""}`
          }
        >
          <span className="playlist-cover purple">
            <Heart size={18} fill="white" />
          </span>
          <div className="playlist-info">
            <span className="playlist-title">Liked Songs</span>
            <span className="playlist-meta">{likedSongIds.length} songs</span>
          </div>
        </NavLink>

        <NavLink
          to="/library?tab=daily"
          className="playlist-item"
        >
          <span className="playlist-cover green">
            <Disc3 size={18} />
          </span>
          <div className="playlist-info">
            <span className="playlist-title">Daily Mix 1</span>
            <span className="playlist-meta">Made for you</span>
          </div>
        </NavLink>

        <NavLink
          to="/library?tab=chill"
          className="playlist-item"
        >
          <span className="playlist-cover orange">
            <Radio size={18} />
          </span>
          <div className="playlist-info">
            <span className="playlist-title">Chill Vibes</span>
            <span className="playlist-meta">Lo-Fi & Beats</span>
          </div>
        </NavLink>
      </div>

      {/* Footer Info */}
      <div className="sidebar-footer">
        <div className="connection-status">
          <span className={`status-dot ${isPlaying ? "playing" : ""}`} />
          <span>{isAuthenticated ? `Signed in as ${user?.username}` : "High Fidelity Audio"}</span>
        </div>
        {currentTrack && isPlaying && (
          <div className="mini-equalizer">
            <span className="eq-bar bar1" />
            <span className="eq-bar bar2" />
            <span className="eq-bar bar3" />
            <span className="eq-bar bar4" />
          </div>
        )}
      </div>
    </aside>
  );
}
