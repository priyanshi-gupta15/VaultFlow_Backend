import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

// Add interceptor to include JWT token in requests
api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('vaultflow_user') || 'null');
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export default api;
