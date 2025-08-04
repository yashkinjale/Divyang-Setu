import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Avatar,
  Grid,
  Button,
  TextField,
  Divider,
  Chip,
  IconButton,
  Card,
  CardContent,
  useTheme,
  Tab,
  Tabs,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Badge,
  LinearProgress
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Work as WorkIcon,
  School as SchoolIcon,
  AccessibilityNew as DisabilityIcon,
  Verified as VerifiedIcon,
  Pending as PendingIcon,
  Error as ErrorIcon,
  Description as DocumentIcon,
  Favorite as WishlistIcon,
  History as HistoryIcon
} from '@mui/icons-material';
import WishlistSection from './WishlistSection';

const ProfilePage = () => {
  const theme = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [profileData, setProfileData] = useState({
    name: 'Rahul Sharma',
    email: 'rahul.sharma@example.com',
    phone: '+91 98765 43210',
    location: 'Mumbai, Maharashtra',
    disabilityType: 'Visual Impairment',
    education: 'B.Tech in Computer Science',
    occupation: 'Software Developer',
    documents: [
      { name: 'Disability Certificate', status: 'verified', date: '15 Mar 2024' },
      { name: 'Income Certificate', status: 'pending', date: '20 Mar 2024' },
      { name: 'Identity Proof', status: 'verified', date: '10 Mar 2024' }
    ],
    wishlist: [
      { item: 'Screen Reader Software', progress: 75 },
      { item: 'Braille Display', progress: 30 }
    ],
    recentActivity: [
      { action: 'Applied for Scholarship', date: '25 Mar 2024' },
      { action: 'Updated Profile', date: '20 Mar 2024' },
      { action: 'Added Wishlist Item', date: '15 Mar 2024' }
    ]
  });

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically save the changes to the backend
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data if needed
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'verified':
        return <VerifiedIcon color="success" />;
      case 'pending':
        return <PendingIcon color="warning" />;
      case 'error':
        return <ErrorIcon color="error" />;
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={3}>
        {/* Profile Header */}
        <Grid item xs={12}>
          <Paper 
            elevation={0}
            sx={{ 
              p: 3, 
              borderRadius: 2,
              background: `linear-gradient(45deg, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
              color: 'white'
            }}
          >
            <Grid container spacing={3} alignItems="center">
              <Grid item>
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  badgeContent={
                    <IconButton 
                      size="small" 
                      sx={{ 
                        bgcolor: 'white',
                        '&:hover': { bgcolor: 'grey.100' }
                      }}
                    >
                      <EditIcon fontSize="small" color="primary" />
                    </IconButton>
                  }
                >
                  <Avatar
                    sx={{ 
                      width: 100, 
                      height: 100,
                      border: '4px solid white'
                    }}
                  >
                    {profileData.name.charAt(0)}
                  </Avatar>
                </Badge>
              </Grid>
              <Grid item xs>
                <Typography variant="h4" gutterBottom>
                  {profileData.name}
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Chip 
                    icon={<DisabilityIcon />} 
                    label={profileData.disabilityType}
                    sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}
                  />
                  <Chip 
                    icon={<WorkIcon />} 
                    label={profileData.occupation}
                    sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}
                  />
                  <Chip 
                    icon={<SchoolIcon />} 
                    label={profileData.education}
                    sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}
                  />
                </Box>
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  startIcon={isEditing ? <SaveIcon /> : <EditIcon />}
                  onClick={isEditing ? handleSave : handleEdit}
                  sx={{ 
                    bgcolor: 'white',
                    color: 'primary.main',
                    '&:hover': {
                      bgcolor: 'grey.100'
                    }
                  }}
                >
                  {isEditing ? 'Save Changes' : 'Edit Profile'}
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Profile Content */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              Contact Information
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <EmailIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Email"
                  secondary={profileData.email}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <PhoneIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Phone"
                  secondary={profileData.phone}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <LocationIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Location"
                  secondary={profileData.location}
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Tabs 
              value={activeTab} 
              onChange={(e, newValue) => setActiveTab(newValue)}
              sx={{ mb: 3 }}
            >
              <Tab icon={<DocumentIcon />} label="Documents" />
              <Tab icon={<WishlistIcon />} label="Wishlist" />
              <Tab icon={<HistoryIcon />} label="Activity" />
            </Tabs>

            {activeTab === 0 && (
              <List>
                {profileData.documents.map((doc, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      {getStatusIcon(doc.status)}
                    </ListItemIcon>
                    <ListItemText 
                      primary={doc.name}
                      secondary={`Last updated: ${doc.date}`}
                    />
                    <Chip 
                      label={doc.status}
                      color={doc.status === 'verified' ? 'success' : 'warning'}
                      size="small"
                    />
                  </ListItem>
                ))}
              </List>
            )}

            {activeTab === 1 && (
              <WishlistSection />
            )}

            {activeTab === 2 && (
              <List>
                {profileData.recentActivity.map((activity, index) => (
                  <ListItem key={index}>
                    <ListItemText 
                      primary={activity.action}
                      secondary={activity.date}
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProfilePage; 