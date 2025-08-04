import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Switch,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Paper,
  TextField,
  Avatar,
  Badge,
  Tooltip,
  useTheme,
  useMediaQuery,
  Drawer,
  AppBar,
  Toolbar,
  Menu,
  MenuItem,
  CardMedia,
  CardActions,
  Chip
} from '@mui/material';
import {
  AccessibilityNew as AccessibilityIcon,
  Visibility as ScreenReaderIcon,
  Contrast as ContrastIcon,
  Mic as MicIcon,
  MicOff as MicOffIcon,
  Work as WorkIcon,
  Gavel as GavelIcon,
  Chat as ChatIcon,
  Warning as WarningIcon,
  Forum as ForumIcon,
  Add as AddIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Error as ErrorIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  Help as HelpIcon,
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  List as ListIcon,
  AccountCircle as AccountIcon,
  ExitToApp as LogoutIcon,
  Home as HomeIcon,
  Description as DocumentIcon,
  Favorite as WishlistIcon,
  TrendingUp as ProgressIcon,
  Business as JobIcon,
  Policy as SchemeIcon,
  People as CommunityIcon,
  Message as MessageIcon,
  ArrowForward as ArrowForwardIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import ProfilePage from './ProfilePage';
import WishlistSection from './WishlistSection';

const DashboardCard = ({ title, children, icon: Icon, color = 'primary' }) => {
  const theme = useTheme();
  return (
    <Card sx={{ height: '100%', position: 'relative' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Icon sx={{ color: theme.palette[color].main, mr: 1 }} />
          <Typography variant="h6" component="h2">
            {title}
          </Typography>
        </Box>
        {children}
      </CardContent>
    </Card>
  );
};

const ProgressCard = ({ title, current, target, unit = '₹' }) => {
  const progress = (current / target) * 100;
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <LinearProgress 
          variant="determinate" 
          value={progress} 
          sx={{ height: 10, borderRadius: 5, mb: 1 }}
        />
        <Typography variant="body2" color="text.secondary">
          {unit}{current} of {unit}{target} raised
        </Typography>
      </CardContent>
    </Card>
  );
};

const SidebarItem = ({ icon: Icon, text, onClick, active }) => {
  const theme = useTheme();
  return (
    <ListItem
      button
      onClick={onClick}
      sx={{
        borderRadius: 1,
        mb: 1,
        backgroundColor: active ? theme.palette.primary.light : 'transparent',
        color: active ? theme.palette.primary.main : 'inherit',
        '&:hover': {
          backgroundColor: theme.palette.primary.light,
          color: theme.palette.primary.main,
        },
      }}
    >
      <ListItemIcon sx={{ color: 'inherit' }}>
        <Icon />
      </ListItemIcon>
      <ListItemText primary={text} />
    </ListItem>
  );
};

const SchemeSlider = ({ schemes }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % schemes.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + schemes.length) % schemes.length);
  };

  // Auto slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000); // Change slide every 5 seconds

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []); // Empty dependency array means this effect runs once on mount

  // Pause auto-sliding when user hovers over the slider
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    let interval;
    if (!isPaused) {
      interval = setInterval(() => {
        nextSlide();
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <Box 
      sx={{ 
        position: 'relative', 
        height: { xs: 'auto', sm: 500 },
        overflow: 'hidden', 
        borderRadius: 2,
        bgcolor: 'background.paper',
        boxShadow: 1
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5 }}
          style={{ height: '100%' }}
        >
          <Card sx={{ 
            height: '100%', 
            position: 'relative',
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' }
          }}>
            <CardMedia
              component="img"
              sx={{
                height: { xs: 200, sm: '100%' },
                width: { xs: '100%', sm: '50%' },
                objectFit: 'cover'
              }}
              image={schemes[currentIndex].image}
              alt={schemes[currentIndex].title}
            />
            <Box sx={{ 
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              p: 3
            }}>
              <Typography variant="h5" gutterBottom>
                {schemes[currentIndex].title}
              </Typography>
              <Typography 
                variant="body1" 
                color="text.secondary" 
                paragraph
                sx={{
                  flex: 1,
                  overflow: 'auto',
                  mb: 2
                }}
              >
                {schemes[currentIndex].description}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <Chip 
                  label={schemes[currentIndex].type} 
                  color="primary" 
                  size="small" 
                />
                <Chip 
                  label={schemes[currentIndex].deadline} 
                  color="secondary" 
                  size="small" 
                />
              </Box>
              <Button 
                variant="contained" 
                endIcon={<ArrowForwardIcon />}
                fullWidth
                size="large"
                sx={{ mt: 'auto' }}
              >
                Apply Now
              </Button>
            </Box>
          </Card>
        </motion.div>
      </AnimatePresence>
      
      <IconButton
        onClick={prevSlide}
        sx={{
          position: 'absolute',
          left: 8,
          top: '50%',
          transform: 'translateY(-50%)',
          bgcolor: 'rgba(255, 255, 255, 0.9)',
          '&:hover': { bgcolor: 'rgba(255, 255, 255, 1)' },
          display: { xs: 'none', sm: 'flex' }
        }}
      >
        <ArrowBackIcon />
      </IconButton>
      
      <IconButton
        onClick={nextSlide}
        sx={{
          position: 'absolute',
          right: 8,
          top: '50%',
          transform: 'translateY(-50%)',
          bgcolor: 'rgba(255, 255, 255, 0.9)',
          '&:hover': { bgcolor: 'rgba(255, 255, 255, 1)' },
          display: { xs: 'none', sm: 'flex' }
        }}
      >
        <ArrowForwardIcon />
      </IconButton>

      {/* Mobile Navigation Dots */}
      <Box sx={{ 
        display: { xs: 'flex', sm: 'none' },
        justifyContent: 'center',
        gap: 1,
        p: 2
      }}>
        {schemes.map((_, index) => (
          <IconButton
            key={index}
            size="small"
            onClick={() => setCurrentIndex(index)}
            sx={{
              bgcolor: currentIndex === index ? 'primary.main' : 'grey.300',
              '&:hover': {
                bgcolor: currentIndex === index ? 'primary.dark' : 'grey.400'
              }
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

const FundStatusCard = ({ title, current, target, icon: Icon, color = 'primary' }) => {
  const progress = (current / target) * 100;
  const theme = useTheme();

  return (
    <Card sx={{ height: '100%', position: 'relative', overflow: 'visible' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar 
            sx={{ 
              bgcolor: theme.palette[color].light,
              color: theme.palette[color].main,
              width: 48,
              height: 48,
              mr: 2
            }}
          >
            <Icon />
          </Avatar>
          <Box>
            <Typography variant="h6" component="h2">
              {title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Target: ₹{target.toLocaleString()}
            </Typography>
          </Box>
        </Box>
        <LinearProgress 
          variant="determinate" 
          value={progress} 
          sx={{ 
            height: 10, 
            borderRadius: 5, 
            mb: 1,
            bgcolor: theme.palette[color].lighter,
            '& .MuiLinearProgress-bar': {
              bgcolor: theme.palette[color].main
            }
          }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" color={theme.palette[color].main}>
            ₹{current.toLocaleString()}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {progress.toFixed(1)}% raised
          </Typography>
        </Box>
      </CardContent>
    </Card>
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
  const { logout } = useAuth();
  const [screenReader, setScreenReader] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [voiceNav, setVoiceNav] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [activeSection, setActiveSection] = useState('dashboard');

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

  // Sample data for schemes
  const schemes = [
    {
      title: "National Scholarship for Persons with Disabilities",
      description: "Full scholarship covering tuition fees, accommodation, and monthly stipend for higher education.",
      type: "Education",
      deadline: "30 April 2024",
      image: "https://blogassets.leverageedu.com/media/uploads/2022/10/27134314/scholarships-for-disabled-international-students-in-usa.jpg"
    },
    {
      title: "Assistive Technology Grant",
      description: "Up to ₹50,000 for purchasing assistive devices and technology.",
      type: "Technology",
      deadline: "15 May 2024",
      image: "https://blogassets.leverageedu.com/blog/wp-content/uploads/2020/10/22202124/Scholarships-for-Students-with-Disabilities.jpg"
    },
    {
      title: "Entrepreneurship Development Program",
      description: "Training and seed funding of up to ₹2,00,000 for starting your own business.",
      type: "Business",
      deadline: "1 June 2024",
      image: "https://www.wemakescholars.com/uploads/blog/Scholarship-_-Grants-for-Physically-Disabled-students.webp"
    }
  ];

  // Sample fund data
  const funds = [
    {
      title: "Education Fund",
      current: 75000,
      target: 100000,
      icon: AccessibilityIcon,
      color: "primary"
    },
    {
      title: "Medical Support",
      current: 45000,
      target: 80000,
      icon: WishlistIcon,
      color: "secondary"
    },
    {
      title: "Technology Grant",
      current: 30000,
      target: 50000,
      icon: ProgressIcon,
      color: "success"
    }
  ];

  const sidebarItems = [
    { icon: DashboardIcon, text: 'Dashboard', section: 'dashboard' },
    { icon: DocumentIcon, text: 'Document Verification', section: 'documents' },
    { icon: WishlistIcon, text: 'My Wishlist', section: 'wishlist' },
    { icon: ProgressIcon, text: 'Donation Progress', section: 'progress' },
    { icon: JobIcon, text: 'Job Recommendations', section: 'jobs' },
    { icon: SchemeIcon, text: 'Government Schemes', section: 'schemes' },
    { icon: CommunityIcon, text: 'Community Forum', section: 'community' },
    { icon: MessageIcon, text: 'Messages', section: 'messages' },
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
            onClick={() => setActiveSection(item.section)}
          />
        ))}
      </List>
      <Divider sx={{ my: 2 }} />
      <List>
        <SidebarItem
          icon={SettingsIcon}
          text="Settings"
          onClick={() => setActiveSection('settings')}
          active={activeSection === 'settings'}
        />
        <SidebarItem
          icon={HelpIcon}
          text="Help & Support"
          onClick={() => setActiveSection('help')}
          active={activeSection === 'help'}
        />
      </List>
    </Box>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return <ProfilePage />;
      case 'wishlist':
        return <WishlistSection />;
      case 'dashboard':
      default:
        return (
          <Container maxWidth="xl">
            {/* Government Schemes Slider */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
                Available Schemes & Scholarships
              </Typography>
              <SchemeSlider schemes={schemes} />
            </Box>

            {/* Fund Status Section */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
                Your Fund Status
              </Typography>
              <Grid container spacing={3}>
                {funds.map((fund, index) => (
                  <Grid item xs={12} md={4} key={index}>
                    <FundStatusCard {...fund} />
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Container>
        );
    }
  };

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
                onClick={() => setScreenReader(!screenReader)}
              >
                <ScreenReaderIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="High Contrast Mode">
              <IconButton
                color={highContrast ? 'primary' : 'default'}
                onClick={() => setHighContrast(!highContrast)}
              >
                <ContrastIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Voice Navigation">
              <IconButton
                color={voiceNav ? 'primary' : 'default'}
                onClick={() => setVoiceNav(!voiceNav)}
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
        {renderContent()}
      </Box>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
      >
        <MenuItem onClick={() => {
          handleProfileMenuClose();
          setActiveSection('profile');
        }}>
          <ListItemIcon>
            <AccountIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Profile</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => {
          handleProfileMenuClose();
          setActiveSection('settings');
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