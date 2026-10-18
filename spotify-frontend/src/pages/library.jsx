import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Heart,
  Play,
  Pause,
  Music2,
  Clock3,
  Disc3,
  ListMusic,
  Plus,
  Sparkles,
  Shuffle,
} from "lucide-react";
import { usePlayer } from "../context/PlayerContext";
import { useAuth } from "../context/AuthContext";

export default function LibraryPage({ onOpenArtistModal }) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const {
    songs,
    albums,
    likedSongIds,
    currentTrack,
    isPlaying,
    playTrack,
    toggleLike,
    isLiked,
    toggleShuffle,
  } = usePlayer();
  const { user, isArtist, isAuthenticated, openAuth } = useAuth();

  const tabParam = searchParams.get("tab");
  const [activeFilter, setActiveFilter] = useState(
    tabParam === "liked" ? "liked" : tabParam === "albums" ? "albums" : "all"
  );

  useEffect(() => {
    if (tabParam) {
      setActiveFilter(tabParam);
    }
  }, [tabParam]);

  const likedSongs = songs.filter((s) => likedSongIds.includes(s.id));
  const myUploads = isArtist
    ? songs.filter(
        (s) =>
          s.artist?.toLowerCase() === user?.username?.toLowerCase() ||
          s.artist === "SonoraStudio"
      )
    : [];

  const handlePlayLikedSongs = () => {
    if (likedSongs.length > 0) {
      playTrack(likedSongs[0], likedSongs);
    }
  };

  return (
    <main className="main-content library-page" id="library-view">
      {/* Header & Filter Chips */}
      <div className="library-top-bar">
        <div>
          <div className="eyebrow-wrapper">
            <ListMusic size={14} />
            <span className="eyebrow">COLLECTION</span>
          </div>
          <h1>Your Library</h1>
        </div>

        {isArtist && (
          <button
            className="artist-upload-btn-secondary"
            onClick={onOpenArtistModal}
            id="library-upload-trigger"
          >
            <Sparkles size={16} />
            <span>Upload to Studio</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="library-filter-chips">
        <button
          className={`filter-chip ${activeFilter === "all" ? "active" : ""}`}
          onClick={() => setActiveFilter("all")}
        >
          All
        </button>
        <button
          className={`filter-chip ${activeFilter === "liked" ? "active" : ""}`}
          onClick={() => setActiveFilter("liked")}
        >
          Liked Songs ({likedSongs.length})
        </button>
        <button
          className={`filter-chip ${activeFilter === "albums" ? "active" : ""}`}
          onClick={() => setActiveFilter("albums")}
        >
          Albums ({albums.length})
        </button>
        {isArtist && (
          <button
            className={`filter-chip ${activeFilter === "my-uploads" ? "active" : ""}`}
            onClick={() => setActiveFilter("my-uploads")}
          >
            My Uploads ({myUploads.length})
          </button>
        )}
      </div>

      {/* Liked Songs Hero Banner (shown when Liked filter is active or in All) */}
      {(activeFilter === "liked" || activeFilter === "all") && (
        <section className="liked-hero-card">
          <div className="liked-hero-cover">
            <Heart size={48} fill="white" />
          </div>
          <div className="liked-hero-details">
            <span className="hero-badge">PLAYLIST</span>
            <h2>Liked Songs</h2>
            <div className="liked-hero-meta">
              <span className="avatar-sm">
                {user?.username ? user.username.charAt(0).toUpperCase() : "S"}
              </span>
              <span className="user-name">
                {user?.username || "Sonora Listener"}
              </span>
              <span className="bullet">•</span>
              <span>{likedSongs.length} songs</span>
            </div>
            <div className="liked-hero-actions">
              <button
                className="big-play-pill"
                onClick={handlePlayLikedSongs}
                disabled={likedSongs.length === 0}
                aria-label="Play liked songs"
              >
                <Play size={20} fill="currentColor" />
                <span>Play All</span>
              </button>
              <button
                className="circle-icon-btn"
                onClick={toggleShuffle}
                title="Shuffle"
              >
                <Shuffle size={18} />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Tracks List Table */}
      {(activeFilter === "liked" || activeFilter === "all" || activeFilter === "my-uploads") && (
        <section className="library-tracks-table-section">
          <div className="tracks-table-header">
            <span className="col-num">#</span>
            <span className="col-title">Title</span>
            <span className="col-artist">Artist</span>
            <span className="col-fav" />
            <span className="col-time">
              <Clock3 size={15} />
            </span>
          </div>

          <div className="tracks-table-body">
            {(activeFilter === "liked"
              ? likedSongs
              : activeFilter === "my-uploads"
              ? myUploads
              : songs
            ).length === 0 ? (
              <div className="empty-library-state">
                <Music2 size={36} />
                <p>
                  {activeFilter === "liked"
                    ? "Songs you like will appear here. Tap the heart on any song to save it!"
                    : activeFilter === "my-uploads"
                    ? "You haven't uploaded any tracks yet. Click 'Upload to Studio' to release your first song!"
                    : "Your library is empty. Discover tracks in Home or Search!"}
                </p>
              </div>
            ) : (
              (activeFilter === "liked"
                ? likedSongs
                : activeFilter === "my-uploads"
                ? myUploads
                : songs
              ).map((song, index) => {
                const isThisTrackPlaying =
                  isPlaying && currentTrack?.id === song.id;
                const liked = isLiked(song.id);

                return (
                  <div
                    className={`library-track-row ${isThisTrackPlaying ? "active-row" : ""}`}
                    key={song.id}
                    onClick={() =>
                      playTrack(
                        song,
                        activeFilter === "liked" ? likedSongs : songs
                      )
                    }
                  >
                    <span className="track-number">
                      {isThisTrackPlaying ? (
                        <div className="table-eq">
                          <span className="eq-bar bar1" />
                          <span className="eq-bar bar2" />
                          <span className="eq-bar bar3" />
                        </div>
                      ) : (
                        String(index + 1).padStart(2, "0")
                      )}
                    </span>

                    <div className="track-col-info">
                      <div
                        className="track-col-art"
                        style={{ background: song.color }}
                      >
                        {song.artwork ? (
                          <img
                            src={song.artwork}
                            alt={song.title}
                            className="track-col-img"
                            onError={(e) => { e.currentTarget.style.display = "none"; }}
                          />
                        ) : (
                          <Music2 size={16} />
                        )}
                        <span className="row-play-icon">
                          {isThisTrackPlaying ? (
                            <Pause size={14} fill="currentColor" />
                          ) : (
                            <Play size={14} fill="currentColor" />
                          )}
                        </span>
                      </div>
                      <span className="track-col-title">{song.title}</span>
                    </div>

                    <span className="track-col-artist">{song.artist}</span>

                    <div className="track-col-fav">
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

                    <span className="track-col-time">3:42</span>
                  </div>
                );
              })
            )}
          </div>
        </section>
      )}

      {/* Albums Grid View (when Albums or All filter is active) */}
      {(activeFilter === "albums" || activeFilter === "all") && (
        <section className="library-albums-section">
          <div className="section-heading">
            <h2>Albums in your collection</h2>
          </div>

          {albums.length === 0 ? (
            <div className="empty-library-state">
              <Disc3 size={36} />
              <p>No albums released yet. Artists can release albums from the Studio.</p>
            </div>
          ) : (
            <div className="album-grid">
              {albums.map((album, idx) => (
                <div
                  className="album-card"
                  key={album._id || album.id}
                  onClick={() => navigate(`/album/${album._id || album.id}`)}
                >
                  <div className="album-art album-vinyl-art">
                    <Disc3 size={44} strokeWidth={1.5} />
                    <span className="album-play">
                      <Play size={20} fill="currentColor" />
                    </span>
                  </div>
                  <div className="album-card-body">
                    <span className="album-title">{album.title}</span>
                    <span className="album-artist">
                      By {album.artist?.username || "Sonora Artist"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </main>
  );
}
