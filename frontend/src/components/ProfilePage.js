import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  Paper,
  Chip,
  Avatar,
  Divider,
  Tab,
  Tabs,
  Alert,
  CircularProgress,
  LinearProgress,
  IconButton,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Close as CloseIcon,
  LocationOn as LocationOnIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Work as WorkIcon,
  School as SchoolIcon,
  Visibility as VisibilityIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Warning as WarningIcon,
  Description as DescriptionIcon,
  Favorite as FavoriteIcon,
  Timeline as TimelineIcon,
  Person as PersonIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { disabledApi } from '../utils/api';

const ProfilePage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    address: "",
    bio: "", // Added bio field
    disabilityType: "",
    needs: "",
    education: "",
    occupation: "",
    documents: [],
    wishlist: [],
    recentActivity: [],
    isVerified: false,
    verificationStatus: "pending",
    profileCompletionPercentage: 0,
  });

  const [editedData, setEditedData] = useState({});

  // Get auth token from localStorage
  const getAuthToken = () => {
    return localStorage.getItem("token");
  };

  // Fetch profile data from backend
  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await disabledApi.getProfile();
      const data = response.data;
      setProfileData(data);
      setEditedData(data);
    } catch (err) {
      console.error("Error fetching profile:", err);
      if (err.response?.status === 401) {
        setError("Session expired. Please log in again.");
      } else {
        setError("Failed to load profile data. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async () => {
    try {
      setSaving(true);
      const payload = {
        name: editedData.name,
        email: editedData.email,
        phone: editedData.phone,
        location: editedData.location,
        address: editedData.address,
        bio: editedData.bio, // Include bio in payload
        disabilityType: editedData.disabilityType,
        needs: editedData.needs,
        education: editedData.education,
        occupation: editedData.occupation,
      };

      const response = await disabledApi.updateProfile(payload);
      const result = response.data;

      setSuccessMessage(result.message || "Profile updated successfully!");
      setProfileData(editedData);
      setIsEditing(false);

      setTimeout(() => {
        fetchProfile();
      }, 1000);
    } catch (err) {
      console.error("Error updating profile:", err);
      if (err.response?.status === 401) {
        setError("Session expired. Please log in again.");
      } else {
        setError(
          err.response?.data?.message ||
            "Failed to update profile. Please try again."
        );
      }
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedData({ ...profileData });
  };

  const handleSave = () => {
    updateProfile();
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedData({ ...profileData });
  };

  const handleInputChange = (field, value) => {
    setEditedData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "verified":
        return <CheckCircleIcon sx={{ color: 'success.main' }} />;
      case "pending":
        return <ScheduleIcon sx={{ color: 'warning.main' }} />;
      case "error":
      case "rejected":
        return <WarningIcon sx={{ color: 'error.main' }} />;
      default:
        return <ScheduleIcon sx={{ color: 'grey.400' }} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "verified":
        return "success";
      case "pending":
        return "warning";
      case "error":
      case "rejected":
        return "error";
      default:
        return "default";
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        bgcolor: 'background.default'
      }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  const TabPanel = ({ children, value, index }) => (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="xl">
        {/* Success/Error Messages */}
        <AnimatePresence>
          {(error || successMessage) && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Alert 
                severity={error ? "error" : "success"}
                action={
                  <IconButton
                    color="inherit"
                    size="small"
                    onClick={() => {
                      setError(null);
                      setSuccessMessage("");
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                }
                sx={{ mb: 3 }}
              >
                {error || successMessage}
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Paper elevation={2} sx={{ p: 4, mb: 4, borderRadius: 2 }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={8}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 2 }}>
                  <Box sx={{ position: 'relative' }}>
                    <Avatar
                      sx={{ 
                        width: 100, 
                        height: 100, 
                        bgcolor: 'primary.light',
                        fontSize: '2.5rem'
                      }}
                      src={profileData.profileImage}
                    >
                      {profileData.profileImage ? null : <PersonIcon sx={{ fontSize: '3rem' }} />}
                    </Avatar>
                    {profileData.isVerified && (
                      <CheckCircleIcon
                        sx={{
                          position: 'absolute',
                          bottom: -4,
                          right: -4,
                          color: 'success.main',
                          bgcolor: 'white',
                          borderRadius: '50%',
                          fontSize: '2rem'
                        }}
                      />
                    )}
                  </Box>

                  <Box sx={{ flex: 1 }}>
                    {isEditing ? (
                      <TextField
                        value={editedData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        variant="outlined"
                        size="medium"
                        fullWidth
                        sx={{ mb: 2, maxWidth: 400 }}
                        InputProps={{
                          sx: { fontSize: '1.5rem', fontWeight: 'bold' }
                        }}
                      />
                    ) : (
                      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                        {profileData.name}
                      </Typography>
                    )}

                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                      <Chip
                        icon={<VisibilityIcon />}
                        label={profileData.disabilityType || "Not specified"}
                        variant="outlined"
                        color="primary"
                        size="small"
                      />
                      <Chip
                        icon={<WorkIcon />}
                        label={profileData.occupation || "Not specified"}
                        variant="outlined"
                        color="primary"
                        size="small"
                      />
                      <Chip
                        icon={<SchoolIcon />}
                        label={profileData.education || "Not specified"}
                        variant="outlined"
                        color="primary"
                        size="small"
                      />
                    </Box>

                    {profileData.profileCompletionPercentage < 100 && (
                      <Box sx={{ maxWidth: 400 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          Profile Completion: {profileData.profileCompletionPercentage}%
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={profileData.profileCompletionPercentage}
                          sx={{ height: 8, borderRadius: 1 }}
                        />
                      </Box>
                    )}
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} md={4} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                <Box sx={{ display: 'flex', gap: 1, justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
                  <Button
                    variant="contained"
                    startIcon={saving ? <CircularProgress size={16} color="inherit" /> : (isEditing ? <SaveIcon /> : <EditIcon />)}
                    onClick={isEditing ? handleSave : handleEdit}
                    disabled={saving}
                    size="large"
                  >
                    {saving ? "Saving..." : (isEditing ? "Save Changes" : "Edit Profile")}
                  </Button>
                  {isEditing && (
                    <Button
                      variant="outlined"
                      startIcon={<CloseIcon />}
                      onClick={handleCancel}
                      size="large"
                    >
                      Cancel
                    </Button>
                  )}
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </motion.div>

        <Grid container spacing={3}>
          {/* Contact Information */}
          <Grid item xs={12} lg={4}>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Paper elevation={1} sx={{ p: 3, height: 'fit-content' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                  Contact Information
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {[
                    { icon: <EmailIcon color="primary" />, label: "Email", field: "email", type: "email" },
                    { icon: <PhoneIcon color="primary" />, label: "Phone", field: "phone", type: "tel" },
                    { icon: <LocationOnIcon color="primary" />, label: "Location", field: "location", type: "text" }
                  ].map(({ icon, label, field, type }) => (
                    <Box key={field} sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                      <Box sx={{ 
                        p: 1, 
                        bgcolor: 'primary.50', 
                        borderRadius: 1,
                        display: 'flex',
                        alignItems: 'center',
                        minWidth: 40,
                        height: 40
                      }}>
                        {icon}
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 'medium', mb: 0.5 }}>
                          {label}
                        </Typography>
                        {isEditing ? (
                          <TextField
                            type={type}
                            value={editedData[field]}
                            onChange={(e) => handleInputChange(field, e.target.value)}
                            fullWidth
                            size="small"
                            variant="outlined"
                          />
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            {profileData[field] || "Not provided"}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  ))}
                </Box>

                {/* Bio Section */}
                <Divider sx={{ my: 3 }} />
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Box sx={{ 
                    p: 1, 
                    bgcolor: 'primary.50', 
                    borderRadius: 1,
                    display: 'flex',
                    alignItems: 'center',
                    minWidth: 40,
                    height: 40
                  }}>
                    <InfoIcon color="primary" />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 'medium', mb: 0.5 }}>
                      Bio
                    </Typography>
                    {isEditing ? (
                      <TextField
                        value={editedData.bio || ""}
                        onChange={(e) => handleInputChange("bio", e.target.value)}
                        fullWidth
                        multiline
                        rows={4}
                        variant="outlined"
                        size="small"
                        placeholder="Tell us about yourself..."
                        inputProps={{ maxLength: 500 }}
                        helperText={`${(editedData.bio || "").length}/500 characters`}
                      />
                    ) : (
                      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                        {profileData.bio || "No bio added yet"}
                      </Typography>
                    )}
                  </Box>
                </Box>

                {isEditing && (
                  <>
                    <Divider sx={{ my: 3 }} />
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                      Additional Information
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {[
                        { label: "Disability Type", field: "disabilityType", multiline: false },
                        { label: "Education", field: "education", multiline: false },
                        { label: "Occupation", field: "occupation", multiline: false },
                        { label: "Address", field: "address", multiline: true, rows: 2 },
                        { label: "Needs/Requirements", field: "needs", multiline: true, rows: 3 }
                      ].map(({ label, field, multiline, rows }) => (
                        <TextField
                          key={field}
                          label={label}
                          value={editedData[field] || ""}
                          onChange={(e) => handleInputChange(field, e.target.value)}
                          fullWidth
                          multiline={multiline}
                          rows={rows}
                          variant="outlined"
                          size="small"
                        />
                      ))}
                    </Box>
                  </>
                )}
              </Paper>
            </motion.div>
          </Grid>

          {/* Main Content */}
          <Grid item xs={12} lg={8}>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Paper elevation={1} sx={{ minHeight: 600 }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    aria-label="profile tabs"
                    variant={isMobile ? "scrollable" : "fullWidth"}
                    scrollButtons="auto"
                  >
                    <Tab icon={<DescriptionIcon />} label="Documents" />
                    <Tab icon={<FavoriteIcon />} label="Wishlist" />
                    <Tab icon={<TimelineIcon />} label="Activity" />
                  </Tabs>
                </Box>

                {/* Documents Tab */}
                <TabPanel value={activeTab} index={0}>
                  {profileData.documents.length === 0 ? (
                    <Box sx={{ 
                      textAlign: 'center', 
                      py: 8,
                      color: 'text.secondary'
                    }}>
                      <DescriptionIcon sx={{ fontSize: 64, mb: 2, opacity: 0.5 }} />
                      <Typography variant="h6" gutterBottom>
                        No documents uploaded yet
                      </Typography>
                      <Typography variant="body2">
                        Upload your documents to get verified
                      </Typography>
                    </Box>
                  ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {profileData.documents.map((doc, index) => (
                        <Card key={doc._id || index} variant="outlined" sx={{ '&:hover': { bgcolor: 'action.hover' } }}>
                          <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Box sx={{ 
                                  p: 1, 
                                  bgcolor: 'primary.50', 
                                  borderRadius: 1,
                                  display: 'flex',
                                  alignItems: 'center'
                                }}>
                                  {getStatusIcon(doc.status)}
                                </Box>
                                <Box>
                                  <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                                    {doc.name}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    Last updated: {doc.date}
                                  </Typography>
                                </Box>
                              </Box>
                              <Chip
                                label={doc.status}
                                color={getStatusColor(doc.status)}
                                size="small"
                              />
                            </Box>
                          </CardContent>
                        </Card>
                      ))}
                    </Box>
                  )}
                </TabPanel>

                {/* Wishlist Tab */}
                <TabPanel value={activeTab} index={1}>
                  {profileData.wishlist.length === 0 ? (
                    <Box sx={{ 
                      textAlign: 'center', 
                      py: 8,
                      color: 'text.secondary'
                    }}>
                      <FavoriteIcon sx={{ fontSize: 64, mb: 2, opacity: 0.5 }} />
                      <Typography variant="h6" gutterBottom>
                        No wishlist items yet
                      </Typography>
                      <Typography variant="body2">
                        Add items you need to your wishlist
                      </Typography>
                    </Box>
                  ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                      {profileData.wishlist.map((item, index) => (
                        <Card key={item._id || index} variant="outlined">
                          <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                              <Box>
                                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                                  {item.item}
                                </Typography>
                                {item.description && (
                                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                    {item.description}
                                  </Typography>
                                )}
                              </Box>
                              <Chip
                                label={`${item.priority || 'medium'} priority`}
                                color={
                                  item.priority === "high" ? "error" :
                                  item.priority === "medium" ? "warning" : "success"
                                }
                                size="small"
                              />
                            </Box>

                            {item.estimatedCost && (
                              <Box sx={{ mb: 2 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                  <Typography variant="body2">Progress</Typography>
                                  <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                    ₹{item.currentAmount || 0} / ₹{item.targetAmount}
                                  </Typography>
                                </Box>
                                <LinearProgress
                                  variant="determinate"
                                  value={item.progress}
                                  sx={{ height: 8, borderRadius: 1, mb: 1 }}
                                />
                                <Typography variant="caption" color="text.secondary">
                                  {item.progress}% completed
                                </Typography>
                              </Box>
                            )}

                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                              <Chip label={item.category} size="small" variant="outlined" />
                              <Chip
                                label={item.isCompleted ? "Completed" : "In Progress"}
                                color={item.isCompleted ? "success" : "primary"}
                                size="small"
                              />
                              {item.quantity && (
                                <Chip label={`Qty: ${item.quantity}`} size="small" variant="outlined" />
                              )}
                            </Box>
                          </CardContent>
                        </Card>
                      ))}
                    </Box>
                  )}
                </TabPanel>

                {/* Activity Tab */}
                <TabPanel value={activeTab} index={2}>
                  {profileData.recentActivity.length === 0 ? (
                    <Box sx={{ 
                      textAlign: 'center', 
                      py: 8,
                      color: 'text.secondary'
                    }}>
                      <TimelineIcon sx={{ fontSize: 64, mb: 2, opacity: 0.5 }} />
                      <Typography variant="h6" gutterBottom>
                        No recent activity
                      </Typography>
                      <Typography variant="body2">
                        Your activity will appear here
                      </Typography>
                    </Box>
                  ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {profileData.recentActivity.map((activity, index) => (
                        <Card key={index} variant="outlined" sx={{ '&:hover': { bgcolor: 'action.hover' } }}>
                          <CardContent>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                              <Avatar sx={{ bgcolor: 'primary.light', width: 40, height: 40 }}>
                                <TimelineIcon />
                              </Avatar>
                              <Box sx={{ flex: 1 }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 'medium', mb: 1 }}>
                                  {activity.action}
                                </Typography>
                                {activity.description && (
                                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                    {activity.description}
                                  </Typography>
                                )}
                                <Typography variant="caption" color="text.secondary">
                                  {activity.date}
                                </Typography>
                              </Box>
                            </Box>
                          </CardContent>
                        </Card>
                      ))}
                    </Box>
                  )}
                </TabPanel>
              </Paper>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ProfilePage;