import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Play,
  Pause,
  Music2,
  Heart,
  Disc3,
  Sparkles,
  Radio,
  TrendingUp,
  Flame,
  ArrowRight,
  Headphones,
} from "lucide-react";
import { usePlayer } from "../context/PlayerContext";
import { useAuth } from "../context/AuthContext";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default function Home({ onOpenArtistModal }) {
  const navigate = useNavigate();
  const {
    songs,
    albums,
    currentTrack,
    isPlaying,
    playTrack,
    toggleLike,
    isLiked,
  } = usePlayer();
  const { user, isArtist } = useAuth();
  const [filterLang, setFilterLang] = useState("all"); // "all" | "Hindi" | "Punjabi"

  const greeting = getGreeting();

  const hindiTracks = songs.filter(
    (s) => s.language === "Hindi" || s.genre?.toLowerCase().includes("hindi") || s.genre?.toLowerCase().includes("bollywood")
  );
  const punjabiTracks = songs.filter(
    (s) => s.language === "Punjabi" || s.genre?.toLowerCase().includes("punjabi") || s.genre?.toLowerCase().includes("bhangra")
  );

  const displayedQuickPicks = (
    filterLang === "Hindi"
      ? hindiTracks
      : filterLang === "Punjabi"
      ? punjabiTracks
      : songs
  ).slice(0, 6);

  const popularArtists = [
    { name: "Arijit Singh", genre: "Soulful & Bollywood Romance", color: "#e17055", initial: "A" },
    { name: "Diljit Dosanjh", genre: "Bhangra & Punjabi Pop", color: "#0984e3", initial: "D" },
    { name: "AP Dhillon", genre: "Punjabi Trap & Hip-Hop", color: "#6c5ce7", initial: "AP" },
    { name: "Karan Aujla", genre: "Punjabi R&B & Beats", color: "#00b894", initial: "K" },
    { name: "Sidhu Moose Wala", genre: "Punjabi Hip-Hop Legend", color: "#d63031", initial: "S" },
    { name: "Pritam", genre: "Bollywood Composer / Maestro", color: "#fdcb6e", initial: "P" },
  ];

  return (
    <main className="main-content" id="home-view">
      {/* Welcome Banner */}
      <section className="welcome-section">
        <div className="eyebrow-wrapper">
          <Sparkles size={14} />
          <span className="eyebrow">HINDI & PUNJABI MUSIC HUB</span>
        </div>
        <h1>
          {greeting}
          {user?.username ? `, ${user.username}` : "."}
        </h1>
        <p className="welcome-subtitle">
          Streaming Bollywood romance, Punjabi bangers, and chart-topping desi anthems.
        </p>

        {/* Language Quick Filter Pills */}
        <div className="desi-filter-pills">
          <button
            className={`desi-pill ${filterLang === "all" ? "active" : ""}`}
            onClick={() => setFilterLang("all")}
          >
            All Tracks ({songs.length})
          </button>
          <button
            className={`desi-pill ${filterLang === "Hindi" ? "active" : ""}`}
            onClick={() => setFilterLang("Hindi")}
          >
            🇮🇳 Hindi & Bollywood ({hindiTracks.length})
          </button>
          <button
            className={`desi-pill ${filterLang === "Punjabi" ? "active" : ""}`}
            onClick={() => setFilterLang("Punjabi")}
          >
            🔥 Punjabi Hits ({punjabiTracks.length})
          </button>
        </div>
      </section>

      {/* Artist Studio Banner if Artist */}
      {isArtist && (
        <section className="artist-welcome-banner">
          <div className="banner-content">
            <span className="banner-badge">CREATOR STUDIO</span>
            <h3>Release your new Hindi or Punjabi track!</h3>
            <p>Upload audio files, release new albums, and share your music with listeners worldwide.</p>
          </div>
          <button
            className="banner-cta-btn"
            onClick={onOpenArtistModal}
            id="home-banner-upload-btn"
          >
            <Sparkles size={16} />
            <span>Studio Upload</span>
          </button>
        </section>
      )}

      {/* Quick Picks 6-Grid */}
      <section className="quick-grid">
        {displayedQuickPicks.map((song) => {
          const isThisTrackPlaying = isPlaying && currentTrack?.id === song.id;
          return (
            <button
              className="quick-card"
              key={song.id}
              onClick={() => playTrack(song, songs)}
              id={`quick-song-${song.id}`}
            >
              <span
                className="quick-cover"
                style={{ background: song.color }}
              >
                {song.artwork ? (
                  <img
                    src={song.artwork}
                    alt={song.title}
                    className="quick-cover-img"
                    onError={(e) => { e.currentTarget.style.display = "none"; }}
                  />
                ) : (
                  <Music2 size={24} />
                )}
                {isThisTrackPlaying && <span className="mini-pulse-ring" />}
              </span>

              <span className="quick-title">{song.title}</span>

              <span className={`quick-play ${isThisTrackPlaying ? "playing" : ""}`}>
                {isThisTrackPlaying ? (
                  <Pause size={18} fill="currentColor" />
                ) : (
                  <Play size={18} fill="currentColor" />
                )}
              </span>
            </button>
          );
        })}
      </section>

      {/* Section 1: Hindi Hits & Bollywood Romance */}
      {(filterLang === "all" || filterLang === "Hindi") && (
        <section className="music-section">
          <div className="section-heading">
            <div className="heading-left">
              <div className="eyebrow-wrapper">
                <Heart size={14} color="#ff7675" fill="#ff7675" />
                <span className="eyebrow" style={{ color: "#ff7675" }}>
                  BOLLYWOOD ROMANCE & HINDI HITS
                </span>
              </div>
              <h2>Hindi Chartbusters</h2>
            </div>
            <button
              className="text-button"
              onClick={() => navigate("/search")}
            >
              See all <ArrowRight size={14} />
            </button>
          </div>

          <div className="album-grid">
            {hindiTracks.map((song) => {
              const isThisTrackPlaying = isPlaying && currentTrack?.id === song.id;
              const liked = isLiked(song.id);

              return (
                <div
                  className="album-card"
                  key={song.id}
                  onClick={() => playTrack(song, hindiTracks)}
                >
                  <div
                    className="album-art"
                    style={{ background: song.color }}
                  >
                    {song.artwork ? (
                      <img
                        src={song.artwork}
                        alt={song.title}
                        className="card-cover-img"
                        onError={(e) => { e.currentTarget.style.display = "none"; }}
                      />
                    ) : (
                      <Music2 size={42} strokeWidth={1.4} />
                    )}
                    {isThisTrackPlaying && (
                      <div className="card-live-badge">
                        <span className="dot" />
                        <span>PLAYING</span>
                      </div>
                    )}
                    <button
                      className={`album-play ${isThisTrackPlaying ? "playing" : ""}`}
                      aria-label={`Play ${song.title}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        playTrack(song, hindiTracks);
                      }}
                    >
                      {isThisTrackPlaying ? (
                        <Pause size={20} fill="currentColor" />
                      ) : (
                        <Play size={20} fill="currentColor" style={{ marginLeft: "2px" }} />
                      )}
                    </button>
                  </div>

                  <div className="album-card-body">
                    <span className="album-title" title={song.title}>
                      {song.title}
                    </span>
                    <div className="album-card-footer">
                      <span className="album-artist" title={song.artist}>
                        {song.artist}
                      </span>
                      <button
                        className={`card-heart-btn ${liked ? "liked" : ""}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLike(song.id);
                        }}
                        title={liked ? "Unlike" : "Like"}
                      >
                        <Heart
                          size={15}
                          fill={liked ? "#1ed760" : "none"}
                          color={liked ? "#1ed760" : "#a4aaa5"}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Section 2: Punjabi Blockbusters & Hip-Hop */}
      {(filterLang === "all" || filterLang === "Punjabi") && (
        <section className="music-section">
          <div className="section-heading">
            <div className="heading-left">
              <div className="eyebrow-wrapper">
                <Flame size={14} color="#f0932b" />
                <span className="eyebrow" style={{ color: "#f0932b" }}>
                  PUNJABI WAVE & BHANGRA
                </span>
              </div>
              <h2>Punjabi Blockbusters</h2>
            </div>
            <button
              className="text-button"
              onClick={() => navigate("/search")}
            >
              See all <ArrowRight size={14} />
            </button>
          </div>

          <div className="album-grid">
            {punjabiTracks.map((song) => {
              const isThisTrackPlaying = isPlaying && currentTrack?.id === song.id;
              const liked = isLiked(song.id);

              return (
                <div
                  className="album-card"
                  key={song.id}
                  onClick={() => playTrack(song, punjabiTracks)}
                >
                  <div
                    className="album-art"
                    style={{ background: song.color }}
                  >
                    {song.artwork ? (
                      <img
                        src={song.artwork}
                        alt={song.title}
                        className="card-cover-img"
                        onError={(e) => { e.currentTarget.style.display = "none"; }}
                      />
                    ) : (
                      <Music2 size={42} strokeWidth={1.4} />
                    )}
                    {isThisTrackPlaying && (
                      <div className="card-live-badge">
                        <span className="dot" />
                        <span>PLAYING</span>
                      </div>
                    )}
                    <button
                      className={`album-play ${isThisTrackPlaying ? "playing" : ""}`}
                      aria-label={`Play ${song.title}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        playTrack(song, punjabiTracks);
                      }}
                    >
                      {isThisTrackPlaying ? (
                        <Pause size={20} fill="currentColor" />
                      ) : (
                        <Play size={20} fill="currentColor" style={{ marginLeft: "2px" }} />
                      )}
                    </button>
                  </div>

                  <div className="album-card-body">
                    <span className="album-title" title={song.title}>
                      {song.title}
                    </span>
                    <div className="album-card-footer">
                      <span className="album-artist" title={song.artist}>
                        {song.artist}
                      </span>
                      <button
                        className={`card-heart-btn ${liked ? "liked" : ""}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLike(song.id);
                        }}
                        title={liked ? "Unlike" : "Like"}
                      >
                        <Heart
                          size={15}
                          fill={liked ? "#1ed760" : "none"}
                          color={liked ? "#1ed760" : "#a4aaa5"}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Featured Albums Section */}
      <section className="music-section">
        <div className="section-heading">
          <div className="heading-left">
            <div className="eyebrow-wrapper">
              <Disc3 size={14} />
              <span className="eyebrow">CURATED COLLECTIONS</span>
            </div>
            <h2>Featured Albums</h2>
          </div>
          <button
            className="text-button"
            onClick={() => navigate("/library?tab=albums")}
          >
            All albums <ArrowRight size={14} />
          </button>
        </div>

        <div className="album-grid">
          {albums.map((album, idx) => {
            const albumGradients = [
              "linear-gradient(135deg, #c0392b, #8e44ad)",
              "linear-gradient(135deg, #e67e22, #2980b9)",
              "linear-gradient(135deg, #16a085, #2c3e50)",
            ];
            const bgGradient = albumGradients[idx % albumGradients.length];

            return (
              <div
                className="album-card"
                key={album._id || album.id}
                onClick={() => navigate(`/album/${album._id || album.id}`)}
              >
                <div
                  className="album-art album-vinyl-art"
                  style={{ background: bgGradient }}
                >
                  <Disc3 size={46} strokeWidth={1.5} />
                  <span className="album-play">
                    <Play size={20} fill="currentColor" style={{ marginLeft: "2px" }} />
                  </span>
                </div>
                <div className="album-card-body">
                  <span className="album-title">{album.title}</span>
                  <span className="album-artist">
                    By {album.artist?.username || "Sonora Artist"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Top Artists Row */}
      <section className="music-section artists-section">
        <div className="section-heading">
          <div className="heading-left">
            <div className="eyebrow-wrapper">
              <Flame size={14} />
              <span className="eyebrow">TRENDING ARTISTS</span>
            </div>
            <h2>Popular Desi Artists</h2>
          </div>
        </div>

        <div className="artists-grid">
          {popularArtists.map((artist, idx) => (
            <div
              className="artist-card"
              key={idx}
              onClick={() => {
                navigate("/search");
              }}
              style={{ cursor: "pointer" }}
            >
              <div
                className="artist-avatar-large"
                style={{ background: artist.color }}
              >
                <span className="artist-initial">{artist.initial}</span>
              </div>
              <span className="artist-name">{artist.name}</span>
              <span className="artist-genre">{artist.genre}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
