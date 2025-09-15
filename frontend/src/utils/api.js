import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Add timeout
  timeout: 10000,
});

// Add request interceptor for debugging and authentication
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('API Request:', {
      url: config.url,
      method: config.method,
      headers: config.headers,
      data: config.data,
      baseURL: config.baseURL
    });
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', {
      url: response.config.url,
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('API Response Error:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    return Promise.reject(error);
  }
);

// API endpoints
export const donorApi = {
  register: (data) => api.post('/donors/register', data),
  login: (data) => api.post('/donors/login', data),
  getProfile: () => api.get('/donors/profile'),
};

export const disabledApi = {
  register: (data) => api.post('/disabled/register', data),
  login: (data) => api.post('/disabled/login', data),
  getProfile: () => api.get('/disabled/profile'),
};

export const wishlistApi = {
  getAll: () => api.get('/wishlist'),
  create: (data) => api.post('/wishlist', data),
  update: (id, data) => api.patch(`/wishlist/${id}`, data),
  delete: (id) => api.delete(`/wishlist/${id}`),
  uploadDocuments: (id, formData) => api.post(`/wishlist/${id}/documents`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
};

export const jobApi = {
  getJobs: (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.query) queryParams.append('query', params.query);
    if (params.location) queryParams.append('location', params.location);
    if (params.page) queryParams.append('page', params.page);
    if (params.num_pages) queryParams.append('num_pages', params.num_pages);
    
    const url = `/jobs${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return api.get(url);
  }
};

export default api; 