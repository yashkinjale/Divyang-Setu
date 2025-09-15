import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
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
  Alert,
  Divider,
  useTheme,
  useMediaQuery,
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
} from "@mui/icons-material";
import DonorNavbar from "./DonorNavbar";

const DonorDashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterLocation, setFilterLocation] = useState("all");

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
    const progressPercentage = (profile.raisedAmount / profile.goalAmount) * 100;

    return (
      <Box sx={{ height: "100%" }}>
        <Card
          sx={{
            height: "480px", // EXACT fixed height
            minHeight: "480px", // Enforce minimum
            maxHeight: "480px", // Enforce maximum
            display: "block", // Use block instead of flex
            position: "relative",
            transition: "transform 0.2s, box-shadow 0.2s",
            "&:hover": {
              transform: "translateY(-4px)",
              boxShadow: 4,
            },
          }}
        >
          {/* Card Content - Absolute positioning */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: "120px", // Leave space for buttons
              p: 2,
              overflow: "hidden",
            }}
          >
            {/* Header */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                mb: 1.5,
                height: "50px",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Avatar
                  src={profile.image}
                  sx={{ width: 36, height: 36, mr: 1 }}
                >
                  <PersonIcon />
                </Avatar>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: "bold", fontSize: "0.85rem", lineHeight: 1.2 }}>
                    {profile.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.7rem" }}>
                    {profile.age} years • {profile.location.split(',')[0]}
                  </Typography>
                </Box>
              </Box>
              <Chip
                label={getUrgencyText(profile.urgency)}
                size="small"
                sx={{
                  bgcolor: getUrgencyColor(profile.urgency),
                  color: "white",
                  fontSize: "0.6rem",
                  height: "20px",
                }}
              />
            </Box>

            {/* Disability */}
            <Box sx={{ display: "flex", alignItems: "center", mb: 1.5, height: "24px" }}>
              <AccessibilityIcon sx={{ mr: 1, color: "text.secondary", fontSize: "1rem" }} />
              <Typography variant="caption" sx={{ fontSize: "0.7rem", mr: 1 }}>
                {profile.disability}
              </Typography>
              <Chip
                icon={getCategoryIcon(profile.category)}
                label={profile.category}
                size="small"
                variant="outlined"
                sx={{
                  color: getCategoryColor(profile.category),
                  borderColor: getCategoryColor(profile.category),
                  fontSize: "0.6rem",
                  height: "20px",
                }}
              />
            </Box>

            {/* Story */}
            <Box sx={{ mb: 1.5, height: "54px" }}>
              <Typography
                variant="body2"
                sx={{
                  fontSize: "0.75rem",
                  lineHeight: 1.3,
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {profile.story}
              </Typography>
            </Box>

            {/* Needs */}
            <Box sx={{ mb: 1.5, height: "40px" }}>
              <Typography variant="caption" sx={{ fontWeight: "bold", fontSize: "0.7rem", display: "block", mb: 0.5 }}>
                Needs:
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.3 }}>
                {profile.needs.slice(0, 2).map((need, index) => (
                  <Chip
                    key={index}
                    label={need}
                    size="small"
                    variant="outlined"
                    sx={{ fontSize: "0.55rem", height: "16px" }}
                  />
                ))}
                {profile.needs.length > 2 && (
                  <Chip
                    label={`+${profile.needs.length - 2}`}
                    size="small"
                    variant="outlined"
                    sx={{ fontSize: "0.55rem", height: "16px" }}
                  />
                )}
              </Box>
            </Box>

            {/* Progress */}
            <Box sx={{ position: "absolute", bottom: "60px", left: 16, right: 16 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.65rem" }}>
                  Progress
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.65rem" }}>
                  {Math.round(progressPercentage)}%
                </Typography>
              </Box>
              <Box
                sx={{
                  width: "100%",
                  height: 4,
                  bgcolor: "#e0e0e0",
                  borderRadius: 2,
                }}
              >
                <Box
                  sx={{
                    width: `${progressPercentage}%`,
                    height: "100%",
                    bgcolor: theme.palette.primary.main,
                  }}
                />
              </Box>
            </Box>

            {/* Amount */}
            <Box sx={{ position: "absolute", bottom: "16px", left: 16, right: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Box>
                <Typography variant="subtitle2" color="primary" sx={{ fontWeight: "bold", fontSize: "0.9rem" }}>
                  ₹{profile.raisedAmount.toLocaleString()}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.65rem" }}>
                  of ₹{profile.goalAmount.toLocaleString()} goal
                </Typography>
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.65rem" }}>
                {Math.round(progressPercentage)}% funded
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ position: "absolute", bottom: "120px", left: 0, right: 0 }} />

          {/* Buttons - Absolute positioning at bottom */}
          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "120px",
              p: 2,
            }}
          >
            <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
              <Button
                variant="contained"
                startIcon={<MoneyIcon sx={{ fontSize: "0.9rem" }} />}
                size="small"
                sx={{
                  flex: 1,
                  bgcolor: "#4caf50",
                  "&:hover": { bgcolor: "#45a049" },
                  fontSize: "0.7rem",
                  py: 0.5,
                }}
              >
                Donate Money
              </Button>
              <Button
                variant="outlined"
                startIcon={<EquipmentIcon sx={{ fontSize: "0.9rem" }} />}
                size="small"
                sx={{
                  flex: 1,
                  borderColor: "#ff9800",
                  color: "#ff9800",
                  fontSize: "0.7rem",
                  py: 0.5,
                }}
              >
                Equipment
              </Button>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Button
                size="small"
                startIcon={<FavoriteIcon sx={{ fontSize: "0.8rem" }} />}
                sx={{ color: "text.secondary", fontSize: "0.65rem" }}
              >
                Save
              </Button>
              <Button
                size="small"
                startIcon={<ShareIcon sx={{ fontSize: "0.8rem" }} />}
                sx={{ color: "text.secondary", fontSize: "0.65rem" }}
              >
                Share
              </Button>
            </Box>
          </Box>
        </Card>
      </Box>
    );
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: "100vh", bgcolor: "#f5f5f5" }}>
        <DonorNavbar />
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
      <DonorNavbar />

      <Container maxWidth="xl" sx={{ py: 4 }}>
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
        <Paper
          sx={{
            p: 3,
            mb: 4,
            boxShadow: 2,
          }}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
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
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
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
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
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
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                variant="outlined"
                startIcon={<FilterIcon />}
                fullWidth
                sx={{
                  height: "56px",
                  borderColor: theme.palette.primary.main,
                  color: theme.palette.primary.main,
                }}
              >
                More Filters
              </Button>
            </Grid>
          </Grid>
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
          <Grid container spacing={3}>
            {filteredProfiles.map((profile) => (
              <Grid item xs={12} sm={6} md={4} key={profile.id}>
                <ProfileCard profile={profile} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default DonorDashboard;