import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  Grid, 
  CircularProgress, 
  Chip, 
  Button,
  Divider,
  Avatar
} from '@mui/material';
import { disabledApi } from '../utils/api';

const ProfilePage = () => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await disabledApi.getProfile();
        setProfile(res.data?.data || res.data);
      } catch (e) {
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const resolveImageUrl = (raw) => {
    if (!raw) return undefined;
    const img = typeof raw === 'string' ? raw : (raw.url || raw.path || raw.location || raw.secure_url || raw.src);
    if (!img || typeof img !== 'string') return undefined;
    if (/^(https?:|data:|blob:)/i.test(img)) return img;
    const base = (process.env.REACT_APP_API_URL || 'http://localhost:5000').replace(/\/?api$/, '');
    const path = img.charAt(0) === '/' ? img : `/${img}`;
    return `${base}${path}`;
  };

  const InfoRow = ({ label, value }) => (
    <Box sx={{ py: 2 }}>
      <Typography 
        variant="body2" 
        sx={{ 
          color: '#6b7280', 
          fontSize: '0.875rem',
          mb: 0.5,
          fontWeight: 500
        }}
      >
        {label}
      </Typography>
      <Typography 
        variant="body1" 
        sx={{ 
          color: '#111827',
          fontSize: '0.95rem',
          fontWeight: 500
        }}
      >
        {value || '—'}
      </Typography>
    </Box>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: '#f9fafb' }}>
        <CircularProgress size={48} />
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: '#f9fafb', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
            <Box 
              sx={{ 
                width: 40, 
                height: 40, 
                borderRadius: '8px',
                bgcolor: '#3b82f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Typography sx={{ color: 'white', fontWeight: 700, fontSize: '1.1rem' }}>◈</Typography>
            </Box>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 700,
                color: '#111827',
                fontSize: '1.125rem'
              }}
            >
              PWD Po
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 800, 
                  color: '#111827',
                  fontSize: { xs: '1.875rem', md: '2.25rem' },
                  mb: 0.5
                }}
              >
                My Profile
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  color: '#6b7280',
                  fontSize: '0.95rem'
                }}
              >
                Review and manage your personal information.
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 1.5 }}>
              <Button 
                variant="text" 
                sx={{ 
                  color: '#6b7280',
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  px: 2
                }}
              >
                Dashboard
              </Button>
              <Button 
                variant="text" 
                sx={{ 
                  color: '#6b7280',
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  px: 2
                }}
              >
                Resources
              </Button>
              <Button 
                variant="text" 
                sx={{ 
                  color: '#6b7280',
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  px: 2
                }}
              >
                Support
              </Button>
            </Box>
          </Box>
        </Box>

        {/* Main Profile Card */}
        <Paper 
          elevation={0} 
          sx={{ 
            borderRadius: 3,
            overflow: 'hidden',
            border: '1px solid #e5e7eb',
            bgcolor: 'white'
          }}
        >
          {/* Profile Summary */}
          <Box sx={{ p: 4, bgcolor: 'white' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar src={resolveImageUrl(profile?.profileImage || profile?.image || profile?.photo || profile?.avatarUrl || profile?.avatar)} sx={{ width: 56, height: 56 }} />
                <Typography 
                  variant="h5" 
                  sx={{ 
                    fontWeight: 700, 
                    color: '#111827',
                    fontSize: '1.5rem',
                    mb: 1
                  }}
                >
                  {profile?.name || '—'}
                </Typography>
                {(profile?.disabilityType || profile?.disability) && (
                  <Chip 
                    label={profile?.disabilityType || profile?.disability}
                    sx={{ 
                      bgcolor: '#dbeafe',
                      color: '#1e40af',
                      fontWeight: 600,
                      fontSize: '0.8rem',
                      height: 28,
                      borderRadius: '6px',
                      '& .MuiChip-label': {
                        px: 1.5
                      }
                    }} 
                  />
                )}
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button variant="outlined" component="label" sx={{ textTransform: 'none' }}>
                  Change Photo
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const fd = new FormData();
                      fd.append('image', file);
                      try {
                        await disabledApi.uploadProfileImage(fd);
                        try {
                          const res = await disabledApi.getProfile();
                          setProfile(res.data?.data || res.data);
                        } catch {}
                      } catch {}
                    }}
                  />
                </Button>
                <Button 
                  variant="contained" 
                  sx={{ 
                    bgcolor: '#3b82f6',
                    color: 'white',
                    px: 3,
                    py: 1.2,
                    borderRadius: 2,
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    textTransform: 'none',
                    boxShadow: 'none',
                    '&:hover': {
                      bgcolor: '#2563eb',
                      boxShadow: 'none'
                    }
                  }}
                >
                  Edit Profile
                </Button>
              </Box>
            </Box>
          </Box>

          <Divider sx={{ borderColor: '#e5e7eb' }} />

          {/* Personal Details Section */}
          <Box sx={{ p: 4 }}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 700, 
                color: '#111827',
                fontSize: '1.125rem',
                mb: 3
              }}
            >
              Personal Details
            </Typography>
            
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <InfoRow label="Full Name" value={profile?.name} />
              </Grid>
              <Grid item xs={12} md={6}>
                <InfoRow 
                  label="Disability Type" 
                  value={profile?.disabilityType || profile?.disability} 
                />
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ py: 2 }}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: '#6b7280', 
                      fontSize: '0.875rem',
                      mb: 1,
                      fontWeight: 500
                    }}
                  >
                    Disability Description
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: '#111827',
                      fontSize: '0.95rem',
                      lineHeight: 1.7,
                      fontWeight: 400
                    }}
                  >
                    {profile?.needs || profile?.description || '—'}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ borderColor: '#e5e7eb' }} />

          {/* Contact & Account Information Section */}
          <Box sx={{ p: 4 }}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 700, 
                color: '#111827',
                fontSize: '1.125rem',
                mb: 3
              }}
            >
              Contact & Account Information
            </Typography>
            
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <InfoRow label="Email Address" value={profile?.email} />
              </Grid>
              <Grid item xs={12} md={6}>
                <InfoRow label="Phone Number" value={profile?.phone} />
              </Grid>
              <Grid item xs={12} md={6}>
                <InfoRow 
                  label="Location" 
                  value={profile?.address || profile?.location} 
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ py: 2 }}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: '#6b7280', 
                      fontSize: '0.875rem',
                      mb: 0.5,
                      fontWeight: 500
                    }}
                  >
                    Password
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        color: '#111827',
                        fontSize: '0.95rem',
                        fontWeight: 500,
                        letterSpacing: 2
                      }}
                    >
                      ••••••••••
                    </Typography>
                    <Button
                      variant="text"
                      size="small"
                      sx={{
                        color: '#3b82f6',
                        textTransform: 'none',
                        fontWeight: 600,
                        fontSize: '0.875rem',
                        '&:hover': {
                          bgcolor: 'transparent',
                          textDecoration: 'underline'
                        }
                      }}
                    >
                      Change Password
                    </Button>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default ProfilePage;