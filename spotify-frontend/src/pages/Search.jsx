import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search as SearchIcon,
  X,
  Music2,
  Play,
  Pause,
  Heart,
  Disc3,
  Sparkles,
} from "lucide-react";
import { usePlayer } from "../context/PlayerContext";

const GENRES = [
  { name: "Hindi Top 50", query: "Hindi", gradient: "linear-gradient(135deg, #e17055 0%, #d63031 100%)" },
  { name: "Punjabi Hits", query: "Punjabi", gradient: "linear-gradient(135deg, #0984e3 0%, #6c5ce7 100%)" },
  { name: "Bollywood Romance", query: "Romance", gradient: "linear-gradient(135deg, #e84393 0%, #fd79a8 100%)" },
  { name: "Punjabi Hip-Hop", query: "Hip-Hop", gradient: "linear-gradient(135deg, #2d3436 0%, #636e72 100%)" },
  { name: "Bhangra Vibes", query: "Bhangra", gradient: "linear-gradient(135deg, #f0932b 0%, #f6e58d 100%)" },
  { name: "Lo-Fi Hindi", query: "Lo-Fi", gradient: "linear-gradient(135deg, #593b65 0%, #8b4a7d 100%)" },
  { name: "Acoustic Love", query: "Acoustic", gradient: "linear-gradient(135deg, #134e5e 0%, #71b280 100%)" },
  { name: "Desi Party", query: "Dance", gradient: "linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%)" },
];

export default function SearchPage() {
  const navigate = useNavigate();
  const { songs, albums, currentTrack, isPlaying, playTrack, toggleLike, isLiked } = usePlayer();
  const [query, setQuery] = useState("");

  const filteredSongs = songs.filter((song) => {
    const text = query.toLowerCase().trim();
    if (!text) return true;
    return (
      song.title.toLowerCase().includes(text) ||
      song.artist.toLowerCase().includes(text) ||
      (song.genre && song.genre.toLowerCase().includes(text)) ||
      (song.language && song.language.toLowerCase().includes(text))
    );
  });

  const filteredAlbums = albums.filter((album) => {
    const text = query.toLowerCase().trim();
    if (!text) return true;
    return (
      album.title.toLowerCase().includes(text) ||
      (album.artist?.username &&
        album.artist.username.toLowerCase().includes(text))
    );
  });

  const topResult = query.trim() && filteredSongs.length > 0 ? filteredSongs[0] : null;

  return (
    <main className="main-content search-page" id="search-view">
      {/* Top Header */}
      <div className="search-header-box">
        <div className="eyebrow-wrapper">
          <Sparkles size={14} />
          <span className="eyebrow">HINDI & PUNJABI MUSIC SEARCH</span>
        </div>
        <h1>Search</h1>
      </div>

      {/* Search Input Bar */}
      <div className="search-input-wrapper">
        <SearchIcon size={22} className="search-icon-svg" />
        <input
          type="text"
          placeholder="Search Hindi, Punjabi, artists (Arijit, Diljit, AP Dhillon), or songs..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
          id="search-input-field"
        />
        {query && (
          <button
            className="clear-search-btn"
            onClick={() => setQuery("")}
            aria-label="Clear search"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Quick Search Suggestions */}
      {!query && (
        <div className="quick-search-chips">
          <span className="chip-label">Popular searches:</span>
          {["Arijit Singh", "Diljit Dosanjh", "AP Dhillon", "Sidhu Moose Wala", "Hindi", "Punjabi"].map((term) => (
            <button
              key={term}
              className="quick-search-chip"
              onClick={() => setQuery(term)}
            >
              {term}
            </button>
          ))}
        </div>
      )}

      {/* When Query is active: Results */}
      {query.trim() ? (
        <section className="search-results-section">
          {filteredSongs.length === 0 && filteredAlbums.length === 0 ? (
            <div className="empty-search-state">
              <Music2 size={48} />
              <h3>No results found for "{query}"</h3>
              <p>Try searching for popular artists like "Arijit", "Diljit", "AP Dhillon", or tracks like "Kesariya", "Lover", "295".</p>
            </div>
          ) : (
            <div className="search-grid-layout">
              {/* Top Result Card */}
              {topResult && (
                <div className="top-result-col">
                  <h2>Top result</h2>
                  <div
                    className="top-result-card"
                    onClick={() => playTrack(topResult, filteredSongs)}
                  >
                    <div
                      className="top-result-art"
                      style={{ background: topResult.color }}
                    >
                      {topResult.artwork ? (
                        <img
                          src={topResult.artwork}
                          alt={topResult.title}
                          className="top-result-cover-img"
                          onError={(e) => { e.currentTarget.style.display = "none"; }}
                        />
                      ) : (
                        <Music2 size={36} />
                      )}
                    </div>
                    <span className="top-result-title">{topResult.title}</span>
                    <div className="top-result-meta">
                      <span className="top-result-artist">{topResult.artist}</span>
                      <span className="top-result-badge">
                        {topResult.language || "Song"}
                      </span>
                    </div>

                    <button
                      className="top-result-play-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        playTrack(topResult, filteredSongs);
                      }}
                      aria-label="Play top result"
                    >
                      {isPlaying && currentTrack?.id === topResult.id ? (
                        <Pause size={22} fill="currentColor" />
                      ) : (
                        <Play size={22} fill="currentColor" style={{ marginLeft: "2px" }} />
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Matching Songs List */}
              <div className="matching-songs-col">
                <h2>Songs ({filteredSongs.length})</h2>
                <div className="matching-songs-list">
                  {filteredSongs.slice(0, 6).map((song) => {
                    const isThisTrackPlaying =
                      isPlaying && currentTrack?.id === song.id;
                    const liked = isLiked(song.id);

                    return (
                      <div
                        className={`search-result-row ${isThisTrackPlaying ? "active-track" : ""}`}
                        key={song.id}
                        onClick={() => playTrack(song, filteredSongs)}
                      >
                        <div
                          className="search-row-art"
                          style={{ background: song.color }}
                        >
                          {song.artwork ? (
                            <img
                              src={song.artwork}
                              alt={song.title}
                              className="search-row-img"
                              onError={(e) => { e.currentTarget.style.display = "none"; }}
                            />
                          ) : (
                            <Music2 size={18} />
                          )}
                          <button
                            className="search-row-play-overlay"
                            aria-label="Play track"
                          >
                            {isThisTrackPlaying ? (
                              <Pause size={16} fill="currentColor" />
                            ) : (
                              <Play size={16} fill="currentColor" />
                            )}
                          </button>
                        </div>

                        <div className="search-row-info">
                          <span className="search-row-title">{song.title}</span>
                          <span className="search-row-artist">{song.artist}</span>
                        </div>

                        <button
                          className={`card-heart-btn ${liked ? "liked" : ""}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleLike(song.id);
                          }}
                          title={liked ? "Unlike" : "Like"}
                        >
                          <Heart
                            size={16}
                            fill={liked ? "#1ed760" : "none"}
                            color={liked ? "#1ed760" : "#a4aaa5"}
                          />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Matching Albums */}
          {filteredAlbums.length > 0 && (
            <div className="search-albums-row">
              <h2>Matching Albums</h2>
              <div className="album-grid">
                {filteredAlbums.map((album) => (
                  <div
                    className="album-card"
                    key={album._id || album.id}
                    onClick={() => navigate(`/album/${album._id || album.id}`)}
                  >
                    <div className="album-art album-vinyl-art">
                      <Disc3 size={42} strokeWidth={1.5} />
                      <span className="album-play">
                        <Play size={20} fill="currentColor" />
                      </span>
                    </div>
                    <div className="album-card-body">
                      <span className="album-title">{album.title}</span>
                      <span className="album-artist">
                        By {album.artist?.username || "Artist"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      ) : (
        /* When Query is empty: Hindi & Punjabi Genre Tiles */
        <section className="browse-genres-section">
          <h2>Browse Hindi & Punjabi Categories</h2>
          <div className="genre-cards-grid">
            {GENRES.map((genre, idx) => (
              <button
                className="genre-card"
                key={idx}
                style={{ background: genre.gradient }}
                onClick={() => setQuery(genre.query)}
              >
                <span className="genre-name">{genre.name}</span>
                <div className="genre-card-art">
                  <Music2 size={38} opacity={0.65} />
                </div>
              </button>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
