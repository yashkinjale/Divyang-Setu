import axios from 'axios';

// Production-ready API URL configuration
const getApiUrl = () => {
  // Use environment variable if available, otherwise fall back to current host
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  
  // Production fallback: use the same domain as the app
  if (process.env.NODE_ENV === 'production') {
    return `${window.location.protocol}//${window.location.host}/api`;
  }
  
  // Development fallback
  return 'http://localhost:5000/api';
};

const API_URL = getApiUrl();

// Axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // Increased from 10s to 30s for MongoDB Atlas initial connection
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Only log in development
    if (process.env.NODE_ENV === 'development') {
      console.log('API Request:', {
        url: config.url,
        method: config.method,
        headers: config.headers,
        data: config.data,
        baseURL: config.baseURL,
      });
    }
    
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('API Response:', {
        url: response.config.url,
        status: response.status,
        data: response.data,
      });
    }
    return response;
  },
  (error) => {
    if (process.env.NODE_ENV === 'development') {
      console.error('API Response Error:', {
        url: error.config?.url,
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
    }

    // Handle 401 Unauthorized - redirect to login
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/disabled/login';
    }

    return Promise.reject(error);
  }
);

// Donor API
export const donorApi = {
  register: (data) => api.post('/donors/register', data),
  login: (data) => api.post('/donors/login', data),
  getProfile: () => api.get('/donors/profile'),
};

// Disabled / PWD API
export const disabledApi = {
  register: (data) => api.post('/disabled/register', data),
  login: (data) => api.post('/disabled/login', data),
  getProfile: () => api.get('/disabled/profile'),
  updateProfile: (data) => api.put('/disabled/profile', data),
  getPublicProfiles: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/disabled/profile/public${query ? `?${query}` : ''}`);
  },
  uploadProfileImage: (formData) =>
    api.post('/disabled/profile/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  deleteProfileImage: () => api.delete('/disabled/profile/image'),
  uploadDocument: (formData) =>
    api.post('/disabled/profile/documents', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  getDocuments: () => api.get('/disabled/profile/documents'),
  deleteDocument: (documentId) =>
    api.delete(`/disabled/profile/documents/${documentId}`),
  getActivity: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/disabled/profile/activity${query ? `?${query}` : ''}`);
  },
};

// Wishlist API
export const wishlistApi = {
  getAll: () => api.get('/wishlist'),
  getByUser: () => api.get('/wishlist/user'),
  create: (data) => api.post('/wishlist', data),
  update: (id, data) => api.patch(`/wishlist/${id}`, data),
  delete: (id) => api.delete(`/wishlist/${id}`),
  uploadDocuments: (id, formData) =>
    api.post(`/wishlist/${id}/documents`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

// Schemes API
export const schemesApi = {
  getAll: () => api.get('/schemes'),
};

// Jobs API
export const jobApi = {
  getJobs: (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.query) queryParams.append('query', params.query);
    if (params.location) queryParams.append('location', params.location);
    if (params.page) queryParams.append('page', params.page);
    if (params.num_pages) queryParams.append('num_pages', params.num_pages);

    const url = `/jobs${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return api.get(url);
  },
};

// Donations API
export const donationApi = {
  createOrder: (data) => api.post('/donations/create-order', data),
  verifyPayment: (data) => api.post('/donations/verify-payment', data),
  getHistory: (pwdId) => api.get(`/donations/history/${pwdId}`),
  getMyDonations: () => api.get('/donations/my-donations'),
  getStats: (pwdId) => api.get(`/donations/stats/${pwdId}`),
};

// Auth helpers
export const authHelpers = {
  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return !!(token && user);
  },
  getCurrentUser: () => {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  },
  getToken: () => localStorage.getItem('token'),
  clearAuth: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  storeAuth: (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
  },
};

export default api;