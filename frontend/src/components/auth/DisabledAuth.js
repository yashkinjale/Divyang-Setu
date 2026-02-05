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
  InputAdornment,
  useTheme
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
  const [submitting, setSubmitting] = useState(false);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const { login: setAuth } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();

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

        // Redirect to verification page if not verified
        if (!userData.isVerified) {
          navigate('/disabled/verification', { replace: true });
        } else {
          navigate('/disabled/dashboard', { replace: true });
        }
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
          } catch { }
        }
        setAuth(userData, res.data.token);

        // Redirect to verification page after registration
        navigate('/disabled/verification', { replace: true });
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
          p: { xs: 2, md: 4 },
          background: `linear-gradient(135deg, ${theme.palette.primary.light}11 0%, ${theme.palette.primary.main}22 100%), 
                      radial-gradient(circle at 90% 10%, rgba(224, 242, 254, 0.46) 0.1%, rgba(248, 250, 252, 0.28) 90.1%)`,
          backgroundAttachment: 'fixed',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '10%',
            right: '5%',
            width: '350px',
            height: '350px',
            background: `radial-gradient(circle, ${theme.palette.primary.light}33 0%, transparent 70%)`,
            filter: 'blur(60px)',
            zIndex: 0,
          }
        }}
      >
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, sm: 5 },
              borderRadius: '24px',
              background: 'rgba(255, 255, 255, 0.75)',
              backdropFilter: 'blur(20px) saturate(180%)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
            }}
          >
            <Box sx={{ textAlign: 'center', mb: 5 }}>
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: '14px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: `${theme.palette.primary.main}15`,
                  color: theme.palette.primary.main,
                  mb: 2
                }}
              >
                <AccessibilityNewIcon sx={{ fontSize: 32 }} />
              </Box>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 800,
                  mb: 1,
                  color: theme.palette.primary.dark,
                  fontSize: { xs: '2rem', md: '2.5rem' },
                  letterSpacing: '-0.5px'
                }}
              >
                Join Our Community
              </Typography>
              <Typography color="text.secondary" sx={{ fontSize: '1.05rem', fontWeight: 500 }}>
                Create an account to connect with resources and support
              </Typography>
            </Box>

            {error && (
              <Box
                sx={{
                  mb: 4,
                  p: 2,
                  bgcolor: 'rgba(211, 47, 47, 0.05)',
                  borderRadius: '12px',
                  border: '1px solid rgba(211, 47, 47, 0.1)'
                }}
              >
                <Typography color="error" align="center" variant="body2" sx={{ fontWeight: 600 }}>
                  {error}
                </Typography>
              </Box>
            )}

            <Box component="form" onSubmit={handleSubmit}>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                {/* Row 1: Full Name | Email */}
                <Box>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 700, color: '#334155', ml: 0.5 }}>
                    Full Name
                  </Typography>
                  <TextField
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    fullWidth
                    required
                    placeholder="E.g. John Doe"
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        transition: 'all 0.2s',
                        '&:hover': { bgcolor: 'rgba(0,0,0,0.02)' },
                        '&.Mui-focused': { bgcolor: 'white' }
                      },
                    }}
                  />
                </Box>

                <Box>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 700, color: '#334155', ml: 0.5 }}>
                    Email Address
                  </Typography>
                  <TextField
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    fullWidth
                    required
                    placeholder="john@example.com"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        transition: 'all 0.2s',
                        '&:hover': { bgcolor: 'rgba(0,0,0,0.02)' },
                        '&.Mui-focused': { bgcolor: 'white' }
                      },
                    }}
                  />
                </Box>

                {/* Row 2: Phone | Password */}
                <Box>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 700, color: '#334155', ml: 0.5 }}>
                    Phone Number
                  </Typography>
                  <TextField
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    fullWidth
                    required
                    placeholder="+91..."
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        transition: 'all 0.2s',
                        '&:hover': { bgcolor: 'rgba(0,0,0,0.02)' },
                        '&.Mui-focused': { bgcolor: 'white' }
                      },
                    }}
                  />
                </Box>

                <Box>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 700, color: '#334155', ml: 0.5 }}>
                    Create Password
                  </Typography>
                  <TextField
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    fullWidth
                    required
                    placeholder="At least 8 characters"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        transition: 'all 0.2s',
                        '&:hover': { bgcolor: 'rgba(0,0,0,0.02)' },
                        '&.Mui-focused': { bgcolor: 'white' }
                      },
                    }}
                  />
                </Box>

                {/* Row 3: Location | Type of Disability */}
                <Box>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 700, color: '#334155', ml: 0.5 }}>
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
                        borderRadius: '12px',
                        transition: 'all 0.2s',
                        '&:hover': { bgcolor: 'rgba(0,0,0,0.02)' },
                        '&.Mui-focused': { bgcolor: 'white' }
                      },
                    }}
                  />
                </Box>

                <Box>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 700, color: '#334155', ml: 0.5 }}>
                    Type of Disability
                  </Typography>
                  <FormControl fullWidth required>
                    <Select
                      name="disabilityType"
                      value={formData.disabilityType}
                      onChange={handleChange}
                      displayEmpty
                      sx={{
                        borderRadius: '12px',
                        '&:hover': { bgcolor: 'rgba(0,0,0,0.02)' },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderWidth: 2
                        }
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

                {/* Profile Photo */}
                <Box sx={{ gridColumn: { md: '1 / span 2' } }}>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 700, color: '#334155', ml: 0.5 }}>
                    Profile Photo (Optional)
                  </Typography>
                  <Button
                    variant="outlined"
                    component="label"
                    fullWidth
                    sx={{
                      borderRadius: '12px',
                      py: 1.5,
                      borderStyle: 'dashed',
                      borderWidth: 2,
                      '&:hover': { borderWidth: 2, bgcolor: 'rgba(0,0,0,0.01)' }
                    }}
                  >
                    {profileImageFile ? profileImageFile.name : 'Click to upload photo'}
                    <input type="file" accept="image/*" hidden onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setProfileImageFile(file);
                    }} />
                  </Button>
                </Box>

                {/* Description */}
                <Box sx={{ gridColumn: { md: '1 / span 2' } }}>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 700, color: '#334155', ml: 0.5 }}>
                    Disability Description <span style={{ color: '#94a3b8', fontWeight: 400 }}>(Optional)</span>
                  </Typography>
                  <TextField
                    name="needs"
                    value={formData.needs}
                    onChange={handleChange}
                    fullWidth
                    multiline
                    placeholder="Tell us a bit about your specific needs..."
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        transition: 'all 0.2s',
                        '&:hover': { bgcolor: 'rgba(0,0,0,0.02)' },
                        '&.Mui-focused': { bgcolor: 'white' }
                      },
                    }}
                  />
                </Box>

                {/* Submit Button */}
                <Box sx={{ gridColumn: { md: '1 / span 2' }, mt: 2 }}>
                  <Button
                    type="submit"
                    fullWidth
                    size="large"
                    variant="contained"
                    sx={{
                      py: 2,
                      borderRadius: '12px',
                      fontWeight: 700,
                      fontSize: '1rem',
                      textTransform: 'none',
                      boxShadow: '0 8px 16px rgba(25, 118, 210, 0.25)',
                      transition: 'all 0.3s',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 12px 20px rgba(25, 118, 210, 0.35)',
                      }
                    }}
                    disabled={submitting}
                  >
                    {submitting ? 'Creating Account...' : 'Create Account'}
                  </Button>
                </Box>
              </Box>
            </Box>

            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                Already have an account?{' '}
                <Link
                  component={RouterLink}
                  to="/disabled/login"
                  sx={{
                    color: theme.palette.primary.main,
                    fontWeight: 700,
                    textDecoration: 'none',
                    '&:hover': { textDecoration: 'underline' }
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
        background: `linear-gradient(135deg, ${theme.palette.primary.light}11 0%, ${theme.palette.primary.main}22 100%), 
                    radial-gradient(circle at 10% 20%, rgba(224, 242, 254, 0.46) 0.1%, rgba(248, 250, 252, 0.28) 90.1%)`,
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
          background: `radial-gradient(circle, ${theme.palette.primary.light}33 0%, transparent 70%)`,
          filter: 'blur(50px)',
          zIndex: 0,
        }
      }}
    >
      <Container component="main" maxWidth="xs" sx={{ position: 'relative', zIndex: 1 }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 5 },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            borderRadius: '24px',
            background: 'rgba(255, 255, 255, 0.75)',
            backdropFilter: 'blur(20px) saturate(180%)',
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
              bgcolor: `${theme.palette.primary.main}15`,
              color: theme.palette.primary.main,
              mb: 3,
              transition: 'transform 0.3s ease-in-out',
              '&:hover': {
                transform: 'scale(1.1) rotate(-5deg)',
              }
            }}
          >
            <AccessibilityNewIcon sx={{ fontSize: 32 }} />
          </Box>
          <Typography
            component="h1"
            variant="h3"
            align="center"
            sx={{
              fontWeight: 800,
              mb: 1,
              color: theme.palette.primary.dark,
              letterSpacing: '-0.5px',
              fontSize: { xs: '2rem', md: '2.5rem' }
            }}
          >
            Welcome Back!
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            align="center"
            sx={{ mb: 4, fontWeight: 500 }}
          >
            Sign in to access support and connect with donors
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
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 700, color: '#334155', ml: 0.5 }}>
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
                mb: 2.5,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  transition: 'all 0.2s',
                  '&:hover': { bgcolor: 'rgba(0,0,0,0.02)' },
                  '&.Mui-focused': { bgcolor: 'white' }
                },
              }}
            />

            <Typography variant="body2" sx={{ mb: 1, fontWeight: 700, color: '#334155', ml: 0.5 }}>
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
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  transition: 'all 0.2s',
                  '&:hover': { bgcolor: 'rgba(0,0,0,0.02)' },
                  '&.Mui-focused': { bgcolor: 'white' }
                },
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{
                mt: 4,
                mb: 3,
                py: 2,
                borderRadius: '12px',
                fontWeight: 700,
                fontSize: '1.1rem',
                textTransform: 'none',
                boxShadow: '0 8px 16px rgba(25, 118, 210, 0.2)',
                transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 20px rgba(25, 118, 210, 0.3)',
                }
              }}
              disabled={submitting}
            >
              {submitting ? 'Signing in...' : 'Sign In'}
            </Button>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                Don't have an account?{' '}
                <Link
                  component={RouterLink}
                  to="/disabled/register"
                  sx={{
                    textDecoration: 'none',
                    color: theme.palette.primary.main,
                    fontWeight: 700,
                    '&:hover': { textDecoration: 'underline' }
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