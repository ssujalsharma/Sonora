import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import api from "../services/api";

const PlayerContext = createContext(null);

const DEFAULT_SONGS = [
  {
    id: "h-1",
    _id: "h-1",
    title: "Kesariya",
    artist: "Arijit Singh, Pritam",
    uri: "/audio/kesariya.m4a",
    artwork: "/covers/kesariya.jpg",
    color: "#ff7700",
    genre: "Bollywood Romance",
    language: "Hindi",
  },
  {
    id: "p-1",
    _id: "p-1",
    title: "Brown Munde",
    artist: "AP Dhillon, Gurinder Gill",
    uri: "/audio/brown_munde.m4a",
    artwork: "/covers/brown_munde.jpg",
    color: "#2a5298",
    genre: "Punjabi Trap",
    language: "Punjabi",
  },
  {
    id: "p-2",
    _id: "p-2",
    title: "Lover",
    artist: "Diljit Dosanjh",
    uri: "/audio/lover.m4a",
    artwork: "/covers/lover.jpg",
    color: "#e84393",
    genre: "Punjabi Pop",
    language: "Punjabi",
  },
  {
    id: "h-2",
    _id: "h-2",
    title: "Apna Bana Le",
    artist: "Arijit Singh, Sachin-Jigar",
    uri: "/audio/apna_bana_le.m4a",
    artwork: "/covers/apna_bana_le.jpg",
    color: "#6c5ce7",
    genre: "Bollywood Romance",
    language: "Hindi",
  },
  {
    id: "p-3",
    _id: "p-3",
    title: "Softly",
    artist: "Karan Aujla, Ikky",
    uri: "/audio/softly.m4a",
    artwork: "/covers/softly.jpg",
    color: "#00b894",
    genre: "Punjabi R&B",
    language: "Punjabi",
  },
  {
    id: "h-3",
    _id: "h-3",
    title: "Tum Hi Ho",
    artist: "Arijit Singh, Mithoon",
    uri: "/audio/tum_hi_ho.m4a",
    artwork: "/covers/tum_hi_ho.jpg",
    color: "#0984e3",
    genre: "Bollywood Classic",
    language: "Hindi",
  },
  {
    id: "p-4",
    _id: "p-4",
    title: "295",
    artist: "Sidhu Moose Wala",
    uri: "/audio/295.m4a",
    artwork: "/covers/295.jpg",
    color: "#d63031",
    genre: "Punjabi Hip-Hop",
    language: "Punjabi",
  },
  {
    id: "h-4",
    _id: "h-4",
    title: "Chaleya",
    artist: "Arijit Singh, Shilpa Rao",
    uri: "/audio/chaleya.m4a",
    artwork: "/covers/chaleya.jpg",
    color: "#fdcb6e",
    genre: "Bollywood Pop",
    language: "Hindi",
  },
  {
    id: "p-5",
    _id: "p-5",
    title: "Born to Shine",
    artist: "Diljit Dosanjh",
    uri: "/audio/born_to_shine.m4a",
    artwork: "/covers/born_to_shine.jpg",
    color: "#e17055",
    genre: "Bhangra Pop",
    language: "Punjabi",
  },
  {
    id: "h-5",
    _id: "h-5",
    title: "Raataan Lambiyan",
    artist: "Jubin Nautiyal, Asees Kaur",
    uri: "/audio/raataan_lambiyan.m4a",
    artwork: "/covers/raataan_lambiyan.jpg",
    color: "#a29bfe",
    genre: "Bollywood Romance",
    language: "Hindi",
  },
  {
    id: "p-6",
    _id: "p-6",
    title: "Tauba Tauba",
    artist: "Karan Aujla",
    uri: "/audio/tauba_tauba.m4a",
    artwork: "/covers/tauba_tauba.jpg",
    color: "#fd79a8",
    genre: "Bhangra Dance",
    language: "Punjabi",
  },
  {
    id: "h-6",
    _id: "h-6",
    title: "Pehle Bhi Main",
    artist: "Vishal Mishra",
    uri: "/audio/pehle_bhi_main.m4a",
    artwork: "/covers/pehle_bhi_main.jpg",
    color: "#00cec9",
    genre: "Soulful Hindi",
    language: "Hindi",
  },
  {
    id: "p-7",
    _id: "p-7",
    title: "Excuses",
    artist: "AP Dhillon, Gurinder Gill",
    uri: "/audio/excuses.m4a",
    artwork: "/covers/excuses.jpg",
    color: "#6c5ce7",
    genre: "Punjabi Lo-Fi",
    language: "Punjabi",
  },
  {
    id: "h-7",
    _id: "h-7",
    title: "Shayad",
    artist: "Arijit Singh, Pritam",
    uri: "/audio/shayad.m4a",
    artwork: "/covers/shayad.jpg",
    color: "#fab1a0",
    genre: "Acoustic Romance",
    language: "Hindi",
  },
  {
    id: "p-8",
    _id: "p-8",
    title: "G.O.A.T.",
    artist: "Diljit Dosanjh",
    uri: "/audio/goat.m4a",
    artwork: "/covers/goat.jpg",
    color: "#ffeaa7",
    genre: "Punjabi Anthem",
    language: "Punjabi",
  },
  {
    id: "h-8",
    _id: "h-8",
    title: "Tere Vaaste",
    artist: "Varun Jain, Sachin-Jigar",
    uri: "/audio/tere_vaaste.m4a",
    artwork: "/covers/tere_vaaste.jpg",
    color: "#55efc4",
    genre: "Trending Bollywood",
    language: "Hindi",
  },
];

const PALETTE = [
  "#ff7700",
  "#2a5298",
  "#e84393",
  "#6c5ce7",
  "#00b894",
  "#0984e3",
  "#d63031",
  "#fdcb6e",
  "#e17055",
  "#a29bfe",
];

export function PlayerProvider({ children }) {
  const audioRef = useRef(new Audio());
  const [songs, setSongs] = useState(DEFAULT_SONGS);
  const [albums, setAlbums] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(DEFAULT_SONGS[0]);
  const [playlist, setPlaylist] = useState(DEFAULT_SONGS);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState("off"); // "off" | "all" | "one"
  const [queueOpen, setQueueOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Liked songs set
  const [likedSongIds, setLikedSongIds] = useState(() => {
    try {
      const saved = localStorage.getItem("spotify_liked_songs");
      return saved ? JSON.parse(saved) : ["h-1", "p-1", "p-2"];
    } catch {
      return ["h-1", "p-1", "p-2"];
    }
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2800);
  };

  const toggleLike = (trackId) => {
    setLikedSongIds((prev) => {
      let updated;
      if (prev.includes(trackId)) {
        updated = prev.filter((id) => id !== trackId);
        showToast("Removed from Liked Songs");
      } else {
        updated = [...prev, trackId];
        showToast("Added to Liked Songs");
      }
      localStorage.setItem("spotify_liked_songs", JSON.stringify(updated));
      return updated;
    });
  };

  const isLiked = (trackId) => likedSongIds.includes(trackId);

  // Fetch backend musics & albums
  const fetchMusicData = useCallback(async () => {
    try {
      const [musicRes, albumRes] = await Promise.allSettled([
        api.get("/music"),
        api.get("/music/albums"),
      ]);

      if (musicRes.status === "fulfilled" && musicRes.value.data?.musics) {
        const backendMusics = musicRes.value.data.musics;
        if (backendMusics.length > 0) {
          const formatted = backendMusics.map((m, idx) => {
            const isPunjabi =
              m.language === "Punjabi" ||
              ["Brown Munde", "Lover", "Softly", "295", "Born to Shine", "Excuses", "Tauba Tauba", "G.O.A.T."].includes(m.title) ||
              ["Diljit Dosanjh", "AP Dhillon", "Karan Aujla", "Sidhu Moose Wala"].includes(m.artist?.username);

            return {
              id: m._id || m.id,
              _id: m._id || m.id,
              title: m.title,
              artist:
                typeof m.artist === "object" && m.artist?.username
                  ? m.artist.username
                  : "Sonora Artist",
              uri: m.uri,
              artwork: m.artwork || `/covers/${m.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.jpg`,
              color: m.color || PALETTE[idx % PALETTE.length],
              genre: m.genre || (isPunjabi ? "Punjabi Hits" : "Hindi Top Hits"),
              language: isPunjabi ? "Punjabi" : "Hindi",
            };
          });
          setSongs(formatted);
          setPlaylist((prevPlaylist) =>
            prevPlaylist.length === DEFAULT_SONGS.length ? formatted : prevPlaylist
          );
        }
      }

      if (albumRes.status === "fulfilled" && albumRes.value.data?.albums) {
        setAlbums(albumRes.value.data.albums);
      }
    } catch (err) {
      console.log("Could not load backend tracks:", err.message);
    }
  }, []);

  useEffect(() => {
    fetchMusicData();
  }, [fetchMusicData]);

  // Handle Audio element events
  useEffect(() => {
    const audio = audioRef.current;
    audio.volume = isMuted ? 0 : volume;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    const handleEnded = () => {
      if (repeatMode === "one") {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      } else {
        nextTrack();
      }
    };

    const handleError = (e) => {
      console.warn("Audio playback error:", e);
      setIsPlaying(false);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
    };
  }, [volume, isMuted, repeatMode]);

  // Clean, robust playTrack function with explicit source switching
  const playTrack = (track, newPlaylist = null) => {
    const audio = audioRef.current;
    if (newPlaylist && Array.isArray(newPlaylist)) {
      setPlaylist(newPlaylist);
    }

    const isSameTrack = currentTrack && (
      (track.id && currentTrack.id === track.id) ||
      (track._id && currentTrack._id === track._id) ||
      (track.title && currentTrack.title === track.title)
    );

    // If the exact same track is clicked, toggle play / pause
    if (isSameTrack) {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        audio
          .play()
          .then(() => setIsPlaying(true))
          .catch((err) => console.log("Play failed:", err));
      }
      return;
    }

    // A different track was clicked: immediately switch source, reset time, and play
    setCurrentTrack(track);
    audio.pause();
    audio.src = track.uri;
    audio.currentTime = 0;
    audio.load();
    audio
      .play()
      .then(() => {
        setIsPlaying(true);
      })
      .catch((err) => {
        console.warn("Audio play error:", err);
      });
  };

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio.src && currentTrack) {
      audio.src = currentTrack.uri;
      audio.load();
    }

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.log("Play error:", err));
    }
  };

  const nextTrack = () => {
    if (playlist.length === 0) return;

    let nextIndex;
    const currentIndex = playlist.findIndex((s) => s.id === currentTrack.id || s._id === currentTrack._id);

    if (isShuffle) {
      nextIndex = Math.floor(Math.random() * playlist.length);
      if (playlist.length > 1 && nextIndex === currentIndex) {
        nextIndex = (nextIndex + 1) % playlist.length;
      }
    } else {
      nextIndex = currentIndex + 1;
      if (nextIndex >= playlist.length) {
        if (repeatMode === "all") {
          nextIndex = 0;
        } else {
          setIsPlaying(false);
          return;
        }
      }
    }

    const nextSong = playlist[nextIndex];
    if (nextSong) {
      setCurrentTrack(nextSong);
      const audio = audioRef.current;
      audio.pause();
      audio.src = nextSong.uri;
      audio.currentTime = 0;
      audio.load();
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    }
  };

  const prevTrack = () => {
    const audio = audioRef.current;
    if (audio.currentTime > 3) {
      audio.currentTime = 0;
      return;
    }

    if (playlist.length === 0) return;
    const currentIndex = playlist.findIndex((s) => s.id === currentTrack.id || s._id === currentTrack._id);
    const prevIndex =
      (currentIndex - 1 + playlist.length) % playlist.length;

    const prevSong = playlist[prevIndex];
    if (prevSong) {
      setCurrentTrack(prevSong);
      audio.pause();
      audio.src = prevSong.uri;
      audio.currentTime = 0;
      audio.load();
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    }
  };

  const seekTo = (seconds) => {
    const audio = audioRef.current;
    audio.currentTime = seconds;
    setCurrentTime(seconds);
  };

  const setVolume = (val) => {
    const normalized = Math.max(0, Math.min(1, val));
    setVolumeState(normalized);
    if (isMuted && normalized > 0) {
      setIsMuted(false);
    }
    audioRef.current.volume = normalized;
  };

  const toggleMute = () => {
    setIsMuted((prev) => {
      const next = !prev;
      audioRef.current.volume = next ? 0 : volume;
      return next;
    });
  };

  const toggleShuffle = () => {
    setIsShuffle((prev) => {
      const next = !prev;
      showToast(next ? "Shuffle on" : "Shuffle off");
      return next;
    });
  };

  const toggleRepeat = () => {
    setRepeatMode((prev) => {
      if (prev === "off") {
        showToast("Repeat all");
        return "all";
      }
      if (prev === "all") {
        showToast("Repeat track");
        return "one";
      }
      showToast("Repeat off");
      return "off";
    });
  };

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        ["input", "textarea"].includes(e.target.tagName.toLowerCase()) ||
        e.target.isContentEditable
      ) {
        return;
      }
      if (e.code === "Space") {
        e.preventDefault();
        togglePlayPause();
      } else if (e.code === "ArrowRight" && e.shiftKey) {
        e.preventDefault();
        nextTrack();
      } else if (e.code === "ArrowLeft" && e.shiftKey) {
        e.preventDefault();
        prevTrack();
      } else if (e.key === "m" || e.key === "M") {
        toggleMute();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  return (
    <PlayerContext.Provider
      value={{
        audioRef,
        songs,
        albums,
        currentTrack,
        playlist,
        isPlaying,
        currentTime,
        duration,
        volume,
        isMuted,
        isShuffle,
        repeatMode,
        queueOpen,
        toastMessage,
        likedSongIds,
        setQueueOpen,
        playTrack,
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
        fetchMusicData,
        showToast,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error("usePlayer must be used within a PlayerProvider");
  }
  return context;
}
