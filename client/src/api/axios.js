import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5005/api',
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
