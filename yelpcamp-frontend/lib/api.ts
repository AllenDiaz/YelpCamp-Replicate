import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

// Create axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized - clear token and redirect to login
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API Methods
export const authAPI = {
  register: (data: { username: string; email: string; password: string }) =>
    api.post('/api/users/register', data),
  
  login: (data: { username: string; password: string }) =>
    api.post('/api/users/login', data),
  
  logout: () => api.post('/api/users/logout'),
  
  getCurrentUser: () => api.get('/api/users/me'),
};

export const campgroundAPI = {
  getAll: () => api.get('/api/campgrounds'),
  
  getById: (id: string) => api.get(`/api/campgrounds/${id}`),
  
  create: (formData: FormData) =>
    api.post('/api/campgrounds', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  
  update: (id: string, formData: FormData) =>
    api.put(`/api/campgrounds/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  
  delete: (id: string) => api.delete(`/api/campgrounds/${id}`),
};

export const reviewAPI = {
  create: (campgroundId: string, data: { rating: number; body: string }) =>
    api.post(`/api/campgrounds/${campgroundId}/reviews`, { review: data }),
  
  delete: (campgroundId: string, reviewId: string) =>
    api.delete(`/api/campgrounds/${campgroundId}/reviews/${reviewId}`),
};
