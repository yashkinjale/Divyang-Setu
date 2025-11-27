import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  Badge,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import {
  Chat as ChatIcon,
  VolunteerActivism as DonateIcon,
  Dashboard as DashboardIcon,
  History as HistoryIcon,
  Person as ProfileIcon,
  Notifications as NotificationsIcon,
  Menu as MenuIcon,
  Logout as LogoutIcon,
  Settings as SettingsIcon,
  Favorite as FavoriteIcon,
} from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

const DonorNavbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(3); // Track unread messages

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    handleProfileMenuClose();
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navigationItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/donor/dashboard" },
    { 
      text: "Messages", 
      icon: <ChatIcon />, 
      path: "/donor/messages",
      badge: unreadMessages // Add badge count
    },
    { text: "My Donations", icon: <HistoryIcon />, path: "/donor/donations" },
    { text: "Saved Profiles", icon: <FavoriteIcon />, path: "/donor/saved" },
    { text: "Profile", icon: <ProfileIcon />, path: "/donor/profile" },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
    // Clear unread messages badge when navigating to messages page
    if (path === "/donor/messages") {
      setUnreadMessages(0);
    }
  };

  const drawer = (
    <Box sx={{ width: 250 }}>
      <Box
        sx={{
          p: 2,
          textAlign: "center",
          bgcolor: theme.palette.primary.main,
          color: "white",
        }}
      >
        <DonateIcon sx={{ fontSize: 32, mb: 1 }} />
        <Typography variant="h6" fontWeight="bold">
          Divyang Setu
        </Typography>
        <Typography variant="caption">Donor Portal</Typography>
      </Box>
      <Divider />
      <List>
        {navigationItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => handleNavigation(item.path)}
            selected={location.pathname === item.path}
            sx={{
              "&.Mui-selected": {
                bgcolor: theme.palette.primary.light + "20",
                borderRight: `3px solid ${theme.palette.primary.main}`,
              },
            }}
          >
            <ListItemIcon
              sx={{
                color:
                  location.pathname === item.path
                    ? theme.palette.primary.main
                    : "inherit",
              }}
            >
              {/* Add badge to icon in mobile drawer */}
              {item.badge && item.badge > 0 ? (
                <Badge badgeContent={item.badge} color="error">
                  {item.icon}
                </Badge>
              ) : (
                item.icon
              )}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        <ListItem button onClick={() => handleNavigation("/donor/settings")}>
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary="Settings" />
        </ListItem>
        <ListItem button onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        position="sticky"
        sx={{
          bgcolor: "white",
          color: "text.primary",
          boxShadow: 1,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          {/* Left Side - Logo and Navigation */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {isMobile && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
            )}

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                mr: 4,
              }}
              onClick={() => navigate("/donor/dashboard")}
            >
              <DonateIcon
                sx={{
                  fontSize: 32,
                  color: theme.palette.primary.main,
                  mr: 1,
                }}
              />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "bold",
                  color: theme.palette.primary.main,
                  display: { xs: "none", sm: "block" },
                }}
              >
                Divyang Setu
              </Typography>
            </Box>

            {/* Desktop Navigation */}
            {!isMobile && (
              <Box sx={{ display: "flex", gap: 1 }}>
                {navigationItems.map((item) => (
                  <Button
                    key={item.text}
                    startIcon={
                      item.badge && item.badge > 0 ? (
                        <Badge badgeContent={item.badge} color="error">
                          {item.icon}
                        </Badge>
                      ) : (
                        item.icon
                      )
                    }
                    onClick={() => handleNavigation(item.path)}
                    sx={{
                      color:
                        location.pathname === item.path
                          ? theme.palette.primary.main
                          : "text.primary",
                      bgcolor:
                        location.pathname === item.path
                          ? theme.palette.primary.light + "20"
                          : "transparent",
                      "&:hover": {
                        bgcolor: theme.palette.primary.light + "10",
                      },
                      borderRadius: 2,
                      px: 2,
                    }}
                  >
                    {item.text}
                  </Button>
                ))}
              </Box>
            )}
          </Box>

          {/* Right Side - Notifications and Profile */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton color="inherit">
              <Badge badgeContent={3} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>

            <IconButton onClick={handleProfileMenuOpen} sx={{ p: 0.5 }}>
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  bgcolor: theme.palette.primary.main,
                  border: `2px solid ${theme.palette.primary.light}`,
                }}
              >
                {user?.name?.charAt(0) || "U"}
              </Avatar>
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleProfileMenuClose}
              onClick={handleProfileMenuClose}
              PaperProps={{
                elevation: 3,
                sx: {
                  mt: 1.5,
                  minWidth: 200,
                  "& .MuiAvatar-root": {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                },
              }}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              <MenuItem onClick={() => navigate("/donor/profile")}>
                <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                  {user?.name?.charAt(0) || "U"}
                </Avatar>
                <Box>
                  <Typography variant="subtitle2">
                    {user?.name || "User Name"}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {user?.email || "user@example.com"}
                  </Typography>
                </Box>
              </MenuItem>
              <Divider />
              <MenuItem onClick={() => navigate("/donor/profile")}>
                <ProfileIcon sx={{ mr: 2 }} />
                My Profile
              </MenuItem>
              {/* Add Messages option in profile menu too */}
              <MenuItem onClick={() => handleNavigation("/donor/messages")}>
                {unreadMessages > 0 ? (
                  <Badge badgeContent={unreadMessages} color="error" sx={{ mr: 2 }}>
                    <ChatIcon />
                  </Badge>
                ) : (
                  <ChatIcon sx={{ mr: 2 }} />
                )}
                Messages
              </MenuItem>
              <MenuItem onClick={() => navigate("/donor/settings")}>
                <SettingsIcon sx={{ mr: 2 }} />
                Settings
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout} sx={{ color: "error.main" }}>
                <LogoutIcon sx={{ mr: 2 }} />
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: 250 },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default DonorNavbar;