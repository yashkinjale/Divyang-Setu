import React, { useState, useEffect } from 'react';
import {
  Box,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Divider,
  useTheme,
  useMediaQuery,
  Drawer,
  AppBar,
  Toolbar,
  Menu,
  MenuItem,
  IconButton,
  Button,
  Tooltip,
  Avatar,
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
  Help as HelpIcon,
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Description as DocumentIcon,
  Favorite as WishlistIcon,
  TrendingUp as ProgressIcon,
  Business as JobIcon,
  Business as BusinessIcon,
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
      mr: 2
    }}>
      <AccessibilityIcon 
        sx={{ 
          fontSize: 32, 
          color: theme.palette.primary.main 
        }} 
      />
      <Typography 
        variant="h6" 
        sx={{ 
          fontWeight: 'bold',
          background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          display: { xs: 'none', sm: 'block' }
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
  const { logout } = useAuth();
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
            }}
          />
        ))}
      </List>
      <Divider sx={{ my: 2 }} />
      <List>
        <SidebarItem
          icon={SettingsIcon}
          text="Settings"
          onClick={() => navigate('/disabled/dashboard/settings')}
          active={activeSection === 'settings'}
        />
        <SidebarItem
          icon={HelpIcon}
          text="Help & Support"
          onClick={() => navigate('/disabled/dashboard/help')}
          active={activeSection === 'help'}
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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title="Screen Reader Mode">
              <IconButton
                color={screenReader ? 'primary' : 'default'}
                onClick={() => {
                  toggleScreenReader();
                  setTimeout(() => announce(screenReader ? 'Screen reader disabled' : 'Screen reader enabled'), 0);
                }}
              >
                <ScreenReaderIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title={isHighContrast ? "Disable High Contrast Mode" : "Enable High Contrast Mode"}>
              <IconButton
                color={isHighContrast ? 'primary' : 'default'}
                onClick={toggleTheme}
              >
                <ContrastIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Voice Navigation">
              <IconButton
                color={voiceNav ? 'primary' : 'default'}
                onClick={toggleVoiceNav}
              >
                {voiceNav ? <MicIcon /> : <MicOffIcon />}
              </IconButton>
            </Tooltip>
            <Button
              variant="contained"
              color="error"
              startIcon={<WarningIcon />}
              sx={{ ml: 2 }}
            >
              Emergency Help
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
      >
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