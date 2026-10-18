import React from "react";
import { X, Play, Music2, ListMusic, Volume2 } from "lucide-react";
import { usePlayer } from "../context/PlayerContext";

export default function QueueModal({ isOpen, onClose }) {
  const { currentTrack, playlist, isPlaying, playTrack } = usePlayer();

  if (!isOpen) return null;

  const currentIndex = playlist.findIndex((s) => s.id === currentTrack?.id);
  const upNext =
    currentIndex >= 0
      ? playlist.slice(currentIndex + 1)
      : playlist;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="queue-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        id="queue-dialog"
      >
        <div className="queue-header">
          <div className="queue-title-group">
            <ListMusic size={22} />
            <h2>Play Queue</h2>
          </div>
          <button
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close queue"
          >
            <X size={20} />
          </button>
        </div>

        {/* Currently Playing Card */}
        {currentTrack && (
          <div className="queue-now-playing-box">
            <span className="queue-section-label">Now Playing</span>
            <div className="queue-item current">
              <div
                className="queue-item-art"
                style={{ background: currentTrack.color }}
              >
                <Music2 size={20} />
              </div>
              <div className="queue-item-info">
                <span className="queue-item-title">{currentTrack.title}</span>
                <span className="queue-item-artist">{currentTrack.artist}</span>
              </div>
              {isPlaying && (
                <div className="queue-equalizer">
                  <span className="eq-bar bar1" />
                  <span className="eq-bar bar2" />
                  <span className="eq-bar bar3" />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Up Next List */}
        <div className="queue-next-section">
          <span className="queue-section-label">Up Next ({upNext.length})</span>
          {upNext.length === 0 ? (
            <p className="empty-queue-text">
              No more tracks in queue. Pick another playlist or album!
            </p>
          ) : (
            <div className="queue-list">
              {upNext.map((song, i) => (
                <button
                  key={`${song.id}-${i}`}
                  className="queue-item"
                  onClick={() => playTrack(song, playlist)}
                >
                  <span className="queue-index">{i + 1}</span>
                  <div
                    className="queue-item-art"
                    style={{ background: song.color }}
                  >
                    <Music2 size={18} />
                  </div>
                  <div className="queue-item-info">
                    <span className="queue-item-title">{song.title}</span>
                    <span className="queue-item-artist">{song.artist}</span>
                  </div>
                  <Play size={16} className="queue-play-hover" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
