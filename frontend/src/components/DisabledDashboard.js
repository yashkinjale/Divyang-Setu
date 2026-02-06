import React, { useState } from 'react';
import {
  Box,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Divider,
  useTheme,
  useMediaQuery,
  Avatar,
  Drawer,
  AppBar,
  Toolbar,
  Menu,
  MenuItem,
  IconButton,
  Button,
  Tooltip,
  Typography
} from '@mui/material';
import {
  AccessibilityNew as AccessibilityIcon,
  Visibility as ScreenReaderIcon,
  Contrast as ContrastIcon,
  Mic as MicIcon,
  MicOff as MicOffIcon,
  Warning as WarningIcon,
  Settings as SettingsIcon,
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Business as JobIcon,
  Policy as SchemeIcon,
  People as CommunityIcon,
  Message as MessageIcon,
  AccountCircle as AccountIcon,
  ExitToApp as LogoutIcon
} from '@mui/icons-material';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useScreenReader } from '../context/ScreenReaderContext';
import { useVoiceNav } from '../context/VoiceNavContext';
import { useAuth } from '../context/AuthContext';
import { useThemeToggle } from '../context/ThemeContext';

const SidebarItem = ({ icon: Icon, text, onClick, active }) => {
  const theme = useTheme();
  const { isHighContrast } = useThemeToggle();

  return (
    <ListItemButton
      onClick={onClick}
      selected={active}
      sx={{
        borderRadius: 1,
        mb: 1,
        px: 2,
        py: 1,
        minHeight: '48px',
        backgroundColor: active
          ? (isHighContrast ? '#FFFFFF' : theme.palette.primary.light)
          : 'transparent',
        color: active
          ? (isHighContrast ? '#FFFF00' : theme.palette.primary.main)
          : 'inherit',
        '&:hover': {
          backgroundColor: isHighContrast ? '#1a1a1a' : theme.palette.primary.light,
          color: isHighContrast ? '#FFFFFF' : theme.palette.primary.main,
        },
        '&.Mui-selected': {
          backgroundColor: active
            ? (isHighContrast ? '#FFFFFF' : theme.palette.primary.light)
            : 'transparent',
          color: active
            ? (isHighContrast ? '#FFFF00' : theme.palette.primary.main)
            : 'inherit',
          '&:hover': {
            backgroundColor: isHighContrast ? '#DDDDDD' : theme.palette.primary.light,
          },
        },
        // Ensure the icon also changes color
        '& .MuiListItemIcon-root': {
          color: active
            ? (isHighContrast ? '#FFFF00' : 'inherit')
            : 'inherit',
          minWidth: '40px',
        },
        '& .MuiListItemText-primary': {
          fontWeight: active ? 600 : 400,
        },
      }}
    >
      <ListItemIcon sx={{ color: 'inherit' }}>
        <Icon />
      </ListItemIcon>
      <ListItemText primary={text} />
    </ListItemButton>
  );
};

const Logo = () => {
  const theme = useTheme();
  return (
    <Box sx={{
      display: 'flex',
      alignItems: 'center',
      gap: 1,
      mr: 2,
      width: { xs: 'auto', sm: 220 }, // Fixed width to prevent pushing
      flexShrink: 0
    }}>
      <Box sx={{ width: 50, height: 50, flexShrink: 0, position: 'relative' }}>
        <img
          src={require('./Disabled.jpg')}
          alt="DivyangSetu Logo"
          style={{ height: '100%', width: '100%', objectFit: 'contain' }}
        />
      </Box>
      <Typography
        variant="h5"
        sx={{
          fontWeight: 'bold',
          background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          display: { xs: 'none', sm: 'block' },
          fontSize: '1.5rem', // Fixed font size to prevent jitter
          lineHeight: 1
        }}
      >
        DivyangSetu
      </Typography>
    </Box>
  );
};

const DisabledDashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();
  const { isHighContrast, toggleTheme } = useThemeToggle();
  const { enabled: screenReader, toggle: toggleScreenReader, announce } = useScreenReader();
  const { enabled: voiceNav, toggle: toggleVoiceNav } = useVoiceNav();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  // Determine active section based on current route
  const getActiveSection = () => {
    const path = location.pathname;
    if (path.endsWith('/dashboard') || path.endsWith('/dashboard/')) return 'dashboard';
    if (path.includes('/schemes')) return 'schemes';
    if (path.includes('/wishlist')) return 'wishlist';
    if (path.includes('/jobs')) return 'jobs';
    if (path.includes('/job-postings')) return 'job-postings';
    if (path.includes('/community')) return 'community';
    if (path.includes('/messages')) return 'messages';
    if (path.includes('/profile')) return 'profile';
    if (path.includes('/settings')) return 'settings';
    if (path.includes('/help')) return 'help';
    return 'dashboard';
  };

  const activeSection = getActiveSection();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const sidebarItems = [
    { icon: DashboardIcon, text: 'Home', section: 'dashboard', route: '/disabled/dashboard' },
    { icon: JobIcon, text: 'Job Recommendations', section: 'jobs', route: '/disabled/dashboard/jobs' },
    { icon: SchemeIcon, text: 'Government Schemes', section: 'schemes', route: '/disabled/dashboard/schemes' },
    { icon: CommunityIcon, text: 'Community Forum', section: 'community', route: '/disabled/dashboard/community' },
    { icon: MessageIcon, text: 'Messages', section: 'messages', route: '/disabled/dashboard/messages' },
  ];

  const drawer = (
    <Box sx={{ width: 250, pt: 2 }}>
      <Box sx={{ px: 2, mb: 3, display: 'flex', alignItems: 'center' }}>
        <AccessibilityIcon sx={{ fontSize: 30, color: theme.palette.primary.main, mr: 1 }} />
        <Typography variant="h6" color="primary">
          DivyangSetu
        </Typography>
      </Box>
      <Divider sx={{ mb: 2 }} />
      <List>
        {sidebarItems.map((item) => (
          <SidebarItem
            key={item.section}
            icon={item.icon}
            text={item.text}
            active={activeSection === item.section}
            onClick={() => {
              navigate(item.route);
              if (isMobile) handleDrawerToggle();
            }}
          />
        ))}
      </List>
      <Divider sx={{ my: 2 }} />
      <List>
        <SidebarItem
          icon={SettingsIcon}
          text="Settings"
          onClick={() => {
            navigate('/disabled/dashboard/settings');
            if (isMobile) handleDrawerToggle();
          }}
          active={activeSection === 'settings'}
        />

      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Top App Bar */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          bgcolor: 'background.paper',
          color: 'text.primary',
          boxShadow: 1,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Logo />
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: { xs: 0.25, sm: 1 },
            maxWidth: { xs: 'calc(100% - 100px)', sm: 'auto' }, // Prevent icons from pushing too much
            overflow: 'hidden' // Safety measure
          }}>
            <Tooltip title="Screen Reader Mode">
              <IconButton
                color={screenReader ? 'primary' : 'default'}
                onClick={() => {
                  toggleScreenReader();
                  setTimeout(() => announce(screenReader ? 'Screen reader disabled' : 'Screen reader enabled'), 0);
                }}
                sx={{ width: 40, height: 40 }} // Fixed size
              >
                <ScreenReaderIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title={isHighContrast ? "Disable High Contrast Mode" : "Enable High Contrast Mode"}>
              <IconButton
                color={isHighContrast ? 'primary' : 'default'}
                onClick={toggleTheme}
                sx={{ width: 40, height: 40 }} // Fixed size
              >
                <ContrastIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Voice Navigation">
              <IconButton
                color={voiceNav ? 'primary' : 'default'}
                onClick={toggleVoiceNav}
                sx={{
                  width: 40,
                  height: 40,
                  display: { xs: 'none', sm: 'flex' } // Hide Mic on extra small to save space
                }}
              >
                {voiceNav ? <MicIcon fontSize="small" /> : <MicOffIcon fontSize="small" />}
              </IconButton>
            </Tooltip>
            <Button
              variant="contained"
              color="error"
              startIcon={<WarningIcon />}
              sx={{
                ml: 1,
                minWidth: { xs: '40px', sm: 180 },
                width: { xs: '40px', sm: 'auto' },
                height: { xs: '40px', sm: 'auto' },
                whiteSpace: 'nowrap',
                '& .MuiButton-startIcon': {
                  margin: { xs: 0, sm: '0 8px 0 -4px' }
                },
                '& .MuiButton-label, & .MuiTypography-root, & text': {
                  display: { xs: 'none', sm: 'inline-block' }
                }
              }}
            >
              <Typography component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>Emergency Help</Typography>
            </Button>
            <IconButton
              edge="end"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 250 },
        }}
      >
        {drawer}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 250,
            position: 'fixed',
            height: '100%',
          },
        }}
        open
      >
        {drawer}
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - 250px)` },
          ml: { sm: '250px' },
          mt: '64px',
        }}
      >
        <Outlet />
      </Box>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
        PaperProps={{
          sx: {
            minWidth: 200,
            mt: 1.5,
            border: isHighContrast ? '2px solid #FFFF00' : 'none',
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
            <Avatar src={user?.profileImage || user?.avatar} sx={{ width: 40, height: 40, bgcolor: 'primary.main' }}>
              {user?.name?.charAt(0)}
            </Avatar>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                {user?.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                {user?.email}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Divider />
        <MenuItem onClick={() => {
          handleProfileMenuClose();
          navigate('/disabled/dashboard/profile');
        }}>
          <ListItemIcon>
            <AccountIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Profile</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => {
          handleProfileMenuClose();
          navigate('/disabled/dashboard/settings');
        }}>
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Settings</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default DisabledDashboard;