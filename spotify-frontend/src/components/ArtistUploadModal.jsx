import React, { useState } from "react";
import {
  X,
  UploadCloud,
  Disc3,
  Music2,
  FileAudio,
  Link2,
  Check,
  AlertCircle,
} from "lucide-react";
import api from "../services/api";
import { usePlayer } from "../context/PlayerContext";

export default function ArtistUploadModal({ isOpen, onClose }) {
  const { songs, fetchMusicData, showToast } = usePlayer();

  const [activeTab, setActiveTab] = useState("song"); // "song" | "album"
  const [songTitle, setSongTitle] = useState("");
  const [uploadMode, setUploadMode] = useState("file"); // "file" | "url"
  const [audioFile, setAudioFile] = useState(null);
  const [audioUrl, setAudioUrl] = useState("");
  const [albumTitle, setAlbumTitle] = useState("");
  const [selectedMusicIds, setSelectedMusicIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSongUpload = async (e) => {
    e.preventDefault();
    setError("");

    if (!songTitle.trim()) {
      setError("Please provide a song title.");
      return;
    }

    if (uploadMode === "file" && !audioFile) {
      setError("Please select an audio file.");
      return;
    }

    if (uploadMode === "url" && !audioUrl.trim()) {
      setError("Please enter a valid audio URL.");
      return;
    }

    setLoading(true);

    try {
      if (uploadMode === "file") {
        const formData = new FormData();
        formData.append("title", songTitle);
        formData.append("music", audioFile);

        await api.post("/music/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        await api.post("/music/upload", {
          title: songTitle,
          uri: audioUrl,
        });
      }

      showToast(`Track "${songTitle}" uploaded successfully!`);
      setSongTitle("");
      setAudioFile(null);
      setAudioUrl("");
      await fetchMusicData();
      onClose();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Upload failed. Ensure you are logged in as an artist."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAlbum = async (e) => {
    e.preventDefault();
    setError("");

    if (!albumTitle.trim()) {
      setError("Please provide an album title.");
      return;
    }

    if (selectedMusicIds.length === 0) {
      setError("Please select at least one song for the album.");
      return;
    }

    setLoading(true);

    try {
      await api.post("/music/album", {
        title: albumTitle,
        musics: selectedMusicIds,
      });

      showToast(`Album "${albumTitle}" created successfully!`);
      setAlbumTitle("");
      setSelectedMusicIds([]);
      await fetchMusicData();
      onClose();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to create album. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleSelectMusic = (id) => {
    setSelectedMusicIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="artist-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        id="artist-studio-dialog"
      >
        <button
          className="modal-close-btn"
          onClick={onClose}
          aria-label="Close dialog"
        >
          <X size={20} />
        </button>

        <div className="artist-modal-header">
          <div className="artist-header-badge">
            <UploadCloud size={26} />
          </div>
          <h2>Artist Studio</h2>
          <p>Publish your audio tracks and curate new albums on Sonora.</p>
        </div>

        {/* Tab switcher */}
        <div className="artist-tabs">
          <button
            type="button"
            className={`artist-tab ${activeTab === "song" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("song");
              setError("");
            }}
          >
            <Music2 size={18} />
            <span>Upload Song</span>
          </button>
          <button
            type="button"
            className={`artist-tab ${activeTab === "album" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("album");
              setError("");
            }}
          >
            <Disc3 size={18} />
            <span>Create Album</span>
          </button>
        </div>

        {error && <div className="auth-error-banner">{error}</div>}

        {activeTab === "song" && (
          <form onSubmit={handleSongUpload} className="artist-form">
            <div className="form-group">
              <label htmlFor="song-title">Song Title</label>
              <input
                id="song-title"
                type="text"
                placeholder="e.g. Neon Horizon"
                value={songTitle}
                onChange={(e) => setSongTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Audio Source Method</label>
              <div className="source-toggle">
                <button
                  type="button"
                  className={`source-btn ${uploadMode === "file" ? "active" : ""}`}
                  onClick={() => setUploadMode("file")}
                >
                  <FileAudio size={16} />
                  <span>Upload Audio File</span>
                </button>
                <button
                  type="button"
                  className={`source-btn ${uploadMode === "url" ? "active" : ""}`}
                  onClick={() => setUploadMode("url")}
                >
                  <Link2 size={16} />
                  <span>Audio Stream URL</span>
                </button>
              </div>
            </div>

            {uploadMode === "file" ? (
              <div className="form-group">
                <label>Audio File (MP3, WAV)</label>
                <div className="file-dropzone">
                  <input
                    type="file"
                    accept="audio/*"
                    id="audio-file-input"
                    onChange={(e) => setAudioFile(e.target.files[0])}
                    className="file-hidden-input"
                  />
                  <label htmlFor="audio-file-input" className="file-dropzone-label">
                    <FileAudio size={32} />
                    {audioFile ? (
                      <span className="selected-filename">{audioFile.name}</span>
                    ) : (
                      <>
                        <span className="drop-title">Click to browse audio</span>
                        <span className="drop-hint">MP3, WAV, OGG supported</span>
                      </>
                    )}
                  </label>
                </div>
              </div>
            ) : (
              <div className="form-group">
                <label htmlFor="audio-stream-url">Direct Audio Stream URL</label>
                <input
                  id="audio-stream-url"
                  type="url"
                  placeholder="https://example.com/stream.mp3"
                  value={audioUrl}
                  onChange={(e) => setAudioUrl(e.target.value)}
                  required
                />
              </div>
            )}

            <button
              type="submit"
              className="auth-submit-btn"
              disabled={loading}
              id="upload-track-submit-btn"
            >
              {loading ? "Uploading to Cloud..." : "Publish Track"}
            </button>
          </form>
        )}

        {activeTab === "album" && (
          <form onSubmit={handleCreateAlbum} className="artist-form">
            <div className="form-group">
              <label htmlFor="album-name">Album Title</label>
              <input
                id="album-name"
                type="text"
                placeholder="e.g. Echoes of Midnight"
                value={albumTitle}
                onChange={(e) => setAlbumTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Select Tracks for this Album ({selectedMusicIds.length} selected)</label>
              <div className="album-track-selector">
                {songs.map((song) => {
                  const isSelected = selectedMusicIds.includes(song.id);
                  return (
                    <button
                      type="button"
                      key={song.id}
                      className={`track-selector-item ${isSelected ? "selected" : ""}`}
                      onClick={() => toggleSelectMusic(song.id)}
                    >
                      <div
                        className="track-sel-art"
                        style={{ background: song.color }}
                      >
                        <Music2 size={16} />
                      </div>
                      <div className="track-sel-info">
                        <span className="track-sel-title">{song.title}</span>
                        <span className="track-sel-artist">{song.artist}</span>
                      </div>
                      <div className={`track-checkbox ${isSelected ? "checked" : ""}`}>
                        {isSelected && <Check size={14} />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              className="auth-submit-btn"
              disabled={loading}
              id="create-album-submit-btn"
            >
              {loading ? "Creating Album..." : "Release Album"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
