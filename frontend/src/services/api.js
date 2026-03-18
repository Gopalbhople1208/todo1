// import axios from 'axios';

// const API_BASE_URL = 'https://todo1-1-3evz.onrender.com';

// const api = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   withCredentials: true,
// });

// // Add token to requests
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// // Auth APIs
// export const authAPI = {
//   signup: (data) => api.post('/signup', data),
//   login: (data) => api.post('/login', data),
//   googleLogin: (token) => api.post('/google-login', { token }),
// };

// // Task APIs
// export const taskAPI = {
//   getAll: () => api.get('/'),
//   getOne: (id) => api.get(`/task/${id}`),
//   create: (data) => api.post('/add-task', data),
//   update: (id, data) => api.put(`/updateTask/${id}`, data),
//   delete: (id) => api.delete(`/deleteTask/${id}`),
// };



// // Health check
// export const healthCheck = () => api.get('/health');

// export default api;








import axios from 'axios';

// Tip: Use your Vercel URL here if you are moving away from Render
const API_BASE_URL = 'https://todo1-qtld.vercel.app';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Interceptor to attach the JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs - Separated to avoid naming collisions
export const authAPI = {
  signup: (data) => api.post('/signup', data),
  login: (data) => api.post('/login', data),
  googleLogin: (token) => api.post('/google-login', { token }),
};

/** * Task APIs 
 * Note: These now rely on the 'authenticate' middleware 
 * you added to your backend to filter data by user.
 */
export const taskAPI = {
  getAll: () => api.get('/'), // Returns tasks for the logged-in user only
  getOne: (id) => api.get(`/task/${id}`),
  create: (taskData) => api.post('/add-task', taskData), // Backend will tag this with userEmail
  update: (id, taskData) => api.put(`/updateTask/${id}`, taskData),
  delete: (id) => api.delete(`/deleteTask/${id}`),
};

// Health check
export const healthCheck = () => api.get('/health');

// Exporting the base api instance as default
export default api;