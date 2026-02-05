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
import { donorApi } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
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
        justifyContent: 'center',
        background: `linear-gradient(135deg, ${theme.palette.secondary.light}11 0%, ${theme.palette.secondary.main}22 100%), 
                    radial-gradient(circle at 10% 20%, rgba(216, 241, 230, 0.46) 0.1%, rgba(233, 226, 226, 0.28) 90.1%)`,
        backgroundAttachment: 'fixed',
        py: 4,
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '20%',
          left: '10%',
          width: '300px',
          height: '300px',
          background: `radial-gradient(circle, ${theme.palette.secondary.light}33 0%, transparent 70%)`,
          filter: 'blur(50px)',
          zIndex: 0,
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: '20%',
          right: '10%',
          width: '400px',
          height: '400px',
          background: `radial-gradient(circle, ${theme.palette.secondary.main}22 0%, transparent 70%)`,
          filter: 'blur(60px)',
          zIndex: 0,
        }
      }}
    >
      <Container component="main" maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 5 },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            background: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            borderRadius: '24px',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
          }}
        >
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: `${theme.palette.secondary.main}15`,
              color: theme.palette.secondary.main,
              mb: 3,
              transition: 'transform 0.3s ease-in-out',
              '&:hover': {
                transform: 'scale(1.1) rotate(5deg)',
              }
            }}
          >
            <VolunteerActivismIcon sx={{ fontSize: 32 }} />
          </Box>

          <Typography 
            component="h1" 
            variant="h3" 
            align="center" 
            sx={{ 
              fontWeight: 800, 
              mb: 1,
              background: `linear-gradient(45deg, ${theme.palette.secondary.dark}, ${theme.palette.secondary.main})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.5px'
            }}
          >
            {isLogin ? 'Welcome Back!' : 'Join as a Donor'}
          </Typography>
          
          <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 4, fontWeight: 500 }}>
            {isLogin
              ? 'Sign in to continue making a difference'
              : 'Create an account to start helping others'}
          </Typography>

          {error && (
            <Box 
              sx={{ 
                mb: 3, 
                p: 2, 
                bgcolor: 'rgba(211, 47, 47, 0.05)', 
                borderRadius: '12px',
                border: '1px solid rgba(211, 47, 47, 0.1)',
                width: '100%'
              }}
            >
              <Typography color="error" align="center" variant="body2" sx={{ fontWeight: 600 }}>
                {error}
              </Typography>
            </Box>
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
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    transition: 'all 0.2s',
                    '&:hover': { bgcolor: 'rgba(0,0,0,0.02)' },
                    '&.Mui-focused': { bgcolor: 'white' }
                  }
                }}
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
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  transition: 'all 0.2s',
                  '&:hover': { bgcolor: 'rgba(0,0,0,0.02)' },
                  '&.Mui-focused': { bgcolor: 'white' }
                }
              }}
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
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  transition: 'all 0.2s',
                  '&:hover': { bgcolor: 'rgba(0,0,0,0.02)' },
                  '&.Mui-focused': { bgcolor: 'white' }
                }
              }}
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
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      transition: 'all 0.2s',
                      '&:hover': { bgcolor: 'rgba(0,0,0,0.02)' },
                      '&.Mui-focused': { bgcolor: 'white' }
                    }
                  }}
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
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      transition: 'all 0.2s',
                      '&:hover': { bgcolor: 'rgba(0,0,0,0.02)' },
                      '&.Mui-focused': { bgcolor: 'white' }
                    }
                  }}
                />
              </>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="secondary"
              size="large"
              sx={{ 
                mt: 4, 
                mb: 3, 
                py: 1.8,
                borderRadius: '12px',
                fontSize: '1.1rem',
                fontWeight: 700,
                textTransform: 'none',
                boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 20px rgba(0,0,0,0.15)',
                },
                '&:active': {
                  transform: 'translateY(0)',
                }
              }}
              disabled={loading}
              startIcon={loading && <CircularProgress size={20} color="inherit" />}
            >
              {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
            </Button>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <Link
                  component={RouterLink}
                  to={isLogin ? '/donor/register' : '/donor/login'}
                  sx={{ 
                    textDecoration: 'none',
                    color: theme.palette.secondary.main,
                    fontWeight: 700,
                    '&:hover': {
                      textDecoration: 'underline'
                    }
                  }}
                >
                  {isLogin ? "Sign Up" : "Sign In"}
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default DonorAuth;