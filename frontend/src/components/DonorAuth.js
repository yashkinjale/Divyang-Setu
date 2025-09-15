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
  CircularProgress,
} from '@mui/material';
import { donorApi } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';

const DonorAuth = ({ isLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('Submitting form data:', formData);
      
      const response = isLogin
        ? await donorApi.login({ email: formData.email, password: formData.password })
        : await donorApi.register(formData);
      
      console.log('API Response:', response);
      console.log('Response data:', response.data);

      // Check different possible response structures
      let donor, token;
      
      if (response.data) {
        // Try different response structures
        if (response.data.donor && response.data.token) {
          donor = response.data.donor;
          token = response.data.token;
        } else if (response.data.user && response.data.token) {
          donor = response.data.user;
          token = response.data.token;
        } else if (response.data.data) {
          // Nested data structure
          donor = response.data.data.donor || response.data.data.user;
          token = response.data.data.token || response.data.token;
        } else {
          // Direct structure
          donor = response.data;
          token = response.data.token || localStorage.getItem('token');
        }
      }

      console.log('Extracted donor:', donor);
      console.log('Extracted token:', token);

      if (!donor) {
        throw new Error('No donor data received from server');
      }

      // Call login from AuthContext
      await login(donor, token);
      
      console.log('Login successful, navigating to dashboard');
      navigate('/donor/dashboard', { replace: true });
      
    } catch (err) {
      console.error('Login/Register error:', err);
      console.error('Error response:', err.response);
      
      let errorMessage = 'An error occurred';
      
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: `linear-gradient(135deg, ${theme.palette.secondary.light} 0%, ${theme.palette.secondary.main} 100%)`,
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
          <VolunteerActivismIcon
            sx={{ fontSize: 40, color: theme.palette.secondary.main, mb: 2 }}
          />
          <Typography component="h1" variant="h4" align="center" gutterBottom>
            {isLogin ? 'Welcome Back!' : 'Join as a Donor'}
          </Typography>
          <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 3 }}>
            {isLogin
              ? 'Sign in to continue making a difference'
              : 'Create an account to start helping others'}
          </Typography>

          {error && (
            <Typography color="error" align="center" sx={{ mb: 2, p: 2, bgcolor: '#ffebee', borderRadius: 1 }}>
              {error}
            </Typography>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            {!isLogin && (
              <TextField
                margin="normal"
                required
                fullWidth
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                autoFocus
                disabled={loading}
              />
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
              disabled={loading}
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
              disabled={loading}
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
                  disabled={loading}
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
                  disabled={loading}
                />
              </>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="secondary"
              size="large"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
              startIcon={loading && <CircularProgress size={20} color="inherit" />}
            >
              {loading ? 'Processing...' : (isLogin ? 'Log In' : 'Create Account')}
            </Button>
            <Box sx={{ textAlign: 'center' }}>
              <Link
                component={RouterLink}
                to={isLogin ? '/donor/register' : '/donor/login'}
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

export default DonorAuth;