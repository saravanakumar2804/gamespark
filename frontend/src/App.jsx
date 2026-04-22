import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import Feedback from './pages/Feedback';
import MyGames from './pages/MyGames';
import Multiplayer from './pages/Multiplayer';
import SeoPage from './pages/SeoPage';
import DirectPlay from './pages/DirectPlay';
import OfflinePage from './components/OfflinePage';
import { Privacy, About, CategoryPage, NotFound, Leaderboard as LeaderboardPage } from './pages/Leaderboard';

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isOffline, setIsOffline]     = useState(!navigator.onLine);

  useEffect(() => {
    const goOffline = () => setIsOffline(true);
    const goOnline  = () => setIsOffline(false);
    window.addEventListener('offline', goOffline);
    window.addEventListener('online',  goOnline);
    return () => { window.removeEventListener('offline', goOffline); window.removeEventListener('online', goOnline); };
  }, []);

  if (isOffline) return <OfflinePage onRetry={() => { if (navigator.onLine) setIsOffline(false); }} />;

  return (
    <AuthProvider>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <div style={{ display: 'flex', minHeight: '100vh', position: 'relative' }}>

          {/* OVERLAY — plain black only, NO backdropFilter ever */}
          {sidebarOpen && (
            <div
              onClick={() => setSidebarOpen(false)}
              style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 150 }}
            />
          )}

          <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

          <div style={{ flex: 1, marginLeft: 'var(--sidebar-w)', display: 'flex', flexDirection: 'column', minWidth: 0 }}>
            <Navbar onMenuClick={() => setSidebarOpen(o => !o)} />
            <main style={{ flex: 1 }}>
              <Routes>
                <Route path="/"              element={<Home />} />
                <Route path="/login"         element={<Login />} />
                <Route path="/register"      element={<Register />} />
                <Route path="/profile"       element={<Profile />} />
                <Route path="/admin"         element={<Admin />} />
                <Route path="/leaderboard"   element={<LeaderboardPage />} />
                <Route path="/multiplayer"   element={<Multiplayer />} />
                <Route path="/category/:cat" element={<CategoryPage />} />
                <Route path="/privacy"       element={<Privacy />} />
                <Route path="/about"         element={<About />} />
                <Route path="/feedback"      element={<Feedback />} />
                <Route path="/my-games"      element={<MyGames />} />
                {/* SEO pages — 60+ keyword-targeted URLs */}
                <Route path="/games/:slug"   element={<SeoPage />} />
                {/* Direct play — for challenge links shared by users */}
                <Route path="/play/:gameId"  element={<DirectPlay />} />
                <Route path="*"              element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </div>
        <style>{`
          :root { --sidebar-w: 240px; }
          @media (max-width: 768px) { :root { --sidebar-w: 0px; } }
        `}</style>
      </BrowserRouter>
    </AuthProvider>
  );
}
