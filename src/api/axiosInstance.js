import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001',
  withCredentials: true, // Important for cookies/JWT in Phase 2
});

export default axiosInstance;
