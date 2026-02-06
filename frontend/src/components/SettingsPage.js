import React, { useEffect, useState } from 'react';
import {
    Box,
    Container,
    Typography,
    Paper,
    Grid,
    CircularProgress,
    Divider,
    Avatar,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Alert,
    IconButton,
    InputAdornment
} from '@mui/material';
import {
    Security as SecurityIcon,
    Visibility,
    VisibilityOff,
    ArrowBack as ArrowBackIcon,
    Person as PersonIcon,
    Email as EmailIcon,
    Phone as PhoneIcon,
    AccessibilityNew as AccessibilityIcon,
    Logout as LogoutIcon
} from '@mui/icons-material';
import { disabledApi } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useThemeToggle } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';

const SettingsPage = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const { isHighContrast } = useThemeToggle();
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await disabledApi.getProfile();
                setProfile(res.data?.data || res.data);
            } catch (e) {
                console.error('Error loading profile:', e);
                setProfile(null);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

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

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const InfoRow = ({ icon: Icon, label, value }) => (
        <Box sx={{ py: 2.5, display: 'flex', alignItems: 'flex-start', gap: 2 }}>
            <Icon sx={{ color: isHighContrast ? 'primary.main' : 'primary.main', mt: 0.3 }} />
            <Box sx={{ flexGrow: 1 }}>
                <Typography
                    variant="body2"
                    sx={{
                        color: isHighContrast ? 'primary.main' : 'text.secondary',
                        fontSize: '0.85rem',
                        mb: 0.5,
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                    }}
                >
                    {label}
                </Typography>
                <Typography
                    variant="body1"
                    sx={{
                        color: 'text.primary',
                        fontSize: '1rem',
                        fontWeight: 500
                    }}
                >
                    {value || 'Not provided'}
                </Typography>
            </Box>
        </Box>
    );

    const SectionHeader = ({ icon: Icon, title }) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3, mt: 2 }}>
            <Icon color="primary" />
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
                {title}
            </Typography>
        </Box>
    );

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <CircularProgress size={40} />
            </Box>
        );
    }

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Box sx={{ mb: 4 }}>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate('/disabled/dashboard')}
                    sx={{
                        mb: 2,
                        color: 'text.secondary',
                        textTransform: 'none',
                        fontWeight: 600,
                        '&:hover': { bgcolor: 'transparent', color: 'text.primary' }
                    }}
                >
                    Back to Dashboard
                </Button>
                <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, color: 'text.primary' }}>
                    Settings
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Manage your account information and preferences.
                </Typography>
            </Box>

            <Grid container spacing={4} justifyContent="center">
                {/* Profile Information */}
                <Grid item xs={12}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: { xs: 2, sm: 4 },
                            borderRadius: 3,
                            border: isHighContrast ? '2px solid #FFFF00' : '1px solid',
                            borderColor: 'divider',
                            bgcolor: 'background.paper'
                        }}
                    >
                        <SectionHeader icon={PersonIcon} title="Profile Information" />

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
                            <Avatar
                                src={profile?.profileImage || profile?.avatar}
                                sx={{ width: 80, height: 80, border: '2px solid', borderColor: 'primary.main' }}
                            />
                            <Box>
                                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                                    {profile?.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Member since {new Date(profile?.createdAt || Date.now()).toLocaleDateString()}
                                </Typography>
                            </Box>
                        </Box>

                        <Divider sx={{ mb: 2 }} />

                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <InfoRow icon={PersonIcon} label="Full Name" value={profile?.name} />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <InfoRow icon={EmailIcon} label="Email Address" value={profile?.email} />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <InfoRow icon={PhoneIcon} label="Phone Number" value={profile?.phone} />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <InfoRow icon={AccessibilityIcon} label="Disability Category" value={profile?.disabilityType || profile?.disability} />
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>

                {/* Account Settings */}
                <Grid item xs={12}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: { xs: 2, sm: 4 },
                            borderRadius: 3,
                            border: isHighContrast ? '2px solid #FFFF00' : '1px solid',
                            borderColor: 'divider',
                            bgcolor: 'background.paper'
                        }}
                    >
                        <SectionHeader icon={SecurityIcon} title="Account Settings" />

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 2 }}>
                            <Box>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Password</Typography>
                                <Typography variant="body2" color="text.secondary">Update your password to keep your account secure.</Typography>
                            </Box>
                            <Button
                                variant="outlined"
                                sx={{ textTransform: 'none' }}
                                onClick={() => {
                                    setPasswordError('');
                                    setPasswordSuccess('');
                                    setPasswordDialogOpen(true);
                                }}
                            >
                                Change Password
                            </Button>
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 2 }}>
                            <Box>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'error.main' }}>Logout</Typography>
                                <Typography variant="body2" color="text.secondary">Sign out of your account on this device.</Typography>
                            </Box>
                            <Button
                                variant="contained"
                                color="error"
                                startIcon={<LogoutIcon />}
                                onClick={handleLogout}
                                sx={{ textTransform: 'none' }}
                            >
                                Logout
                            </Button>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>

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
    );
};

export default SettingsPage;
