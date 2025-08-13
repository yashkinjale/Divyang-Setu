import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Avatar,
  Grid,
  Container,
  IconButton,
  Tooltip,
  Divider,
  Paper
} from '@mui/material';
import {
  Search as SearchIcon,
  LocationOn as LocationIcon,
  Business as BusinessIcon,
  Work as WorkIcon,
  Accessible as AccessibleIcon,
  Computer as ComputerIcon,
  Visibility as VisibilityIcon,
  Hearing as HearingIcon,
  DirectionsWalk as MobilityIcon,
  Send as ApplyIcon
} from '@mui/icons-material';

// Mock data for jobs
const mockJobs = [
  {
    id: 1,
    title: "Frontend Developer",
    company: "TechSoft Solutions",
    location: "Mumbai, India",
    tags: ["Remote", "Wheelchair Accessible", "Screen Reader Compatible"],
    salary: "₹8-10 LPA",
    logo: "https://via.placeholder.com/50",
    type: "Full-time",
    accessibility: ["Wheelchair Accessible", "Screen Reader Compatible", "High Contrast UI"]
  },
  {
    id: 2,
    title: "Data Analyst",
    company: "Insight Corp",
    location: "Bengaluru, India",
    tags: ["On-site", "Visually Accessible Tools", "Assistive Technology"],
    salary: "₹6-8 LPA",
    logo: "https://via.placeholder.com/50",
    type: "Full-time",
    accessibility: ["Visually Accessible Tools", "Assistive Technology", "Flexible Hours"]
  },
  {
    id: 3,
    title: "Content Writer",
    company: "Digital Media Hub",
    location: "Remote",
    tags: ["Remote", "Flexible Hours", "Voice Recognition"],
    salary: "₹4-6 LPA",
    logo: "https://via.placeholder.com/50",
    type: "Part-time",
    accessibility: ["Voice Recognition", "Flexible Hours", "Remote Work"]
  },
  {
    id: 4,
    title: "Customer Support Specialist",
    company: "ServiceFirst",
    location: "Delhi, India",
    tags: ["On-site", "Hearing Aid Compatible", "Sign Language Support"],
    salary: "₹5-7 LPA",
    logo: "https://via.placeholder.com/50",
    type: "Full-time",
    accessibility: ["Hearing Aid Compatible", "Sign Language Support", "Accessible Workspace"]
  },
  {
    id: 5,
    title: "UI/UX Designer",
    company: "Creative Studios",
    location: "Pune, India",
    tags: ["Hybrid", "Accessible Design Tools", "Color Blind Friendly"],
    salary: "₹7-9 LPA",
    logo: "https://via.placeholder.com/50",
    type: "Full-time",
    accessibility: ["Accessible Design Tools", "Color Blind Friendly", "Flexible Schedule"]
  },
  {
    id: 6,
    title: "Software Tester",
    company: "QualityTech",
    location: "Chennai, India",
    tags: ["Remote", "Accessibility Testing", "Assistive Software"],
    salary: "₹5-7 LPA",
    logo: "https://via.placeholder.com/50",
    type: "Contract",
    accessibility: ["Accessibility Testing", "Assistive Software", "Remote Work"]
  }
];

// Recommended jobs (first 3 for demonstration)
const recommendedJobs = mockJobs.slice(0, 3);

const JobRecommendations = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [accessibilityFilter, setAccessibilityFilter] = useState('');
  const [jobTypeFilter, setJobTypeFilter] = useState('');

  const handleApply = (jobId) => {
    console.log(`Applying for job ${jobId}`);
    // Add application logic here
  };

  const getAccessibilityIcon = (tag) => {
    if (tag.includes('Wheelchair') || tag.includes('Mobility')) return <MobilityIcon />;
    if (tag.includes('Screen Reader') || tag.includes('Visual')) return <VisibilityIcon />;
    if (tag.includes('Hearing') || tag.includes('Sign Language')) return <HearingIcon />;
    if (tag.includes('Voice') || tag.includes('Speech')) return <AccessibleIcon />;
    return <ComputerIcon />;
  };

  const getChipColor = (tag) => {
    if (tag.includes('Remote')) return 'primary';
    if (tag.includes('Accessible') || tag.includes('Wheelchair')) return 'success';
    if (tag.includes('Screen Reader') || tag.includes('Visual')) return 'info';
    if (tag.includes('Hearing') || tag.includes('Voice')) return 'warning';
    return 'default';
  };

  const JobCard = ({ job, isRecommended = false }) => (
    <Card 
      sx={{ 
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 2,
        boxShadow: isRecommended ? 3 : 1,
        border: isRecommended ? '2px solid #87CEFA' : '1px solid #f5f5f5',
        transition: 'all 0.3s ease',
        height: isRecommended ? 'auto' : { xs: 340, sm: 360, md: 380 },
        width: '100%',
        minWidth: 0,
        boxSizing: 'border-box',
        '&:hover': {
          boxShadow: 4,
          transform: 'translateY(-2px)'
        }
      }}
    >
      <CardContent sx={{ 
        flexGrow: 1, 
        p: 2, 
        display: 'flex', 
        flexDirection: 'column',
        minHeight: 200,
        overflow: 'hidden'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
          <Avatar 
            src={job.logo} 
            sx={{ width: 40, height: 40, mr: 2, flexShrink: 0 }}
          >
            <BusinessIcon />
          </Avatar>
          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Typography variant="h6" component="h3" sx={{ 
              fontSize: '1rem', 
              fontWeight: 600,
              lineHeight: 1.2,
              mb: 0.5,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {job.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ 
              fontSize: '0.875rem',
              lineHeight: 1.2,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {job.company}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <LocationIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary', flexShrink: 0 }} />
          <Typography variant="body2" color="text.secondary" sx={{ 
            fontSize: '0.875rem',
            lineHeight: 1.2,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            {job.location}
          </Typography>
        </Box>

        <Typography variant="body2" sx={{ 
          mb: 2, 
          fontSize: '0.875rem', 
          fontWeight: 500,
          lineHeight: 1.2
        }}>
          {job.salary}
        </Typography>

        <Box sx={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: 0.5, 
          mb: 2,
          flexGrow: 1,
          alignItems: 'flex-end'
        }}>
          {job.tags.slice(0, 3).map((tag, index) => (
            <Chip
              key={index}
              label={tag}
              size="small"
              color={getChipColor(tag)}
              icon={getAccessibilityIcon(tag)}
              sx={{ 
                fontSize: '0.75rem',
                height: 24,
                '& .MuiChip-icon': { fontSize: 14 }
              }}
            />
          ))}
        </Box>
      </CardContent>

      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button
          variant="contained"
          size="small"
          startIcon={<ApplyIcon />}
          onClick={() => handleApply(job.id)}
          sx={{
            bgcolor: '#87CEFA',
            color: 'white',
            '&:hover': {
              bgcolor: '#5F9EA0'
            },
            fontSize: '0.875rem',
            fontWeight: 500,
            width: '100%'
          }}
        >
          Apply Now
        </Button>
      </CardActions>
    </Card>
  );

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ 
          fontWeight: 600, 
          mb: 1,
          fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' }
        }}>
          Job Recommendations
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ 
          mb: 3,
          fontSize: '1rem'
        }}>
          Jobs tailored to your skills and accessibility needs
        </Typography>

        {/* Search and Filters */}
        <Paper sx={{ p: 3, mb: 4, bgcolor: '#f5f5f5' }}>
          <Grid container spacing={3}>
            {/* Search Field */}
            <Grid item xs={12} lg={4}>
              <FormControl fullWidth>
                <TextField
                  fullWidth
                  placeholder="Search job title, company, or keyword..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: 'white',
                      borderRadius: 2,
                      height: 56
                    }
                  }}
                />
              </FormControl>
            </Grid>
            
            {/* Location/Remote Filter */}
            <Grid item xs={12} sm={6} lg={2.5}>
              <FormControl fullWidth>
                <InputLabel>Location/Remote</InputLabel>
                <Select
                  value={locationFilter}
                  label="Location/Remote"
                  onChange={(e) => setLocationFilter(e.target.value)}
                  sx={{ 
                    bgcolor: 'white', 
                    borderRadius: 2,
                    height: 56,
                    minWidth: 180,
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'transparent'
                    },
                    '& .MuiSelect-select': {
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }
                  }}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="remote">Remote</MenuItem>
                  <MenuItem value="onsite">On-site</MenuItem>
                  <MenuItem value="hybrid">Hybrid</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            {/* Accessibility Filter */}
            <Grid item xs={12} sm={6} lg={2.5}>
              <FormControl fullWidth>
                <InputLabel>Accessibility</InputLabel>
                <Select
                  value={accessibilityFilter}
                  label="Accessibility"
                  onChange={(e) => setAccessibilityFilter(e.target.value)}
                  sx={{ 
                    bgcolor: 'white', 
                    borderRadius: 2,
                    height: 56,
                    minWidth: 200,
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'transparent'
                    },
                    '& .MuiSelect-select': {
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }
                  }}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="wheelchair">Wheelchair Accessible</MenuItem>
                  <MenuItem value="visual">Visual Accessibility</MenuItem>
                  <MenuItem value="hearing">Hearing Accessibility</MenuItem>
                  <MenuItem value="cognitive">Cognitive Support</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            {/* Job Type Filter */}
            <Grid item xs={12} sm={6} lg={2.5}>
              <FormControl fullWidth>
                <InputLabel>Job Type</InputLabel>
                <Select
                  value={jobTypeFilter}
                  label="Job Type"
                  onChange={(e) => setJobTypeFilter(e.target.value)}
                  sx={{ 
                    bgcolor: 'white', 
                    borderRadius: 2,
                    height: 56,
                    minWidth: 160,
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'transparent'
                    },
                    '& .MuiSelect-select': {
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }
                  }}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="full-time">Full-time</MenuItem>
                  <MenuItem value="part-time">Part-time</MenuItem>
                  <MenuItem value="contract">Contract</MenuItem>
                  <MenuItem value="internship">Internship</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            {/* Clear Filters Button */}
            <Grid item xs={12} sm={6} lg={0.5}>
              <Button
                variant="contained"
                onClick={() => {
                  setSearchQuery('');
                  setLocationFilter('');
                  setAccessibilityFilter('');
                  setJobTypeFilter('');
                }}
                sx={{
                  height: 56,
                  borderRadius: 2,
                  bgcolor: '#87CEFA',
                  color: 'white',
                  minWidth: 120,
                  '&:hover': {
                    bgcolor: '#5F9EA0'
                  }
                }}
                fullWidth
              >
                Clear
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Box>

      {/* Recommended Jobs Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" component="h2" sx={{ 
          mb: 3, 
          fontWeight: 600,
          fontSize: { xs: '1.25rem', sm: '1.5rem' }
        }}>
          Recommended for You
        </Typography>
        <Box sx={{ 
          display: 'flex', 
          gap: 3, 
          overflowX: 'auto',
          pb: 2,
          px: 0.5,
          '&::-webkit-scrollbar': {
            height: 8,
          },
          '&::-webkit-scrollbar-track': {
            bgcolor: '#f5f5f5',
            borderRadius: 4,
          },
          '&::-webkit-scrollbar-thumb': {
            bgcolor: '#87CEFA',
            borderRadius: 4,
          }
        }}>
          {recommendedJobs.map((job) => (
            <Box key={job.id} sx={{ 
              minWidth: 320, 
              maxWidth: 320,
              flexShrink: 0,
              height: 'fit-content'
            }}>
              <JobCard job={job} isRecommended={true} />
            </Box>
          ))}
        </Box>
      </Box>

      {/* All Jobs Section */}
      <Box>
        <Typography variant="h5" component="h2" sx={{ 
          mb: 3, 
          fontWeight: 600,
          fontSize: { xs: '1.25rem', sm: '1.5rem' }
        }}>
          All Available Jobs
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gap: 3,
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
              lg: 'repeat(3, 1fr)',
              xl: 'repeat(3, 1fr)'
            }
          }}
        >
          {mockJobs.map((job) => (
            <Box key={job.id} sx={{ minWidth: 0, display: 'flex' }}>
              <JobCard job={job} />
            </Box>
          ))}
        </Box>
      </Box>
    </Container>
  );
};

export default JobRecommendations;
