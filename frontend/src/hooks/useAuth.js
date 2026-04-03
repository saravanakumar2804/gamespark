import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('gs_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      axios.get(`${API}/api/auth/me`)
        .then(r => setUser(r.data.user))
        .catch(() => { localStorage.removeItem('gs_token'); setToken(null); })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

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
    const { data } = await axios.post(`${API}/api/auth/favourite`, { gameId });
    setUser(prev => ({ ...prev, favourites: data.favourites }));
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, toggleFavourite, API }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
