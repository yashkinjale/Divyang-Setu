import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Set up axios interceptor for authentication
  useEffect(() => {
    const interceptor = axios.interceptors.request.use(
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

    return () => {
      axios.interceptors.request.eject(interceptor);
    };
  }, []);

  // Add response interceptor for handling token expiration
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          logout();
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        
        // Determine user type and validation endpoint
        const userType = parsedUser.type || 'donor'; // Default to donor
        const validationEndpoint = userType === 'donor' 
          ? `${API_BASE_URL}/api/donor/profile`
          : `${API_BASE_URL}/api/disabled/profile`;
        
        // Validate token by making a test request
        axios.get(validationEndpoint, {
          headers: { Authorization: `Bearer ${token}` }
        })
          .then(() => {
            setUser(parsedUser);
          })
          .catch((error) => {
            console.error('Token validation failed:', error);
            // If token validation fails, clear storage
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          })
          .finally(() => {
            setLoading(false);
          });
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const login = (userData, token) => {
    console.log('AuthContext login called with:', { userData, token });
    
    // Determine user type based on the data structure or context
    let userType = 'donor'; // Default to donor
    
    // Try to determine user type from various sources
    if (userData.type) {
      userType = userData.type;
    } else if (userData.disability || userData.disabilityType) {
      userType = 'disabled';
    } else if (userData.address && !userData.disability) {
      userType = 'donor';
    }
    
    // Ensure userData has a type property
    const userWithType = {
      ...userData,
      type: userType,
      id: userData.id || userData._id // Handle both id formats
    };
    
    console.log('Setting user with type:', userWithType);
    
    setUser(userWithType);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userWithType));
    
    console.log('Login successful, user set in AuthContext');
  };

  const logout = () => {
    console.log('Logging out user');
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user,
    userType: user?.type || null
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};