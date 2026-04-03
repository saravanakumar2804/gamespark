import React from 'react';
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
import Leaderboard from './pages/Leaderboard';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div style={{ display: 'flex', minHeight: '100vh' }}>
          <Sidebar />
          <div style={{ flex: 1, marginLeft: 'var(--sidebar-w)', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <main style={{ flex: 1 }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/leaderboard" element={<LeaderboardPage />} />
                <Route path="/category/:cat" element={<CategoryPage />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/about" element={<About />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
