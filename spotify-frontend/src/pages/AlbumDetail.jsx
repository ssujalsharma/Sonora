import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Play,
  Pause,
  Disc3,
  Music2,
  Clock3,
  Heart,
  Share2,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import api from "../services/api";
import { usePlayer } from "../context/PlayerContext";

export default function AlbumDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentTrack, isPlaying, playTrack, toggleLike, isLiked, showToast } =
    usePlayer();

  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchAlbum() {
      setLoading(true);
      try {
        const res = await api.get(`/music/albums/${id}`);
        if (res.data?.album) {
          setAlbum(res.data.album);
        } else {
          setError("Album not found.");
        }
      } catch (err) {
        setError("Could not load album details.");
      } finally {
        setLoading(false);
      }
    }
    if (id) {
      fetchAlbum();
    }
  }, [id]);

  const albumTracks = (album?.musics || []).map((m, idx) => ({
    id: m._id || m.id,
    _id: m._id || m.id,
    title: m.title,
    artist: album.artist?.username || "Sonora Artist",
    uri: m.uri,
    color: ["#254d43", "#79552e", "#593b65", "#304f79"][idx % 4],
  }));

  const handlePlayAlbum = () => {
    if (albumTracks.length > 0) {
      playTrack(albumTracks[0], albumTracks);
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast("Album link copied to clipboard!");
    }
  };

  const isCurrentAlbumPlaying =
    isPlaying &&
    albumTracks.some((t) => t.id === currentTrack?.id);

  if (loading) {
    return (
      <main className="main-content">
        <div className="album-loading-state">
          <Disc3 size={48} className="spinning-disc" />
          <p>Loading album details...</p>
        </div>
      </main>
    );
  }

  if (error || !album) {
    return (
      <main className="main-content">
        <button className="back-link-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={16} /> Back
        </button>
        <div className="empty-card-panel">
          <Disc3 size={40} />
          <h2>{error || "Album not found"}</h2>
          <p>The album you are looking for might have been removed or is unavailable.</p>
          <button className="pill-action-btn" onClick={() => navigate("/")}>
            Return to Home
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="main-content album-detail-view" id="album-view">
      {/* Back button */}
      <button className="back-link-btn" onClick={() => navigate(-1)}>
        <ArrowLeft size={16} /> Back
      </button>

      {/* Album Header Banner */}
      <section className="album-hero-header">
        <div className="album-hero-art">
          <Disc3 size={72} strokeWidth={1.5} />
          {isCurrentAlbumPlaying && <span className="hero-spinning-indicator" />}
        </div>

        <div className="album-hero-meta">
          <span className="album-type-badge">ALBUM</span>
          <h1 className="album-main-title">{album.title}</h1>

          <div className="album-creator-row">
            <span className="creator-avatar">
              {album.artist?.username
                ? album.artist.username.charAt(0).toUpperCase()
                : "A"}
            </span>
            <span className="creator-name">
              {album.artist?.username || "Verified Artist"}
            </span>
            <span className="bullet">•</span>
            <span className="album-stat">{albumTracks.length} tracks</span>
            <span className="bullet">•</span>
            <span className="album-stat">Sonora Music</span>
          </div>
        </div>
      </section>

      {/* Action Bar */}
      <section className="album-action-bar">
        <button
          className="album-giant-play-btn"
          onClick={handlePlayAlbum}
          aria-label={isCurrentAlbumPlaying ? "Pause album" : "Play album"}
          id="album-play-all-btn"
        >
          {isCurrentAlbumPlaying ? (
            <Pause size={28} fill="currentColor" />
          ) : (
            <Play size={28} fill="currentColor" style={{ marginLeft: "3px" }} />
          )}
        </button>

        <button
          className="circle-icon-btn"
          onClick={handleShare}
          title="Share album"
        >
          <Share2 size={20} />
        </button>
      </section>

      {/* Album Tracks Table */}
      <section className="album-tracklist-section">
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
          {albumTracks.length === 0 ? (
            <p className="empty-search">This album currently has no tracks.</p>
          ) : (
            albumTracks.map((song, index) => {
              const isThisTrackPlaying =
                isPlaying && currentTrack?.id === song.id;
              const liked = isLiked(song.id);

              return (
                <div
                  className={`library-track-row ${isThisTrackPlaying ? "active-row" : ""}`}
                  key={song.id}
                  onClick={() => playTrack(song, albumTracks)}
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
                      <Music2 size={16} />
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

                  <span className="track-col-time">3:28</span>
                </div>
              );
            })
          )}
        </div>
      </section>
    </main>
  );
}
