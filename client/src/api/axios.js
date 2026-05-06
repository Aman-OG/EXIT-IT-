import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5005/api',
  withCredentials: true, // Crucial for sending HTTP-only cookies
});

export default api;
