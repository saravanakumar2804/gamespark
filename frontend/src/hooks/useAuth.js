import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const API = process.env.REACT_APP_API_URL || 'https://gamespark-api.onrender.com';
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true); // TRUE until auth check completes
  const [token, setToken]     = useState(() => localStorage.getItem('gs_token'));

  // On mount: check if stored token is still valid
  useEffect(() => {
    const storedToken = localStorage.getItem('gs_token');
    if (!storedToken) {
      setLoading(false); // No token — not logged in, done
      return;
    }
    // Verify token with backend
    axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
    axios.get(`${API}/api/auth/me`)
      .then(r => {
        setUser(r.data.user);
        setToken(storedToken);
      })
      .catch(() => {
        // Token expired or invalid — clear it
        localStorage.removeItem('gs_token');
        delete axios.defaults.headers.common['Authorization'];
        setToken(null);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const { data } = await axios.post(`${API}/api/auth/login`, { email, password });
    localStorage.setItem('gs_token', data.token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    setToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const register = async (username, email, password) => {
    const { data } = await axios.post(`${API}/api/auth/register`, { username, email, password });
    localStorage.setItem('gs_token', data.token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    setToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('gs_token');
    delete axios.defaults.headers.common['Authorization'];
    setToken(null);
    setUser(null);
  };

  const toggleFavourite = async (gameId) => {
    try {
      const { data } = await axios.post(`${API}/api/auth/favourite`, { gameId });
      setUser(prev => ({ ...prev, favourites: data.favourites }));
    } catch {}
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, toggleFavourite, API }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
