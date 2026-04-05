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
import { Privacy, About, CategoryPage, NotFound, Leaderboard as LeaderboardPage } from './pages/Leaderboard';

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AuthProvider>
      <BrowserRouter>
        <div style={{ display: 'flex', minHeight: '100vh' }}>

          {/* Mobile sidebar overlay */}
          {sidebarOpen && (
            <div
              onClick={() => setSidebarOpen(false)}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 150 }}
            />
          )}

          {/* Sidebar — hidden on mobile via CSS, shown when open */}
          <div style={{
            position: 'fixed', top: 0, left: 0, zIndex: 200, height: '100vh',
            transform: sidebarOpen ? 'translateX(0)' : undefined,
            // On desktop always visible via CSS sidebar-w variable
          }}>
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </div>

          {/* Main content */}
          <div
            className="main-wrapper"
            style={{ flex: 1, marginLeft: 'var(--sidebar-w)', display: 'flex', flexDirection: 'column', minWidth: 0 }}
          >
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
                <Route path="*"              element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
