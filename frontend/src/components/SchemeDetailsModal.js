import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Box,
  Grid,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  Card,
  CardContent,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Close as CloseIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Language as WebsiteIcon,
  Description as DocumentIcon,
  CheckCircle as CheckIcon,
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
  Accessible as DisabilityIcon,
  School as EducationIcon,
  Work as WorkIcon,
  LocalHospital as HealthIcon,
  AccountBalance as FinanceIcon,
  Star as StarIcon
} from '@mui/icons-material';

const SchemeDetailsModal = ({ open, scheme, onClose }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  if (!scheme) return null;

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Education':
        return <EducationIcon />;
      case 'Employment':
        return <WorkIcon />;
      case 'Healthcare':
        return <HealthIcon />;
      case 'Financial Aid':
        return <FinanceIcon />;
      case 'Technology':
        return <EducationIcon />;
      case 'Business':
        return <WorkIcon />;
      default:
        return <CheckIcon />;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={fullScreen}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: fullScreen ? 0 : 2,
          maxHeight: fullScreen ? '100%' : '90%'
        }
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {getTypeIcon(scheme.type)}
          <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
            {scheme.name}
          </Typography>
        </Box>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            color: theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={3}>
          {/* Scheme Image */}
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <img
                src={scheme.image}
                alt={scheme.name}
                style={{
                  width: '100%',
                  height: '200px',
                  objectFit: 'cover',
                  borderRadius: '8px 8px 0 0'
                }}
              />
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <StarIcon sx={{ color: 'warning.main' }} />
                  <Typography variant="body2" color="text.secondary">
                    {scheme.rating} rating • {scheme.applications} applications
                  </Typography>
                </Box>
                {scheme.isRecommended && (
                  <Chip
                    label="Recommended"
                    color="primary"
                    size="small"
                    icon={<StarIcon />}
                    sx={{ mb: 2 }}
                  />
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Scheme Details */}
          <Grid item xs={12} md={8}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Description
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                {scheme.description}
              </Typography>
            </Box>

            {/* Key Information */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <CalendarIcon sx={{ color: 'primary.main' }} />
                  <Typography variant="body2" color="text.secondary">
                    Deadline: {scheme.deadline}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <LocationIcon sx={{ color: 'primary.main' }} />
                  <Typography variant="body2" color="text.secondary">
                    Location: {scheme.location}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <DisabilityIcon sx={{ color: 'primary.main' }} />
                  <Typography variant="body2" color="text.secondary">
                    Disability Type: {scheme.disabilityType}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <CheckIcon sx={{ color: 'primary.main' }} />
                  <Typography variant="body2" color="text.secondary">
                    Age Group: {scheme.ageGroup}
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            {/* Benefits */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Benefits
              </Typography>
              <Typography variant="body1" color="primary.main" sx={{ fontWeight: 'bold' }}>
                {scheme.benefits}
              </Typography>
            </Box>

            {/* Eligibility */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Eligibility Criteria
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {scheme.eligibility}
              </Typography>
            </Box>

            {/* Required Documents */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Required Documents
              </Typography>
              <List dense>
                {scheme.documents.map((doc, index) => (
                  <ListItem key={index} sx={{ py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <DocumentIcon sx={{ fontSize: 20, color: 'primary.main' }} />
                    </ListItemIcon>
                    <ListItemText primary={doc} />
                  </ListItem>
                ))}
              </List>
            </Box>

            {/* Contact Information */}
            <Box>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Contact Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PhoneIcon sx={{ color: 'primary.main' }} />
                    <Typography variant="body2">
                      {scheme.contact.phone}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <EmailIcon sx={{ color: 'primary.main' }} />
                    <Typography variant="body2">
                      {scheme.contact.email}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <WebsiteIcon sx={{ color: 'primary.main' }} />
                    <Typography variant="body2">
                      {scheme.contact.website}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3, gap: 2 }}>
        <Button onClick={onClose} color="inherit">
          Close
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            // Handle apply action
            console.log('Apply for scheme:', scheme.name);
            onClose();
          }}
          startIcon={<CheckIcon />}
        >
          Apply Now
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SchemeDetailsModal; 