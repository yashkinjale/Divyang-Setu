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

// Add response interceptor for debugging and error handling
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

    // Handle 401 errors (unauthorized) - redirect to login
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/disabled/login';
    }

    return Promise.reject(error);
  }
);

// API endpoints - Updated to match your backend routes
export const donorApi = {
  register: (data) => api.post('/donors/register', data), // ✅ matches backend
  login: (data) => api.post('/donors/login', data),       // ✅ matches backend
  getProfile: () => api.get('/donors/profile'),           // ✅ adjust if you add profile route
};

// Updated disabled API to match your existing profileRoutes.js structure
export const disabledApi = {
  // Auth endpoints (mounted at /api/disabled/)
  register: (data) => api.post('/disabled/register', data),          // POST /api/disabled/register
  login: (data) => api.post('/disabled/login', data),                // POST /api/disabled/login
  
  // Profile endpoints (mounted at /api/disabled/profile/)
  getProfile: () => api.get('/disabled/profile'),                    // GET /api/disabled/profile/ (matches your profileRoutes.js)
  updateProfile: (data) => api.put('/disabled/profile', data),       // PUT /api/disabled/profile/ (matches your profileRoutes.js)
  
  // Profile image endpoints
  uploadProfileImage: (formData) => api.post('/disabled/profile/image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  deleteProfileImage: () => api.delete('/disabled/profile/image'),
  
  // Document endpoints
  uploadDocument: (formData) => api.post('/disabled/profile/documents', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getDocuments: () => api.get('/disabled/profile/documents'),
  deleteDocument: (documentId) => api.delete(`/disabled/profile/documents/${documentId}`),
  
  // Activity endpoint
  getActivity: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/disabled/profile/activity${query ? `?${query}` : ''}`);
  },
};

export const wishlistApi = {
  getAll: () => api.get('/wishlist'),
  getByUser: () => api.get('/wishlist/user'), // If you have user-specific wishlist endpoint
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

// Additional helper functions
export const authHelpers = {
  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return !!(token && user);
  },

  // Get current user
  getCurrentUser: () => {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  },

  // Get token
  getToken: () => {
    return localStorage.getItem('token');
  },

  // Clear auth data
  clearAuth: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Store auth data
  storeAuth: (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
  }
};

export default api