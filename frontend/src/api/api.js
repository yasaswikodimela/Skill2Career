// frontend/src/api/api.js
import axios from 'axios';

// Base URL from Vite env var with fallback to localhost
let rawBase = import.meta.env.VITE_API_URL || 'http://localhost:5000';
if (rawBase.endsWith('/')) {
  rawBase = rawBase.slice(0, -1);
}
const baseURL = rawBase.endsWith('/api') ? rawBase : `${rawBase}/api`;

const api = axios.create({
  baseURL,
  withCredentials: true,
});

// Optionally add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
