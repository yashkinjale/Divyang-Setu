import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Chip,
  Avatar,
  Paper,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Divider,
  Grid,
  Alert,
} from "@mui/material";
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Person as PersonIcon,
  LocationOn as LocationIcon,
  Accessibility as AccessibilityIcon,
  AttachMoney as MoneyIcon,
  CardGiftcard as EquipmentIcon,
  Work as WorkIcon,
  Favorite as FavoriteIcon,
  Share as ShareIcon,
  History as HistoryIcon,
  BookmarkBorder as BookmarkIcon,
  Home as HomeIcon,
  Notifications as NotificationIcon,
  Menu as MenuIcon,
  Logout as LogoutIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material";
import {
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  Badge,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

// Enhanced DonorNavbar component
const DonorNavbar = ({ activeTab = "home", onTabChange = () => {} }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [notificationAnchor, setNotificationAnchor] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationOpen = (event) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchor(null);
  };

  const handleMobileDrawerToggle = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };

  const handleTabClick = (tabName) => {
    onTabChange(tabName);
    setMobileDrawerOpen(false);
  };

  const navigationItems = [
    { id: "home", label: "Home", icon: <HomeIcon /> },
    { id: "donations", label: "General Donations", icon: <MoneyIcon /> },
    { id: "jobs", label: "Jobs", icon: <WorkIcon /> }, // <-- Add this line
    { id: "history", label: "Past Donations", icon: <HistoryIcon /> },
    { id: "saved", label: "Saved Donations", icon: <BookmarkIcon /> },
  ];

  const profileMenuItems = [
    {
      label: "Profile",
      icon: <PersonIcon />,
      action: () => handleTabClick("profile"),
    },
    {
      label: "Settings",
      icon: <SettingsIcon />,
      action: () => console.log("Settings"),
    },
    {
      label: "Logout",
      icon: <LogoutIcon />,
      action: () => console.log("Logout"),
    },
  ];

  const notifications = [
    "Thank you message from Priya Sharma",
    "New profile matching your interests",
    "Monthly donation reminder",
  ];

  const DesktopNavigation = () => (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      {navigationItems.map((item) => (
        <Button
          key={item.id}
          startIcon={item.icon}
          onClick={() => handleTabClick(item.id)}
          sx={{
            color: activeTab === item.id ? "primary.main" : "white",
            bgcolor:
              activeTab === item.id
                ? "rgba(255, 255, 255, 0.15)"
                : "transparent",
            "&:hover": {
              bgcolor: "rgba(255, 255, 255, 0.1)",
            },
            borderRadius: 2,
            px: 2,
            py: 1,
            fontWeight: activeTab === item.id ? "bold" : "normal",
          }}
        >
          {item.label}
        </Button>
      ))}
    </Box>
  );

  const MobileDrawer = () => (
    <Drawer
      anchor="left"
      open={mobileDrawerOpen}
      onClose={handleMobileDrawerToggle}
      sx={{
        "& .MuiDrawer-paper": {
          width: 280,
          bgcolor: "#1976d2",
          color: "white",
        },
      }}
    >
      <Box sx={{ p: 2, bgcolor: "#1565c0" }}>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Donor Dashboard
        </Typography>
      </Box>

      <List sx={{ px: 2, py: 1 }}>
        {navigationItems.map((item) => (
          <ListItem
            key={item.id}
            button
            onClick={() => handleTabClick(item.id)}
            sx={{
              borderRadius: 2,
              mb: 0.5,
              bgcolor:
                activeTab === item.id
                  ? "rgba(255, 255, 255, 0.15)"
                  : "transparent",
              "&:hover": {
                bgcolor: "rgba(255, 255, 255, 0.1)",
              },
            }}
          >
            <ListItemIcon sx={{ color: "white", minWidth: 40 }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.label}
              primaryTypographyProps={{
                fontWeight: activeTab === item.id ? "bold" : "normal",
              }}
            />
          </ListItem>
        ))}
      </List>

      <Divider sx={{ bgcolor: "rgba(255, 255, 255, 0.2)", mx: 2, my: 1 }} />

      <List sx={{ px: 2 }}>
        {profileMenuItems.map((item, index) => (
          <ListItem
            key={index}
            button
            onClick={item.action}
            sx={{
              borderRadius: 2,
              mb: 0.5,
              "&:hover": {
                bgcolor: "rgba(255, 255, 255, 0.1)",
              },
            }}
          >
            <ListItemIcon sx={{ color: "white", minWidth: 40 }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );

  return (
    <>
      <AppBar position="sticky" sx={{ bgcolor: "#1976d2", boxShadow: 3 }}>
        <Toolbar sx={{ justifyContent: "space-between", px: { xs: 1, sm: 2 } }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {isMobile && (
              <IconButton
                color="inherit"
                onClick={handleMobileDrawerToggle}
                sx={{ mr: 1 }}
              >
                <MenuIcon />
              </IconButton>
            )}

            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <FavoriteIcon sx={{ color: "#ff4757" }} />
              {!isMobile && "Donor Dashboard"}
              {isMobile && "Dashboard"}
            </Typography>
          </Box>

          {!isMobile && (
            <Box
              sx={{ flex: 1, display: "flex", justifyContent: "center", mx: 4 }}
            >
              <DesktopNavigation />
            </Box>
          )}

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton
              color="inherit"
              onClick={handleNotificationOpen}
              sx={{
                "&:hover": {
                  bgcolor: "rgba(255, 255, 255, 0.1)",
                },
              }}
            >
              <Badge badgeContent={notifications.length} color="error">
                <NotificationIcon />
              </Badge>
            </IconButton>

            <IconButton
              onClick={handleProfileMenuOpen}
              sx={{
                p: 0.5,
                "&:hover": {
                  bgcolor: "rgba(255, 255, 255, 0.1)",
                },
              }}
            >
              <Avatar
                sx={{
                  width: 36,
                  height: 36,
                  bgcolor: "#ff4757",
                  fontSize: "1rem",
                }}
              >
                D
              </Avatar>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
        PaperProps={{
          sx: {
            mt: 1.5,
            minWidth: 200,
            boxShadow: 3,
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <Box sx={{ px: 2, py: 1, bgcolor: "#f5f5f5" }}>
          <Typography variant="subtitle2" fontWeight="bold">
            John Donor
          </Typography>
          <Typography variant="caption" color="text.secondary">
            donor@example.com
          </Typography>
        </Box>
        <Divider />
        {profileMenuItems.map((item, index) => (
          <MenuItem
            key={index}
            onClick={() => {
              item.action();
              handleProfileMenuClose();
            }}
            sx={{
              gap: 1.5,
              py: 1.5,
              "&:hover": {
                bgcolor:
                  item.label === "Logout" ? "error.light" : "action.hover",
              },
            }}
          >
            {item.icon}
            <Typography>{item.label}</Typography>
          </MenuItem>
        ))}
      </Menu>

      <Menu
        anchorEl={notificationAnchor}
        open={Boolean(notificationAnchor)}
        onClose={handleNotificationClose}
        PaperProps={{
          sx: {
            mt: 1.5,
            maxWidth: 320,
            boxShadow: 3,
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <Box sx={{ px: 2, py: 1, bgcolor: "#f5f5f5" }}>
          <Typography variant="subtitle2" fontWeight="bold">
            Notifications
          </Typography>
        </Box>
        <Divider />
        {notifications.length === 0 ? (
          <MenuItem disabled>
            <Typography variant="body2" color="text.secondary">
              No new notifications
            </Typography>
          </MenuItem>
        ) : (
          notifications.map((notification, index) => (
            <MenuItem
              key={index}
              onClick={handleNotificationClose}
              sx={{
                whiteSpace: "normal",
                maxWidth: 300,
                py: 1.5,
              }}
            >
              <Typography variant="body2">{notification}</Typography>
            </MenuItem>
          ))
        )}
      </Menu>

      {isMobile && <MobileDrawer />}
    </>
  );
};

const DonorDashboard = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterLocation, setFilterLocation] = useState("all");
  const [activeTab, setActiveTab] = useState("home");

  // Mock data for PwD profiles
  const mockProfiles = [
    {
      id: 1,
      name: "Priya Sharma",
      age: 28,
      location: "Mumbai, Maharashtra",
      disability: "Visual Impairment",
      needs: ["Braille Display", "Screen Reader Software", "Voice Recognition"],
      story:
        "I am a software developer with visual impairment. I need assistive technology to continue my career in tech and help other developers.",
      goalAmount: 50000,
      raisedAmount: 25000,
      image: "https://i.pravatar.cc/150?img=1",
      urgency: "high",
      category: "technology",
    },
    {
      id: 2,
      name: "Rajesh Patel",
      age: 35,
      location: "Delhi, NCR",
      disability: "Mobility Impairment",
      needs: ["Electric Wheelchair", "Ramp Installation"],
      story:
        "I work as a graphic designer and need a motorized wheelchair for better mobility at work.",
      goalAmount: 80000,
      raisedAmount: 45000,
      image: "https://i.pravatar.cc/150?img=2",
      urgency: "medium",
      category: "mobility",
    },
    {
      id: 3,
      name: "Anita Desai",
      age: 24,
      location: "Bangalore, Karnataka",
      disability: "Hearing Impairment",
      needs: ["Hearing Aids", "Sign Language Training", "Audio Equipment"],
      story:
        "I am pursuing my master's degree and need hearing aids to continue my education effectively.",
      goalAmount: 30000,
      raisedAmount: 15000,
      image: "https://i.pravatar.cc/150?img=3",
      urgency: "high",
      category: "education",
    },
    {
      id: 4,
      name: "Suresh Kumar",
      age: 42,
      location: "Chennai, Tamil Nadu",
      disability: "Multiple Sclerosis",
      needs: ["Mobility Scooter", "Physical Therapy", "Medical Support"],
      story:
        "I run a small business and need mobility assistance to maintain my independence.",
      goalAmount: 120000,
      raisedAmount: 60000,
      image: "https://i.pravatar.cc/150?img=4",
      urgency: "medium",
      category: "mobility",
    },
    {
      id: 5,
      name: "Meera Singh",
      age: 31,
      location: "Pune, Maharashtra",
      disability: "Cerebral Palsy",
      needs: ["Communication Device", "Occupational Therapy"],
      story:
        "I am an artist and need assistive technology to create and sell my artwork online.",
      goalAmount: 40000,
      raisedAmount: 20000,
      image: "https://i.pravatar.cc/150?img=5",
      urgency: "low",
      category: "technology",
    },
    {
      id: 6,
      name: "Vikram Reddy",
      age: 29,
      location: "Hyderabad, Telangana",
      disability: "Spinal Cord Injury",
      needs: ["Adaptive Computer Setup", "Ergonomic Chair"],
      story:
        "I am a data analyst and need specialized equipment to work from home effectively.",
      goalAmount: 60000,
      raisedAmount: 30000,
      image: "https://i.pravatar.cc/150?img=6",
      urgency: "high",
      category: "technology",
    },
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setProfiles(mockProfiles);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredProfiles = profiles.filter((profile) => {
    const matchesSearch =
      profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.disability.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.story.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || profile.category === filterType;
    const matchesLocation =
      filterLocation === "all" ||
      profile.location.toLowerCase().includes(filterLocation.toLowerCase());
    return matchesSearch && matchesType && matchesLocation;
  });

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case "high":
        return "#f44336";
      case "medium":
        return "#ff9800";
      case "low":
        return "#4caf50";
      default:
        return "#9e9e9e";
    }
  };

  const getUrgencyText = (urgency) => {
    switch (urgency) {
      case "high":
        return "Urgent";
      case "medium":
        return "Moderate";
      case "low":
        return "Low Priority";
      default:
        return "Unknown";
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case "technology":
        return <WorkIcon />;
      case "mobility":
        return <AccessibilityIcon />;
      case "education":
        return <PersonIcon />;
      default:
        return <PersonIcon />;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case "technology":
        return "#2196f3";
      case "mobility":
        return "#ff9800";
      case "education":
        return "#4caf50";
      default:
        return "#9e9e9e";
    }
  };

  const ProfileCard = ({ profile }) => {
    const progressPercentage =
      (profile.raisedAmount / profile.goalAmount) * 100;

    return (
      <Card
        sx={{
          height: 520,
          display: "flex",
          flexDirection: "column",
          transition: "transform 0.2s, box-shadow 0.2s",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: 4,
          },
        }}
      >
        <CardContent sx={{ flex: 1, p: 2, pb: 1 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              mb: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                flex: 1,
                minWidth: 0,
              }}
            >
              <Avatar
                src={profile.image}
                sx={{ width: 40, height: 40, mr: 1.5 }}
              >
                <PersonIcon />
              </Avatar>
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: "bold",
                    fontSize: "0.95rem",
                    lineHeight: 1.2,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {profile.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {profile.age} years • {profile.location.split(",")[0]}
                </Typography>
              </Box>
            </Box>
            <Chip
              label={getUrgencyText(profile.urgency)}
              size="small"
              sx={{
                bgcolor: getUrgencyColor(profile.urgency),
                color: "white",
                fontSize: "0.65rem",
                height: 24,
                ml: 1,
              }}
            />
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", mb: 2, gap: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", flex: 1 }}>
              <AccessibilityIcon
                sx={{ mr: 0.5, color: "text.secondary", fontSize: "1rem" }}
              />
              <Typography variant="body2" sx={{ fontSize: "0.8rem" }}>
                {profile.disability}
              </Typography>
            </Box>
            <Chip
              icon={getCategoryIcon(profile.category)}
              label={profile.category}
              size="small"
              variant="outlined"
              sx={{
                color: getCategoryColor(profile.category),
                borderColor: getCategoryColor(profile.category),
                fontSize: "0.65rem",
                height: 24,
                textTransform: "capitalize",
              }}
            />
          </Box>

          <Box sx={{ mb: 2, height: 72 }}>
            <Typography
              variant="body2"
              sx={{
                fontSize: "0.8rem",
                lineHeight: 1.4,
                display: "-webkit-box",
                WebkitLineClamp: 4,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                color: "text.secondary",
              }}
            >
              {profile.story}
            </Typography>
          </Box>

          <Box sx={{ mb: 2, height: 50 }}>
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: "bold", fontSize: "0.8rem", mb: 1 }}
            >
              Needs:
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {profile.needs.slice(0, 2).map((need, index) => (
                <Chip
                  key={index}
                  label={need}
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: "0.65rem", height: 20 }}
                />
              ))}
              {profile.needs.length > 2 && (
                <Chip
                  label={`+${profile.needs.length - 2} more`}
                  size="small"
                  variant="outlined"
                  sx={{
                    fontSize: "0.65rem",
                    height: 20,
                    color: "primary.main",
                  }}
                />
              )}
            </Box>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}
            >
              <Typography variant="caption" color="text.secondary">
                Progress
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {Math.round(progressPercentage)}%
              </Typography>
            </Box>
            <Box
              sx={{
                width: "100%",
                height: 6,
                bgcolor: "#e0e0e0",
                borderRadius: 3,
                mb: 1,
              }}
            >
              <Box
                sx={{
                  width: `${Math.min(progressPercentage, 100)}%`,
                  height: "100%",
                  bgcolor: "primary.main",
                  borderRadius: 3,
                  transition: "width 0.3s ease",
                }}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box>
                <Typography
                  variant="h6"
                  color="primary"
                  sx={{ fontWeight: "bold", fontSize: "1rem" }}
                >
                  ₹{profile.raisedAmount.toLocaleString()}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  of ₹{profile.goalAmount.toLocaleString()} goal
                </Typography>
              </Box>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  bgcolor:
                    progressPercentage > 75
                      ? "success.light"
                      : progressPercentage > 50
                      ? "warning.light"
                      : "error.light",
                  color:
                    progressPercentage > 75
                      ? "success.dark"
                      : progressPercentage > 50
                      ? "warning.dark"
                      : "error.dark",
                  px: 1,
                  py: 0.5,
                  borderRadius: 1,
                  fontSize: "0.7rem",
                }}
              >
                {Math.round(progressPercentage)}% funded
              </Typography>
            </Box>
          </Box>
        </CardContent>

        <Divider />

        <Box sx={{ p: 2, pt: 1.5 }}>
          <Box sx={{ display: "flex", gap: 1, mb: 1.5 }}>
            <Button
              variant="contained"
              startIcon={<MoneyIcon />}
              fullWidth
              sx={{
                bgcolor: "#4caf50",
                "&:hover": { bgcolor: "#45a049" },
                fontSize: "0.8rem",
                py: 1,
              }}
            >
              Donate Money
            </Button>
            <Button
              variant="outlined"
              startIcon={<EquipmentIcon />}
              fullWidth
              sx={{
                borderColor: "#ff9800",
                color: "#ff9800",
                "&:hover": {
                  borderColor: "#f57c00",
                  bgcolor: "rgba(255, 152, 0, 0.04)",
                },
                fontSize: "0.8rem",
                py: 1,
              }}
            >
              Equipment
            </Button>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Button
              size="small"
              startIcon={<FavoriteIcon />}
              sx={{
                color: "text.secondary",
                fontSize: "0.75rem",
                "&:hover": { color: "error.main" },
              }}
            >
              Save
            </Button>
            <Button
              size="small"
              startIcon={<ShareIcon />}
              sx={{
                color: "text.secondary",
                fontSize: "0.75rem",
                "&:hover": { color: "primary.main" },
              }}
            >
              Share
            </Button>
          </Box>
        </Box>
      </Card>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "home":
        return (
          <Box>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h4"
                gutterBottom
                sx={{ fontWeight: "bold", color: "#333" }}
              >
                Help Make a Difference
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Browse profiles of individuals who need your support
              </Typography>
            </Box>

            {/* Search and Filter Bar */}
            <Paper sx={{ p: 3, mb: 4, boxShadow: 2 }}>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "2fr 1fr 1fr 140px" },
                  gap: 2,
                  alignItems: "center",
                }}
              >
                <TextField
                  fullWidth
                  placeholder="Search by name, disability, or story..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ bgcolor: "white" }}
                />
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    label="Category"
                    sx={{ bgcolor: "white" }}
                  >
                    <MenuItem value="all">All Categories</MenuItem>
                    <MenuItem value="technology">Technology</MenuItem>
                    <MenuItem value="mobility">Mobility</MenuItem>
                    <MenuItem value="education">Education</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel>Location</InputLabel>
                  <Select
                    value={filterLocation}
                    onChange={(e) => setFilterLocation(e.target.value)}
                    label="Location"
                    sx={{ bgcolor: "white" }}
                  >
                    <MenuItem value="all">All Locations</MenuItem>
                    <MenuItem value="mumbai">Mumbai</MenuItem>
                    <MenuItem value="delhi">Delhi</MenuItem>
                    <MenuItem value="bangalore">Bangalore</MenuItem>
                    <MenuItem value="chennai">Chennai</MenuItem>
                    <MenuItem value="pune">Pune</MenuItem>
                    <MenuItem value="hyderabad">Hyderabad</MenuItem>
                  </Select>
                </FormControl>
                <Button
                  variant="outlined"
                  startIcon={<FilterIcon />}
                  sx={{ height: "56px", whiteSpace: "nowrap" }}
                >
                  More Filters
                </Button>
              </Box>
            </Paper>

            {/* Results Count */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" color="text.secondary">
                {filteredProfiles.length} profile
                {filteredProfiles.length !== 1 ? "s" : ""} found
              </Typography>
            </Box>

            {/* Profile Cards Grid */}
            {filteredProfiles.length === 0 ? (
              <Paper sx={{ p: 4, textAlign: "center" }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No profiles found
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Try adjusting your search criteria or check back later for new
                  profiles.
                </Typography>
              </Paper>
            ) : (
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "repeat(2, 1fr)",
                    md: "repeat(3, 1fr)",
                  },
                  gap: 3,
                }}
              >
                {filteredProfiles.map((profile) => (
                  <ProfileCard key={profile.id} profile={profile} />
                ))}
              </Box>
            )}
          </Box>
        );

      case "donations":
        return (
          <Box>
            <Typography
              variant="h4"
              gutterBottom
              sx={{ fontWeight: "bold", color: "#333" }}
            >
              General Donations
            </Typography>
            <Alert severity="info" sx={{ mb: 3 }}>
              Make general donations to support our platform and help multiple
              individuals with disabilities.
            </Alert>
            <Paper sx={{ p: 4, textAlign: "center" }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                General Donation Feature
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                This section will allow you to make donations to support the
                platform as a whole, helping us assist more individuals with
                disabilities.
              </Typography>
              <Button variant="contained" size="large" sx={{ mt: 2 }}>
                Make General Donation
              </Button>
            </Paper>
          </Box>
        );

      case "history":
        return (
          <Box>
            <Typography
              variant="h4"
              gutterBottom
              sx={{ fontWeight: "bold", color: "#333" }}
            >
              Past Donations
            </Typography>
            <Paper sx={{ p: 4, textAlign: "center" }}>
              <HistoryIcon
                sx={{ fontSize: 64, color: "text.secondary", mb: 2 }}
              />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No donation history yet
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Your donation history will appear here once you make your first
                donation.
              </Typography>
            </Paper>
          </Box>
        );

      case "saved":
        return (
          <Box>
            <Typography
              variant="h4"
              gutterBottom
              sx={{ fontWeight: "bold", color: "#333" }}
            >
              Saved Donations
            </Typography>
            <Paper sx={{ p: 4, textAlign: "center" }}>
              <BookmarkIcon
                sx={{ fontSize: 64, color: "text.secondary", mb: 2 }}
              />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No saved donations yet
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Save profiles that interest you to review and donate to later.
              </Typography>
            </Paper>
          </Box>
        );

      case "profile":
        return (
          <Box>
            <Typography
              variant="h4"
              gutterBottom
              sx={{ fontWeight: "bold", color: "#333" }}
            >
              My Profile
            </Typography>
            <Paper sx={{ p: 4 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    bgcolor: "#ff4757",
                    mr: 3,
                    fontSize: "2rem",
                  }}
                >
                  D
                </Avatar>
                <Box>
                  <Typography variant="h5" fontWeight="bold">
                    John Donor
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    donor@example.com
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Member since January 2024
                  </Typography>
                </Box>
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 3, bgcolor: "#f5f5f5" }}>
                    <Typography variant="h6" gutterBottom>
                      Donation Stats
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Donated: ₹0
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      People Helped: 0
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Active Donations: 0
                    </Typography>
                  </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 3, bgcolor: "#f5f5f5" }}>
                    <Typography variant="h6" gutterBottom>
                      Preferences
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Preferred Categories: All
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Location: Mumbai, India
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Notification: Enabled
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Paper>
          </Box>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: "100vh", bgcolor: "#f5f5f5" }}>
        <DonorNavbar activeTab={activeTab} onTabChange={setActiveTab} />
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "60vh",
          }}
        >
          <CircularProgress size={60} />
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f5f5" }}>
      <DonorNavbar activeTab={activeTab} onTabChange={setActiveTab} />

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {renderTabContent()}
      </Container>
    </Box>
  );
};

export default DonorDashboard;
