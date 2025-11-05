import React, { useState } from 'react';
import { 
  TextField, 
  Button, 
  Box, 
  Typography, 
  Container, 
  Paper, 
  Link, 
  Grid, 
  FormControl, 
  Select, 
  MenuItem, 
  IconButton,
  InputAdornment
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';
import { disabledApi } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link as RouterLink } from 'react-router-dom';

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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const { login: setAuth } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // registration validation kept simple to match requested fields

    try {
      setSubmitting(true);
      if (isLogin) {
        const res = await disabledApi.login({ email: formData.email, password: formData.password });
        const userData = { ...(res.data.user || res.data.disabled), type: 'disabled' };
        setAuth(userData, res.data.token);
        navigate('/disabled/dashboard', { replace: true });
      } else {
        const res = await disabledApi.register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          address: formData.address,
          disabilityType: formData.disabilityType,
          needs: formData.needs,
        });
        let userData = { ...(res.data.user || res.data.disabled), type: 'disabled' };
        // If backend has no upload route, embed a local data URL so the app can display it
        if (profileImageFile) {
          try {
            const dataUrl = await new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result);
              reader.onerror = reject;
              reader.readAsDataURL(profileImageFile);
            });
            userData = { ...userData, profileImage: dataUrl };
          } catch {}
        }
        setAuth(userData, res.data.token);
        navigate('/disabled/dashboard', { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Request failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isLogin) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2,
          bgcolor: '#ffffff',
        }}
      >
        <Container maxWidth="md">
          <Paper 
            elevation={3}
            sx={{ 
              p: { xs: 3, sm: 4, md: 5 }, 
              borderRadius: 2, 
              bgcolor: 'white',
              border: '1px solid #e0e0e0'
            }}
          >
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: '700', 
                  mb: 1, 
                  color: '#1976d2',
                  fontSize: { xs: '1.75rem', md: '2.125rem' }
                }}
              >
                Join Our Community
              </Typography>
              <Typography color="text.secondary" sx={{ fontSize: '0.95rem' }}>
                Create an account to connect with resources and support
              </Typography>
            </Box>

            {error && (
              <Typography 
                color="error" 
                align="center" 
                sx={{ 
                  mb: 3, 
                  p: 1.5, 
                  bgcolor: '#ffebee', 
                  borderRadius: 1,
                  fontSize: '0.9rem'
                }}
              >
                {error}
              </Typography>
            )}

            <Box component="form" onSubmit={handleSubmit}>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                {/* Row 1: Full Name | Email */}
                <Box>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      mb: 1, 
                      fontWeight: 600,
                      color: '#333'
                    }}
                  >
                    Full Name
                  </Typography>
                  <TextField 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    fullWidth 
                    required 
                    placeholder="Enter your full name"
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        bgcolor: 'white',
                        '& fieldset': {
                          borderColor: '#d0d0d0',
                        },
                        '&:hover fieldset': {
                          borderColor: '#1976d2',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#1976d2',
                          borderWidth: 2,
                        },
                      },
                    }}
                  />
                </Box>

                <Box>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      mb: 1, 
                      fontWeight: 600,
                      color: '#333'
                    }}
                  >
                    Email Address
                  </Typography>
                  <TextField 
                    name="email" 
                    type="email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    fullWidth 
                    required 
                    placeholder="Enter your email"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        bgcolor: 'white',
                        '& fieldset': {
                          borderColor: '#d0d0d0',
                        },
                        '&:hover fieldset': {
                          borderColor: '#1976d2',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#1976d2',
                          borderWidth: 2,
                        },
                      },
                    }}
                  />
                </Box>

                {/* Row 2: Phone | Password */}
                <Box>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      mb: 1, 
                      fontWeight: 600,
                      color: '#333'
                    }}
                  >
                    Phone Number
                  </Typography>
                  <TextField 
                    name="phone" 
                    value={formData.phone} 
                    onChange={handleChange} 
                    fullWidth 
                    required 
                    placeholder="Enter your phone number"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        bgcolor: 'white',
                        '& fieldset': {
                          borderColor: '#d0d0d0',
                        },
                        '&:hover fieldset': {
                          borderColor: '#1976d2',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#1976d2',
                          borderWidth: 2,
                        },
                      },
                    }}
                  />
                </Box>

                <Box>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      mb: 1, 
                      fontWeight: 600,
                      color: '#333'
                    }}
                  >
                    Create Password
                  </Typography>
                  <TextField 
                    name="password" 
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password} 
                    onChange={handleChange} 
                    fullWidth 
                    required 
                    placeholder="Enter a secure password"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                            sx={{ color: '#666' }}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        bgcolor: 'white',
                        '& fieldset': {
                          borderColor: '#d0d0d0',
                        },
                        '&:hover fieldset': {
                          borderColor: '#1976d2',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#1976d2',
                          borderWidth: 2,
                        },
                      },
                    }}
                  />
                </Box>

                {/* Row 3: Location | Type of Disability */}
                <Box>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      mb: 1, 
                      fontWeight: 600,
                      color: '#333'
                    }}
                  >
                    Location
                  </Typography>
                  <TextField 
                    name="address" 
                    value={formData.address} 
                    onChange={handleChange} 
                    fullWidth 
                    required 
                    placeholder="City, Country"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        bgcolor: 'white',
                        '& fieldset': {
                          borderColor: '#d0d0d0',
                        },
                        '&:hover fieldset': {
                          borderColor: '#1976d2',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#1976d2',
                          borderWidth: 2,
                        },
                      },
                    }}
                  />
                </Box>

                <Box>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      mb: 1, 
                      fontWeight: 600,
                      color: '#333'
                    }}
                  >
                    Type of Disability
                  </Typography>
                  <FormControl fullWidth required>
                    <Select 
                      name="disabilityType" 
                      value={formData.disabilityType} 
                      onChange={handleChange}
                      displayEmpty
                      sx={{
                        bgcolor: 'white',
                        '& fieldset': {
                          borderColor: '#d0d0d0',
                        },
                        '&:hover fieldset': {
                          borderColor: '#1976d2',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#1976d2',
                          borderWidth: 2,
                        },
                      }}
                    >
                      <MenuItem value="" disabled>Select type</MenuItem>
                      <MenuItem value="Physical Disabilities">Physical Disabilities</MenuItem>
                      <MenuItem value="Visual Impairment">Visual Impairment</MenuItem>
                      <MenuItem value="Hearing Impairment">Hearing Impairment</MenuItem>
                      <MenuItem value="Intellectual Disabilities">Intellectual Disabilities</MenuItem>
                      <MenuItem value="Mental Health Conditions">Mental Health Conditions</MenuItem>
                      <MenuItem value="Other">Other</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                {/* Row 3b: Profile Photo (Upload) */}
                <Box>
                  <Typography 
                    variant="body2" 
                    sx={{ mb: 1, fontWeight: 600, color: '#333' }}
                  >
                    Profile Photo (Optional)
                  </Typography>
                  <Button variant="outlined" component="label" sx={{ width: '100%' }}>
                    {profileImageFile ? 'Change Selected Photo' : 'Choose Photo'}
                    <input type="file" accept="image/*" hidden onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setProfileImageFile(file);
                    }} />
                  </Button>
                  {profileImageFile && (
                    <Typography variant="caption" sx={{ mt: 0.5, display: 'block' }}>
                      {profileImageFile.name}
                    </Typography>
                  )}
                </Box>

                {/* Row 4: Description (Full Row spanning two columns) */}
                <Box sx={{ gridColumn: { md: '1 / span 2' } }}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      mb: 1, 
                      fontWeight: 600,
                      color: '#333'
                    }}
                  >
                    Disability Description <span style={{ color: '#999', fontWeight: 400 }}>(Optional)</span>
                  </Typography>
                  <TextField 
                    name="needs" 
                    value={formData.needs} 
                    onChange={handleChange} 
                    fullWidth 
                    multiline 
                    rows={6}
                    placeholder="Provide a brief description if you wish"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        bgcolor: 'white',
                        '& fieldset': {
                          borderColor: '#d0d0d0',
                        },
                        '&:hover fieldset': {
                          borderColor: '#1976d2',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#1976d2',
                          borderWidth: 2,
                        },
                      },
                    }}
                  />
                </Box>

                {/* Submit Button */}
                <Box sx={{ gridColumn: { md: '1 / span 2' } }}>
                  <Button 
                    type="submit" 
                    fullWidth 
                    size="large" 
                    variant="contained" 
                    sx={{ 
                      bgcolor: '#1976d2', 
                      color: 'white', 
                      py: 1.8, 
                      borderRadius: 1, 
                      fontWeight: 600,
                      fontSize: '1rem',
                      textTransform: 'none',
                      '&:hover': { 
                        bgcolor: '#1565c0', 
                      } 
                    }}
                    disabled={submitting}
                  >
                    {submitting ? 'Please wait…' : 'Create Account'}
                  </Button>
                </Box>
              </Box>
            </Box>

            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.9rem' }}>
                Already have an account?{' '}
                <Link 
                  href="#"
                  underline="hover" 
                  sx={{ 
                    color: '#1976d2',
                    fontWeight: 600 
                  }}
                >
                  Log In
                </Link>
              </Typography>
            </Box>
          </Paper>
        </Container>
      </Box>
    );
  }

  // Login Page
  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        bgcolor: '#ffffff',
        py: 4 
      }}
    >
      <Container component="main" maxWidth="xs">
        <Paper 
          elevation={3}
          sx={{ 
            p: 4, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            borderRadius: 2,
            bgcolor: 'white',
            border: '1px solid #e0e0e0'
          }}
        >
          <AccessibilityNewIcon 
            sx={{ 
              fontSize: 48, 
              color: '#1976d2', 
              mb: 2 
            }} 
          />
          <Typography 
            component="h1" 
            variant="h4" 
            align="center" 
            gutterBottom
            sx={{ 
              fontWeight: 700,
              color: '#1976d2'
            }}
          >
            Welcome Back!
          </Typography>
          <Typography 
            variant="body1" 
            color="text.secondary" 
            align="center" 
            sx={{ mb: 3 }}
          >
            Sign in to access support and connect with donors
          </Typography>

          {error && (
            <Typography 
              color="error" 
              align="center" 
              sx={{ 
                mb: 2,
                p: 1.5,
                bgcolor: '#ffebee',
                borderRadius: 1,
                width: '100%',
                fontSize: '0.9rem'
              }}
            >
              {error}
            </Typography>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <Typography 
              variant="body2" 
              sx={{ 
                mb: 1, 
                mt: 2,
                fontWeight: 600,
                color: '#333'
              }}
            >
              Email Address
            </Typography>
            <TextField 
              required 
              fullWidth 
              name="email" 
              type="email" 
              value={formData.email} 
              onChange={handleChange} 
              autoFocus 
              placeholder="Enter your email"
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'white',
                  '& fieldset': {
                    borderColor: '#d0d0d0',
                  },
                  '&:hover fieldset': {
                    borderColor: '#1976d2',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#1976d2',
                    borderWidth: 2,
                  },
                },
              }}
            />

            <Typography 
              variant="body2" 
              sx={{ 
                mb: 1, 
                fontWeight: 600,
                color: '#333'
              }}
            >
              Password
            </Typography>
            <TextField 
              required 
              fullWidth 
              name="password" 
              type={showPassword ? 'text' : 'password'}
              value={formData.password} 
              onChange={handleChange} 
              placeholder="Enter your password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      sx={{ color: '#666' }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'white',
                  '& fieldset': {
                    borderColor: '#d0d0d0',
                  },
                  '&:hover fieldset': {
                    borderColor: '#1976d2',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#1976d2',
                    borderWidth: 2,
                  },
                },
              }}
            />

            <Button 
              type="submit" 
              fullWidth 
              variant="contained" 
              size="large" 
              sx={{ 
                mt: 3, 
                mb: 2,
                bgcolor: '#1976d2',
                py: 1.8,
                borderRadius: 1,
                fontWeight: 600,
                fontSize: '1rem',
                textTransform: 'none',
                '&:hover': {
                  bgcolor: '#1565c0',
                }
              }}
              disabled={submitting}
            >
              {submitting ? 'Signing in…' : 'Log In'}
            </Button>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Don't have an account?{' '}
                <Link 
                  component={RouterLink}
                  to="/disabled/register"
                  sx={{ 
                    textDecoration: 'none',
                    color: '#1976d2',
                    fontWeight: 600
                  }}
                >
                  Sign Up
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default DisabledAuth;