// client/src/utils/axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000', // change this if your backend runs on a different port or domain
  // hCredentials: true // allows sending cookies for authentication if needed
});

// Optional: Attach token from localStorage (if you’re using JWT auth)
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // or use context if available
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
