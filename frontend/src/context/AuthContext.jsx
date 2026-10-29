// frontend/src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Load token & user from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('authUser');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.token) {
          setUser(parsed);
          api.defaults.headers.common['Authorization'] = `Bearer ${parsed.token}`;
        }
      }
    } catch (err) {
      console.error('Failed to parse auth token from localStorage', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      const role = data.user?.role || data.role;
      const id = data.user?.id || data.id;
      const userEmail = data.user?.email || email;

      const authUser = { token: data.token, role, id, email: userEmail };
      setUser(authUser);
      api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      localStorage.setItem('authUser', JSON.stringify(authUser));
      return { success: true, role };
    } catch (err) {
      console.error('Login error:', err);
      return {
        success: false,
        message: err.response?.data?.message || 'Invalid email or password. Please try again.',
      };
    }
  };

  const register = async (payload) => {
    try {
      const { data } = await api.post('/auth/register', payload);
      const role = data.user?.role || data.role || payload.role;
      const id = data.user?.id || data.id;
      const userEmail = data.user?.email || payload.email;

      const authUser = { token: data.token, role, id, email: userEmail };
      setUser(authUser);
      api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      localStorage.setItem('authUser', JSON.stringify(authUser));
      return { success: true, role };
    } catch (err) {
      console.error('Registration error:', err);
      return {
        success: false,
        message: err.response?.data?.message || 'Registration failed. Please try again.',
      };
    }
  };

  const logout = () => {
    setUser(null);
    delete api.defaults.headers.common['Authorization'];
    localStorage.removeItem('authUser');
    navigate('/login');
  };

  const value = { user, loading, login, register, logout };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
