import React, { useState } from 'react';
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
import { Privacy, About, CategoryPage, NotFound, Leaderboard as LeaderboardPage } from './pages/Leaderboard';

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AuthProvider>
      <BrowserRouter>
        <div style={{ display: 'flex', minHeight: '100vh', position: 'relative' }}>

          {/* ── Mobile overlay — clicking it closes sidebar ── */}
          {sidebarOpen && (
            <div
              onClick={() => setSidebarOpen(false)}
              style={{
                position: 'fixed', inset: 0,
                background: 'rgba(0,0,0,0.55)',
                zIndex: 190,
                // Only show on mobile
              }}
              className="mobile-overlay"
            />
          )}

          {/* ── Sidebar ── */}
          <Sidebar
            open={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />

          {/* ── Main content ── */}
          <div style={{
            flex: 1,
            // On desktop: push right of sidebar. On mobile: full width (CSS handles this)
            marginLeft: 'var(--sidebar-w)',
            display: 'flex',
            flexDirection: 'column',
            minWidth: 0,
          }} className="main-content">
            <Navbar onMenuClick={() => setSidebarOpen(o => !o)} />
            <main style={{ flex: 1 }}>
              <Routes>
                <Route path="/"              element={<Home />} />
                <Route path="/login"         element={<Login />} />
                <Route path="/register"      element={<Register />} />
                <Route path="/profile"       element={<Profile />} />
                <Route path="/admin"         element={<Admin />} />
                <Route path="/leaderboard"   element={<LeaderboardPage />} />
                <Route path="/category/:cat" element={<CategoryPage />} />
                <Route path="/privacy"       element={<Privacy />} />
                <Route path="/about"         element={<About />} />
                <Route path="/feedback"      element={<Feedback />} />
                <Route path="/my-games"      element={<MyGames />} />
                <Route path="*"              element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </div>

        {/* Global responsive styles */}
        <style>{`
          :root { --sidebar-w: 240px; }
          @media (max-width: 768px) {
            :root { --sidebar-w: 0px; }
            .main-content { margin-left: 0 !important; }
          }
        `}</style>
      </BrowserRouter>
    </AuthProvider>
  );
}
