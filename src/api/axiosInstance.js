import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001',
  withCredentials: true, // Required for httpOnly JWT cookie
});

// Global 401 interceptor: if the server rejects our token, clear state and redirect
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Only redirect if not already on the login/register pages
      const publicPaths = ['/login', '/register', '/'];
      if (!publicPaths.includes(window.location.pathname)) {
        // Clear the cookie by calling logout (fire-and-forget)
        axiosInstance.post('/auth/logout').catch(() => {});
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
