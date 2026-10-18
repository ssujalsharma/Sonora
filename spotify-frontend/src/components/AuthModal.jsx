import React, { useState } from "react";
import { X, Music2, Sparkles, User, Headphones, CheckCircle2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { usePlayer } from "../context/PlayerContext";

export default function AuthModal() {
  const { authModalOpen, authModalMode, closeAuth, setAuthModalMode, login, register } = useAuth();
  const { showToast, fetchMusicData } = usePlayer();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user"); // "user" | "artist"
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!authModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (authModalMode === "login") {
        await login({ identifier: username || email, password });
        showToast("Welcome back!");
      } else {
        await register({ username, email, password, role });
        showToast(
          role === "artist"
            ? "Welcome to Sonora Artist Studio!"
            : "Account created successfully!"
        );
      }
      fetchMusicData();
      closeAuth();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Authentication failed. Please check credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (type) => {
    setError("");
    if (type === "artist") {
      setAuthModalMode("login");
      setUsername("SonoraStudio");
      setPassword("artist123");
    } else {
      setAuthModalMode("login");
      setUsername("sujal");
      setPassword("sujal123");
    }
  };

  return (
    <div className="modal-overlay" onClick={closeAuth}>
      <div
        className="auth-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        id="auth-dialog"
      >
        <button
          className="modal-close-btn"
          onClick={closeAuth}
          aria-label="Close dialog"
        >
          <X size={20} />
        </button>

        <div className="auth-header">
          <div className="auth-brand-badge">
            <Music2 size={28} />
          </div>
          <h2>
            {authModalMode === "login"
              ? "Log in to Sonora"
              : "Create your Sonora account"}
          </h2>
          <p className="auth-sub">
            {authModalMode === "login"
              ? "Stream millions of songs and curated playlists."
              : "Join millions of listeners and discover fresh music."}
          </p>
        </div>

        {error && <div className="auth-error-banner">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          {authModalMode === "signup" && (
            <>
              <div className="form-group">
                <label htmlFor="reg-username">Username</label>
                <input
                  id="reg-username"
                  type="text"
                  placeholder="e.g. musiclover99"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="reg-email">Email address</label>
                <input
                  id="reg-email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* Role selection */}
              <div className="form-group">
                <label>Account Type</label>
                <div className="role-selector-grid">
                  <button
                    type="button"
                    className={`role-select-card ${role === "user" ? "selected" : ""}`}
                    onClick={() => setRole("user")}
                  >
                    <Headphones size={22} />
                    <div className="role-card-info">
                      <span className="role-title">Listener</span>
                      <span className="role-sub">Stream & save playlists</span>
                    </div>
                    {role === "user" && <CheckCircle2 size={16} className="role-check" />}
                  </button>

                  <button
                    type="button"
                    className={`role-select-card ${role === "artist" ? "selected" : ""}`}
                    onClick={() => setRole("artist")}
                  >
                    <Sparkles size={22} />
                    <div className="role-card-info">
                      <span className="role-title">Artist / Creator</span>
                      <span className="role-sub">Upload tracks & albums</span>
                    </div>
                    {role === "artist" && <CheckCircle2 size={16} className="role-check" />}
                  </button>
                </div>
              </div>
            </>
          )}

          {authModalMode === "login" && (
            <div className="form-group">
              <label htmlFor="login-id">Username or Email</label>
              <input
                id="login-id"
                type="text"
                placeholder="Enter username or email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="auth-pass">Password</label>
            <input
              id="auth-pass"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="auth-submit-btn"
            disabled={loading}
            id="auth-submit-button"
          >
            {loading
              ? "Please wait..."
              : authModalMode === "login"
              ? "Log In"
              : "Sign Up"}
          </button>
        </form>

        {/* Demo Fast Fill */}
        <div className="auth-quickfill-section">
          <p className="quickfill-label">Quick test accounts:</p>
          <div className="quickfill-chips">
            <button
              type="button"
              className="quickfill-chip"
              onClick={() => handleQuickFill("artist")}
            >
              <Sparkles size={14} />
              <span>Artist (SonoraStudio)</span>
            </button>
            <button
              type="button"
              className="quickfill-chip"
              onClick={() => handleQuickFill("listener")}
            >
              <User size={14} />
              <span>Listener (sujal)</span>
            </button>
          </div>
        </div>

        <div className="auth-footer-toggle">
          {authModalMode === "login" ? (
            <p>
              Don't have an account?{" "}
              <button
                type="button"
                className="text-link-btn"
                onClick={() => {
                  setError("");
                  setAuthModalMode("signup");
                }}
              >
                Sign up for Sonora
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <button
                type="button"
                className="text-link-btn"
                onClick={() => {
                  setError("");
                  setAuthModalMode("login");
                }}
              >
                Log in
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
