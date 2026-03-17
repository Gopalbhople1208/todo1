import axios from 'axios';

const API_BASE_URL = 'https://todo1-1-3evz.onrender.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const authAPI = {
  signup: (data) => api.post('/signup', data),
  login: (data) => api.post('/login', data),
  googleLogin: (token) => api.post('/google-login', { token }),
};

// Task APIs
export const taskAPI = {
  getAll: () => api.get('/'),
  getOne: (id) => api.get(`/task/${id}`),
  create: (data) => api.post('/add-task', data),
  update: (id, data) => api.put(`/updateTask/${id}`, data),
  delete: (id) => api.delete(`/deleteTask/${id}`),
};

// Health check
export const healthCheck = () => api.get('/health');

export default api;
