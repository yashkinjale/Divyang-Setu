import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  FormGroup,
  Chip,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Alert,
  Snackbar,
  CircularProgress,
  Divider
} from '@mui/material';
import {
  Business as BusinessIcon,
  Work as WorkIcon,
  AttachMoney as MoneyIcon,
  Code as SkillsIcon,
  Accessibility as AccessibilityIcon,
  CheckCircle as CheckIcon
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { motion, AnimatePresence } from 'framer-motion';

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.4, ease: "easeOut" }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const slideIn = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.4, ease: "easeOut" }
  }
};

const JobPostings = () => {
  const theme = useTheme();
  const { user, isAuthenticated } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [skills, setSkills] = useState([]);
  const [currentSkill, setCurrentSkill] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    type: 'Full-time',
    salaryMin: '',
    salaryMax: '',
    description: '',
    requiredSkills: [],
    additionalFeatures: '',
    accessibility: {
      remoteJob: false,
      wheelchairAccessible: false,
      signLanguageSupport: false,
      colorBlindFriendly: false
    },
    contactEmail: '',
    applicationDeadline: ''
  });

  // Stepper steps
  const steps = [
    'Job Information',
    'Skills & Requirements', 
    'Accessibility & Features',
    'Review & Submit'
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('accessibility.')) {
      const accessibilityKey = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        accessibility: {
          ...prev.accessibility,
          [accessibilityKey]: checked
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleAddSkill = () => {
    if (currentSkill.trim() && !skills.includes(currentSkill.trim())) {
      const newSkills = [...skills, currentSkill.trim()];
      setSkills(newSkills);
      setFormData(prev => ({
        ...prev,
        requiredSkills: newSkills
      }));
      setCurrentSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    const newSkills = skills.filter(skill => skill !== skillToRemove);
    setSkills(newSkills);
    setFormData(prev => ({
      ...prev,
      requiredSkills: newSkills
    }));
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      // Prepare data for API
      const jobData = {
        ...formData,
        salary: formData.salaryMin && formData.salaryMax 
          ? `₹${formData.salaryMin} - ₹${formData.salaryMax}` 
          : formData.salaryMin || formData.salaryMax,
        accessibility: Object.keys(formData.accessibility)
          .filter(key => formData.accessibility[key])
          .map(key => {
            const mapping = {
              remoteJob: 'Remote Friendly',
              wheelchairAccessible: 'Wheelchair Accessible',
              signLanguageSupport: 'Sign Language Support',
              colorBlindFriendly: 'Colorblind Friendly UI'
            };
            return mapping[key];
          })
      };

      const response = await api.post('/job-postings', jobData);
      
      if (response.data.success) {
        setSnackbar({ 
          open: true, 
          message: 'Job posting created successfully!', 
          severity: 'success' 
        });
        
        // Reset form
        setFormData({
          title: '',
          company: '',
          location: '',
          type: 'Full-time',
          salaryMin: '',
          salaryMax: '',
          description: '',
          requiredSkills: [],
          additionalFeatures: '',
          accessibility: {
            remoteJob: false,
            wheelchairAccessible: false,
            signLanguageSupport: false,
            colorBlindFriendly: false
          },
          contactEmail: '',
          applicationDeadline: ''
        });
        setSkills([]);
        setActiveStep(0);
      }
    } catch (error) {
      console.error('Error creating job posting:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Error creating job posting',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const isStepValid = (step) => {
    switch (step) {
      case 0:
        return formData.title && formData.company && formData.location && formData.description;
      case 1:
        return formData.requiredSkills.length > 0;
      case 2:
        return true; // Accessibility is optional
      case 3:
        return formData.contactEmail && formData.applicationDeadline;
      default:
        return false;
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <motion.div variants={slideIn}>
                  <Typography variant="h6" gutterBottom sx={{ color: '#007BFF', fontWeight: 'bold' }}>
                    <WorkIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Basic Job Information
                  </Typography>
                </motion.div>
              </Grid>
              <Grid item xs={12} md={6}>
                <motion.div variants={slideIn}>
                  <TextField
                    fullWidth
                    label="Job Title *"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g., Frontend Developer"
                    required
                  />
                </motion.div>
              </Grid>
              <Grid item xs={12} md={6}>
                <motion.div variants={slideIn}>
                  <TextField
                    fullWidth
                    label="Company Name *"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    placeholder="e.g., TechCorp Solutions"
                    required
                  />
                </motion.div>
              </Grid>
              <Grid item xs={12} md={6}>
                <motion.div variants={slideIn}>
                  <TextField
                    fullWidth
                    label="Location *"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="e.g., Mumbai, India"
                    required
                  />
                </motion.div>
              </Grid>
              <Grid item xs={12} md={6}>
                <motion.div variants={slideIn}>
                  <FormControl fullWidth required>
                    <InputLabel>Job Type</InputLabel>
                    <Select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      label="Job Type"
                    >
                      <MenuItem value="Full-time">Full-time</MenuItem>
                      <MenuItem value="Part-time">Part-time</MenuItem>
                      <MenuItem value="Contract">Contract</MenuItem>
                      <MenuItem value="Internship">Internship</MenuItem>
                    </Select>
                  </FormControl>
                </motion.div>
              </Grid>
              <Grid item xs={12} md={6}>
                <motion.div variants={slideIn}>
                  <TextField
                    fullWidth
                    label="Minimum Salary (₹)"
                    name="salaryMin"
                    type="number"
                    value={formData.salaryMin}
                    onChange={handleInputChange}
                    placeholder="e.g., 500000"
                  />
                </motion.div>
              </Grid>
              <Grid item xs={12} md={6}>
                <motion.div variants={slideIn}>
                  <TextField
                    fullWidth
                    label="Maximum Salary (₹)"
                    name="salaryMax"
                    type="number"
                    value={formData.salaryMax}
                    onChange={handleInputChange}
                    placeholder="e.g., 800000"
                  />
                </motion.div>
              </Grid>
              <Grid item xs={12}>
                <motion.div variants={slideIn}>
                  <TextField
                    fullWidth
                    label="Job Description *"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    multiline
                    rows={6}
                    placeholder="Describe the role, responsibilities, and what makes this opportunity special..."
                    required
                  />
                </motion.div>
              </Grid>
            </Grid>
          </motion.div>
        );

      case 1:
        return (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <motion.div variants={slideIn}>
                  <Typography variant="h6" gutterBottom sx={{ color: '#007BFF', fontWeight: 'bold' }}>
                    <SkillsIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Required Skills & Additional Features
                  </Typography>
                </motion.div>
              </Grid>
              <Grid item xs={12}>
                <motion.div variants={slideIn}>
                  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <TextField
                      fullWidth
                      label="Add Required Skill"
                      value={currentSkill}
                      onChange={(e) => setCurrentSkill(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                      placeholder="e.g., React, Python, Communication"
                    />
                    <Button
                      variant="contained"
                      onClick={handleAddSkill}
                      sx={{ 
                        bgcolor: '#007BFF', 
                        '&:hover': { bgcolor: '#0056b3' },
                        minWidth: '120px'
                      }}
                    >
                      Add Skill
                    </Button>
                  </Box>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                    <AnimatePresence>
                      {skills.map((skill, index) => (
                        <motion.div
                          key={skill}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Chip
                            label={skill}
                            onDelete={() => handleRemoveSkill(skill)}
                            color="primary"
                            variant="outlined"
                          />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </Box>
                </motion.div>
              </Grid>
              <Grid item xs={12}>
                <motion.div variants={slideIn}>
                  <TextField
                    fullWidth
                    label="Additional Features (Optional)"
                    name="additionalFeatures"
                    value={formData.additionalFeatures}
                    onChange={handleInputChange}
                    multiline
                    rows={3}
                    placeholder="Any additional benefits, perks, or special features of this role..."
                  />
                </motion.div>
              </Grid>
            </Grid>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <motion.div variants={slideIn}>
                  <Typography variant="h6" gutterBottom sx={{ color: '#007BFF', fontWeight: 'bold' }}>
                    <AccessibilityIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Accessibility & Inclusion Features
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Help us make this opportunity accessible to everyone by selecting relevant accessibility features.
                  </Typography>
                </motion.div>
              </Grid>
              <Grid item xs={12}>
                <motion.div variants={staggerContainer}>
                  <FormGroup>
                    <motion.div variants={slideIn}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={formData.accessibility.remoteJob}
                            onChange={handleInputChange}
                            name="accessibility.remoteJob"
                          />
                        }
                        label="Remote Work Available"
                      />
                    </motion.div>
                    <motion.div variants={slideIn}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={formData.accessibility.wheelchairAccessible}
                            onChange={handleInputChange}
                            name="accessibility.wheelchairAccessible"
                          />
                        }
                        label="Wheelchair Accessible Workplace"
                      />
                    </motion.div>
                    <motion.div variants={slideIn}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={formData.accessibility.signLanguageSupport}
                            onChange={handleInputChange}
                            name="accessibility.signLanguageSupport"
                          />
                        }
                        label="Sign Language Support Available"
                      />
                    </motion.div>
                    <motion.div variants={slideIn}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={formData.accessibility.colorBlindFriendly}
                            onChange={handleInputChange}
                            name="accessibility.colorBlindFriendly"
                          />
                        }
                        label="Color-Blind Friendly Design Tools/Processes"
                      />
                    </motion.div>
                  </FormGroup>
                </motion.div>
              </Grid>
            </Grid>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <motion.div variants={slideIn}>
                  <Typography variant="h6" gutterBottom sx={{ color: '#007BFF', fontWeight: 'bold' }}>
                    <CheckIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Review & Contact Information
                  </Typography>
                </motion.div>
              </Grid>
              <Grid item xs={12} md={6}>
                <motion.div variants={slideIn}>
                  <TextField
                    fullWidth
                    label="Contact Email *"
                    name="contactEmail"
                    type="email"
                    value={formData.contactEmail}
                    onChange={handleInputChange}
                    placeholder="hr@company.com"
                    required
                  />
                </motion.div>
              </Grid>
              <Grid item xs={12} md={6}>
                <motion.div variants={slideIn}>
                  <TextField
                    fullWidth
                    label="Application Deadline *"
                    name="applicationDeadline"
                    type="date"
                    value={formData.applicationDeadline}
                    onChange={handleInputChange}
                    InputLabelProps={{ shrink: true }}
                    required
                  />
                </motion.div>
              </Grid>
              <Grid item xs={12}>
                <motion.div variants={scaleIn}>
                  <Paper sx={{ p: 2, bgcolor: '#f8f9fa' }}>
                    <Typography variant="h6" gutterBottom>Job Summary</Typography>
                    <Typography><strong>Title:</strong> {formData.title}</Typography>
                    <Typography><strong>Company:</strong> {formData.company}</Typography>
                    <Typography><strong>Location:</strong> {formData.location}</Typography>
                    <Typography><strong>Type:</strong> {formData.type}</Typography>
                    {formData.salaryMin && formData.salaryMax && (
                      <Typography><strong>Salary:</strong> ₹{formData.salaryMin} - ₹{formData.salaryMax}</Typography>
                    )}
                    <Typography><strong>Skills Required:</strong> {formData.requiredSkills.join(', ')}</Typography>
                    <Typography><strong>Accessibility Features:</strong> {
                      Object.keys(formData.accessibility)
                        .filter(key => formData.accessibility[key])
                        .length > 0 
                        ? Object.keys(formData.accessibility)
                            .filter(key => formData.accessibility[key])
                            .map(key => {
                              const mapping = {
                                remoteJob: 'Remote Work',
                                wheelchairAccessible: 'Wheelchair Accessible',
                                signLanguageSupport: 'Sign Language Support',
                                colorBlindFriendly: 'Color-Blind Friendly'
                              };
                              return mapping[key];
                            }).join(', ')
                        : 'None selected'
                    }</Typography>
                  </Paper>
                </motion.div>
              </Grid>
            </Grid>
          </motion.div>
        );

      default:
        return 'Unknown step';
    }
  };

  if (!isAuthenticated || user?.type !== 'donor') {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={scaleIn}
        >
          <Card sx={{ textAlign: 'center', p: 4 }}>
            <BusinessIcon sx={{ fontSize: 64, color: '#007BFF', mb: 2 }} />
            <Typography variant="h4" gutterBottom>
              Company Access Required
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              This feature is available only for registered companies. Please log in with a company account to post job opportunities.
            </Typography>
            <Button
              variant="contained"
              size="large"
              sx={{ 
                bgcolor: '#007BFF', 
                '&:hover': { bgcolor: '#0056b3' },
                mt: 2
              }}
              onClick={() => window.location.href = '/donor/login'}
            >
              Login as Company
            </Button>
          </Card>
        </motion.div>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4, bgcolor: '#FFFFFF', minHeight: '100vh' }}>
      {/* Header */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
      >
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h3" gutterBottom sx={{ color: '#007BFF', fontWeight: 'bold' }}>
            <BusinessIcon sx={{ mr: 2, verticalAlign: 'middle', fontSize: '2.5rem' }} />
            Post a Job Opportunity
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '600px', mx: 'auto' }}>
            Create an inclusive job posting that reaches talented individuals from all backgrounds
          </Typography>
        </Box>
      </motion.div>

      {/* Stepper */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        transition={{ delay: 0.2 }}
      >
        <Paper sx={{ p: 3, mb: 4, bgcolor: '#f8f9fa' }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Paper>
      </motion.div>

      {/* Form Content */}
      <motion.div
        key={activeStep}
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <Card sx={{ boxShadow: 3 }}>
          <CardContent sx={{ p: 4 }}>
            {renderStepContent(activeStep)}
          </CardContent>
        </Card>
      </motion.div>

      {/* Navigation Buttons */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        transition={{ delay: 0.3 }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            sx={{ color: '#007BFF' }}
          >
            Back
          </Button>
          <Box>
            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={!isStepValid(activeStep) || loading}
                sx={{ 
                  bgcolor: '#007BFF', 
                  '&:hover': { bgcolor: '#0056b3' },
                  minWidth: '120px'
                }}
              >
                {loading ? <CircularProgress size={24} /> : 'Submit Job Posting'}
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={!isStepValid(activeStep)}
                sx={{ 
                  bgcolor: '#007BFF', 
                  '&:hover': { bgcolor: '#0056b3' },
                  minWidth: '120px'
                }}
              >
                Next
              </Button>
            )}
          </Box>
        </Box>
      </motion.div>

      {/* Success Message */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default JobPostings;