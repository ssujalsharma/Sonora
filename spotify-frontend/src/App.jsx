import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { PlayerProvider, usePlayer } from "./context/PlayerContext";

import Sidebar from "./components/Sidebar";
import TopNav from "./components/TopNav";
import PlayerBar from "./components/PlayerBar";
import AuthModal from "./components/AuthModal";
import ArtistUploadModal from "./components/ArtistUploadModal";
import QueueModal from "./components/QueueModal";

import Home from "./pages/Home";
import SearchPage from "./pages/Search";
import LibraryPage from "./pages/Library";
import AlbumDetail from "./pages/AlbumDetail";

import "./App.css";

function AppContent() {
  const [isArtistModalOpen, setIsArtistModalOpen] = useState(false);
  const [isQueueOpen, setIsQueueOpen] = useState(false);
  const { toastMessage } = usePlayer();
  const { isArtist, openAuth } = useAuth();

  const handleOpenArtistStudio = () => {
    if (!isArtist) {
      openAuth("signup");
      return;
    }
    setIsArtistModalOpen(true);
  };

  return (
    <div className="app-shell">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="global-toast-banner" role="status">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Left Sidebar */}
      <Sidebar onOpenArtistModal={handleOpenArtistStudio} />

      {/* Main Content Area */}
      <div className="main-viewport">
        {/* Top Navbar */}
        <TopNav onOpenArtistModal={handleOpenArtistStudio} />

        {/* Page Routing */}
        <Routes>
          <Route
            path="/"
            element={<Home onOpenArtistModal={handleOpenArtistStudio} />}
          />
          <Route path="/search" element={<SearchPage />} />
          <Route
            path="/library"
            element={<LibraryPage onOpenArtistModal={handleOpenArtistStudio} />}
          />
          <Route path="/album/:id" element={<AlbumDetail />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      {/* Global Bottom Audio Player */}
      <PlayerBar onToggleQueue={() => setIsQueueOpen((prev) => !prev)} />

      {/* Modals & Drawers */}
      <AuthModal />
      <ArtistUploadModal
        isOpen={isArtistModalOpen}
        onClose={() => setIsArtistModalOpen(false)}
      />
      <QueueModal
        isOpen={isQueueOpen}
        onClose={() => setIsQueueOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <PlayerProvider>
        <AppContent />
      </PlayerProvider>
    </AuthProvider>
  );
}
