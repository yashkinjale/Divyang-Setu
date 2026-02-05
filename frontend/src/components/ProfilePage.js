import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  IconButton,
  InputAdornment
} from '@mui/material';
import { Visibility, VisibilityOff, ArrowBack } from '@mui/icons-material';
import { disabledApi } from '../utils/api';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});

  const loadProfile = async () => {
    try {
      setLoading(true);
      const res = await disabledApi.getProfile();
      const data = res.data?.data || res.data;
      setProfile(data);
      setEditForm({
        name: data?.name || '',
        phone: data?.phone || '',
        address: data?.address || data?.location || '',
        disabilityType: data?.disabilityType || data?.disability || '',
        needs: data?.needs || data?.description || ''
      });
    } catch (e) {
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      await disabledApi.updateProfile(editForm);
      await loadProfile();
      setIsEditing(false);
    } catch (err) {
      console.error('Update profile failed:', err);
      alert('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditForm({
      name: profile?.name || '',
      phone: profile?.phone || '',
      address: profile?.address || profile?.location || '',
      disabilityType: profile?.disabilityType || profile?.disability || '',
      needs: profile?.needs || profile?.description || ''
    });
    setIsEditing(false);
  };

  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters');
      return;
    }

    setIsChangingPassword(true);
    setPasswordError('');
    setPasswordSuccess('');

    try {
      await disabledApi.changePassword({
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword
      });
      setPasswordSuccess('Password updated successfully');
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setPasswordDialogOpen(false), 2000);
    } catch (err) {
      setPasswordError(err.response?.data?.message || 'Failed to update password');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const resolveImageUrl = (raw) => {
    if (!raw) return undefined;
    const img = typeof raw === 'string' ? raw : (raw.url || raw.path || raw.location || raw.secure_url || raw.src);
    if (!img || typeof img !== 'string') return undefined;
    if (/^(https?:|data:|blob:)/i.test(img)) return img;
    const base = (process.env.REACT_APP_API_URL || 'http://localhost:5000').replace(/\/?api$/, '');
    const path = img.charAt(0) === '/' ? img : `/${img}`;
    return `${base}${path}`;
  };

  const InfoRow = ({ label, value, name, multiLine = false }) => (
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
      {isEditing && name ? (
        <TextField
          fullWidth
          size="small"
          name={name}
          value={editForm[name] || ''}
          onChange={(e) => setEditForm({ ...editForm, [name]: e.target.value })}
          multiline={multiLine}
          rows={multiLine ? 3 : 1}
          sx={{
            '& .MuiOutlinedInput-root': {
              bgcolor: 'white',
              fontSize: '0.95rem',
              fontWeight: 500
            }
          }}
        />
      ) : (
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
      )}
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
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate('/disabled/dashboard')}
            sx={{
              mb: 2,
              color: '#6b7280',
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': { bgcolor: 'transparent', color: '#111827' }
            }}
          >
            Back to Dashboard
          </Button>
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

            <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 1.5 }}>
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
          <Box sx={{ p: { xs: 2, sm: 4 }, bgcolor: 'white' }}>
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
                        loadProfile();
                      } catch (err) {
                        console.error('Image upload failed:', err);
                      }
                    }}
                  />
                </Button>
                {isEditing ? (
                  <>
                    <Button
                      variant="outlined"
                      onClick={handleCancel}
                      sx={{ textTransform: 'none', borderRadius: 2 }}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      onClick={handleSave}
                      sx={{
                        bgcolor: '#10b981',
                        color: 'white',
                        px: 3,
                        borderRadius: 2,
                        fontWeight: 600,
                        textTransform: 'none',
                        '&:hover': { bgcolor: '#059669' }
                      }}
                    >
                      Save Changes
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="contained"
                    onClick={() => setIsEditing(true)}
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
                )}
              </Box>
            </Box>
          </Box>

          <Divider sx={{ borderColor: '#e5e7eb' }} />

          {/* Personal Details Section */}
          <Box sx={{ p: { xs: 2, sm: 4 } }}>
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
                <InfoRow label="Full Name" value={profile?.name} name="name" />
              </Grid>
              <Grid item xs={12} md={6}>
                <InfoRow
                  label="Disability Type"
                  value={profile?.disabilityType || profile?.disability}
                  name="disabilityType"
                />
              </Grid>
              <Grid item xs={12}>
                <InfoRow
                  label="Disability Description"
                  value={profile?.needs || profile?.description}
                  name="needs"
                  multiLine
                />
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ borderColor: '#e5e7eb' }} />

          {/* Contact & Account Information Section */}
          <Box sx={{ p: { xs: 2, sm: 4 } }}>
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
                <InfoRow label="Phone Number" value={profile?.phone} name="phone" />
              </Grid>
              <Grid item xs={12} md={6}>
                <InfoRow
                  label="Location"
                  value={profile?.address || profile?.location}
                  name="address"
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
                      onClick={() => {
                        setPasswordError('');
                        setPasswordSuccess('');
                        setPasswordDialogOpen(true);
                      }}
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

        {/* Change Password Dialog */}
        <Dialog
          open={passwordDialogOpen}
          onClose={() => !isChangingPassword && setPasswordDialogOpen(false)}
          maxWidth="xs"
          fullWidth
        >
          <DialogTitle sx={{ fontWeight: 700 }}>Change Password</DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Enter your current password and a new one to update your security.
            </Typography>

            {passwordError && <Alert severity="error" sx={{ mb: 2 }}>{passwordError}</Alert>}
            {passwordSuccess && <Alert severity="success" sx={{ mb: 2 }}>{passwordSuccess}</Alert>}

            <TextField
              margin="dense"
              label="Current Password"
              type={showOldPassword ? "text" : "password"}
              fullWidth
              variant="outlined"
              value={passwordData.oldPassword}
              onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
              disabled={isChangingPassword}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowOldPassword(!showOldPassword)} edge="end">
                      {showOldPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              margin="normal"
              label="New Password"
              type={showNewPassword ? "text" : "password"}
              fullWidth
              variant="outlined"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              disabled={isChangingPassword}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowNewPassword(!showNewPassword)} edge="end">
                      {showNewPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              margin="normal"
              label="Confirm New Password"
              type="password"
              fullWidth
              variant="outlined"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              disabled={isChangingPassword}
            />
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 0 }}>
            <Button onClick={() => setPasswordDialogOpen(false)} disabled={isChangingPassword}>
              Cancel
            </Button>
            <Button
              onClick={handlePasswordChange}
              variant="contained"
              disabled={isChangingPassword || !passwordData.oldPassword || !passwordData.newPassword}
              sx={{ bgcolor: '#3b82f6', color: 'white' }}
            >
              {isChangingPassword ? 'Updating...' : 'Update Password'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default ProfilePage;