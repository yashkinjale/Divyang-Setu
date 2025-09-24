import React, { useState } from 'react';
import {
  TextField,
  Button,
  Box,
  Typography,
  Container,
  Paper,
  Link,
  useTheme,
} from '@mui/material';
import { disabledApi } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const DisabledAuth = ({ isLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    disabilityType: '',
    needs: ''
  });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = isLogin
        ? await disabledApi.login(formData)
        : await disabledApi.register(formData);
      
      console.log('Auth response:', response); // Debug log
      
      if (response.data && response.data.token) {
        // Ensure user data has the correct type
        const userData = {
          ...response.data.user || response.data.disabled,
          type: 'disabled'
        };
        
        console.log('User data to store:', userData); // Debug log
        
        // Store user data and token
        login(userData, response.data.token);
        
        // Add a small delay to ensure state is updated
        setTimeout(() => {
          // Navigate to dashboard
          navigate('/disabled/dashboard', { replace: true });
        }, 100);
      } else {
        console.error('Invalid response:', response); // Debug log
        setError('Invalid response from server');
      }
    } catch (err) {
      console.error('Auth error:', err);
      if (err.response) {
        console.error('Error response:', err.response); // Debug log
        setError(err.response.data?.message || 'Authentication failed');
      } else if (err.request) {
        console.error('Error request:', err.request); // Debug log
        setError('No response from server');
      } else {
        setError('An error occurred during authentication');
      }
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
        py: 4,
      }}
    >
      <Container component="main" maxWidth="sm">
        <Paper
          elevation={3}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <AccessibilityNewIcon
            sx={{ fontSize: 40, color: theme.palette.primary.main, mb: 2 }}
          />
          <Typography component="h1" variant="h4" align="center" gutterBottom>
            {isLogin ? 'Welcome Back!' : 'Join DivyangSetu'}
          </Typography>
          <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 3 }}>
            {isLogin
              ? 'Sign in to access support and connect with donors'
              : 'Create an account to receive the help you need'}
          </Typography>

          {error && (
            <Typography color="error" align="center" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            {!isLogin && (
              <>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  autoFocus
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="Type of Disability"
                  name="disabilityType"
                  value={formData.disabilityType}
                  onChange={handleChange}
                  helperText="Please specify your disability type"
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="Your Needs"
                  name="needs"
                  multiline
                  rows={3}
                  value={formData.needs}
                  onChange={handleChange}
                  helperText="Please describe what kind of support you need"
                />
              </>
            )}
            <TextField
              margin="normal"
              required
              fullWidth
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              autoFocus={isLogin}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
            />
            {!isLogin && (
              <>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="Phone Number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  multiline
                  rows={2}
                />
              </>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              sx={{ mt: 3, mb: 2 }}
            >
              {isLogin ? 'Log In' : 'Create Account'}
            </Button>
            <Box sx={{ textAlign: 'center' }}>
              <Link
                component={RouterLink}
                to={isLogin ? '/disabled/register' : '/disabled/login'}
                variant="body2"
                sx={{ textDecoration: 'none' }}
              >
                {isLogin
                  ? "Don't have an account? Sign Up"
                  : 'Already have an account? Sign In'}
              </Link>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default DisabledAuth; 