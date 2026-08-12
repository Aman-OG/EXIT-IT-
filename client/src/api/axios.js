import axios from 'axios';

export const SERVER_URL = import.meta.env.VITE_API_URL || 'http://localhost:5005';
export const API_BASE_URL = `${SERVER_URL}/api`;

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Crucial for sending HTTP-only cookies
});

// Add auth token from localStorage to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
