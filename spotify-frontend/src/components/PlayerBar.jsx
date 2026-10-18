import React, { useRef } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Volume1,
  VolumeX,
  Heart,
  Shuffle,
  Repeat,
  Repeat1,
  ListMusic,
  Music2,
} from "lucide-react";
import { usePlayer } from "../context/PlayerContext";

function formatTime(seconds) {
  if (isNaN(seconds) || seconds < 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

export default function PlayerBar({ onToggleQueue }) {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isShuffle,
    repeatMode,
    togglePlayPause,
    nextTrack,
    prevTrack,
    seekTo,
    setVolume,
    toggleMute,
    toggleShuffle,
    toggleRepeat,
    toggleLike,
    isLiked,
  } = usePlayer();

  const progressRef = useRef(null);

  const handleSeekClick = (e) => {
    if (!duration || !progressRef.current) return;
    const rect = progressRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, clickX / rect.width));
    seekTo(percentage * duration);
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const currentVolume = isMuted ? 0 : volume;
  const liked = currentTrack ? isLiked(currentTrack.id) : false;

  return (
    <footer className="player" id="global-player">
      {/* Currently Playing Track */}
      <div className="now-playing">
        <div
          className={`now-playing-art ${isPlaying ? "art-active" : ""}`}
          style={{ background: currentTrack?.color || "#254d43" }}
        >
          {currentTrack?.artwork ? (
            <img
              src={currentTrack.artwork}
              alt={currentTrack.title}
              className="now-playing-cover-img"
              onError={(e) => { e.currentTarget.style.display = "none"; }}
            />
          ) : (
            <Music2 size={24} />
          )}
          {isPlaying && <span className="mini-vinyl-spin" />}
        </div>

        <div className="track-info">
          <span className="track-title" title={currentTrack?.title || "No track"}>
            {currentTrack?.title || "Select a track"}
          </span>
          <span className="track-artist" title={currentTrack?.artist || "Sonora Music"}>
            {currentTrack?.artist || "Sonora"}
          </span>
        </div>

        {currentTrack && (
          <button
            className={`subtle-icon like-btn ${liked ? "is-liked" : ""}`}
            onClick={() => toggleLike(currentTrack.id)}
            aria-label={liked ? "Unlike song" : "Like song"}
            title={liked ? "Remove from Liked Songs" : "Save to Liked Songs"}
            id="player-like-btn"
          >
            <Heart
              size={19}
              fill={liked ? "#1ed760" : "none"}
              color={liked ? "#1ed760" : "currentColor"}
            />
          </button>
        )}
      </div>

      {/* Main Controls & Scrubber */}
      <div className="player-center">
        <div className="player-controls">
          {/* Shuffle */}
          <button
            className={`subtle-icon control-btn ${isShuffle ? "active-accent" : ""}`}
            onClick={toggleShuffle}
            aria-label="Toggle shuffle"
            title={isShuffle ? "Disable shuffle" : "Enable shuffle"}
            id="player-shuffle-btn"
          >
            <Shuffle size={18} />
            {isShuffle && <span className="active-dot-indicator" />}
          </button>

          {/* Previous Track */}
          <button
            className="subtle-icon control-btn"
            onClick={prevTrack}
            aria-label="Previous song"
            title="Previous song (Shift+Left)"
            id="player-prev-btn"
          >
            <SkipBack size={20} fill="currentColor" />
          </button>

          {/* Play / Pause */}
          <button
            className="play-button"
            onClick={togglePlayPause}
            aria-label={isPlaying ? "Pause" : "Play"}
            title={isPlaying ? "Pause (Space)" : "Play (Space)"}
            id="player-play-btn"
          >
            {isPlaying ? (
              <Pause size={20} fill="currentColor" />
            ) : (
              <Play size={20} fill="currentColor" style={{ marginLeft: "2px" }} />
            )}
          </button>

          {/* Next Track */}
          <button
            className="subtle-icon control-btn"
            onClick={nextTrack}
            aria-label="Next song"
            title="Next song (Shift+Right)"
            id="player-next-btn"
          >
            <SkipForward size={20} fill="currentColor" />
          </button>

          {/* Repeat */}
          <button
            className={`subtle-icon control-btn ${repeatMode !== "off" ? "active-accent" : ""}`}
            onClick={toggleRepeat}
            aria-label="Toggle repeat"
            title={`Repeat mode: ${repeatMode}`}
            id="player-repeat-btn"
          >
            {repeatMode === "one" ? <Repeat1 size={18} /> : <Repeat size={18} />}
            {repeatMode !== "off" && <span className="active-dot-indicator" />}
          </button>
        </div>

        {/* Progress Bar Row */}
        <div className="progress-row">
          <span className="time-display">{formatTime(currentTime)}</span>
          <div
            className="progress-track"
            ref={progressRef}
            onClick={handleSeekClick}
            title="Seek"
            id="player-progress-bar"
          >
            <div
              className="progress-fill"
              style={{ width: `${progressPercent}%` }}
            />
            <div
              className="progress-thumb"
              style={{ left: `${progressPercent}%` }}
            />
          </div>
          <span className="time-display">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Volume & Extras */}
      <div className="player-volume">
        {/* Animated Equalizer Visualizer */}
        {isPlaying && (
          <div className="live-equalizer-bars" title="Audio playing">
            <span className="bar" />
            <span className="bar" />
            <span className="bar" />
            <span className="bar" />
          </div>
        )}

        {/* Queue Button */}
        <button
          className="subtle-icon"
          onClick={onToggleQueue}
          aria-label="Queue"
          title="Play Queue"
          id="player-queue-btn"
        >
          <ListMusic size={19} />
        </button>

        {/* Mute Button */}
        <button
          className="subtle-icon"
          onClick={toggleMute}
          aria-label={isMuted ? "Unmute" : "Mute"}
          title={isMuted ? "Unmute (M)" : "Mute (M)"}
          id="player-mute-btn"
        >
          {isMuted || currentVolume === 0 ? (
            <VolumeX size={19} />
          ) : currentVolume < 0.5 ? (
            <Volume1 size={19} />
          ) : (
            <Volume2 size={19} />
          )}
        </button>

        {/* Volume Slider */}
        <div className="volume-slider-wrapper">
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={currentVolume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="volume-slider"
            aria-label="Volume level"
            id="player-volume-slider"
          />
        </div>
      </div>
    </footer>
  );
}
