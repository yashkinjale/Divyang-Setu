import React, { useState, useEffect } from 'react'; 
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Grid,
  TextField,
  InputAdornment,
  CircularProgress,
  Alert,
  Skeleton
} from '@mui/material';
import {
  Search as SearchIcon,
  LocationOn as LocationIcon,
  Business as BusinessIcon,
  Schedule as ScheduleIcon,
  Accessibility as AccessibilityIcon,
  WheelchairPickup as WheelchairIcon,
  Hearing as HearingIcon,
  ColorLens as ColorLensIcon,
  Diversity3 as DiversityIcon,
  HomeWork as RemoteIcon
} from '@mui/icons-material';
import api from '../utils/api';

const JobRecommendations = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('India');
  // Accessibility filter state
  const [filters, setFilters] = useState({
    wheelchair_accessible: false,
    remote_friendly: false,
    inclusive_hiring: false,
    sign_language_support: false,
    colorblind_friendly_ui: false,
  });

  useEffect(() => {
    fetchJobs();
  }, [location]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching jobs with params:', { location });

      const response = await api.get('/jobs', {
        params: {
          location: location || 'India',
          ...Object.fromEntries(
            Object.entries(filters).filter(([, v]) => v)
          )
        },
        // Extend timeout for potentially slower upstream aggregation
        timeout: 20000
      });

      console.log(`Successfully fetched ${response.data.jobs?.length || 0} jobs`);
      console.log('Search strategy used:', response.data.searchStrategy);
      
      setJobs(response.data.jobs || []);
      
      if (response.data.note) {
        console.log('API Note:', response.data.note);
      }
      
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setError('Failed to fetch jobs. Please try again later.');
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      fetchJobsWithQuery(searchQuery, location);
    } else {
      fetchJobs();
    }
  };

  const fetchJobsWithQuery = async (query, loc) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching jobs with specific query:', { query, location: loc });

      const response = await api.get('/jobs', {
        params: {
          query: query,
          location: loc || 'India',
          ...Object.fromEntries(
            Object.entries(filters).filter(([, v]) => v)
          )
        },
        timeout: 20000
      });

      console.log(`Successfully fetched ${response.data.jobs?.length || 0} jobs for query: "${query}"`);
      
      setJobs(response.data.jobs || []);
      
    } catch (error) {
      console.error('Error fetching jobs with query:', error);
      setError('Failed to fetch jobs. Please try again later.');
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const JobSkeleton = () => (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Skeleton variant="text" height={32} width="80%" />
        <Skeleton variant="text" height={24} width="60%" />
        <Skeleton variant="text" height={20} width="40%" />
        <Box sx={{ mt: 2 }}>
          <Skeleton variant="rectangular" height={60} />
        </Box>
        <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
          <Skeleton variant="rounded" width={80} height={24} />
          <Skeleton variant="rounded" width={100} height={24} />
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Inclusive Job Opportunities
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
          Discover disability-friendly employers and accessible workplaces
        </Typography>

        {/* Search Filters */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap', mb: 2 }}>
          <TextField
            placeholder="Search jobs (optional)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: 300 }}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <TextField
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LocationIcon />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: 200 }}
          />
          <Button
            variant="contained"
            onClick={handleSearch}
            startIcon={<SearchIcon />}
            disabled={loading}
            size="large"
          >
            Search
          </Button>
        </Box>

        {/* Accessibility Toggles */}
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap', mb: 3 }}>
          <Chip
            icon={<WheelchairIcon />}
            label="Wheelchair Accessible"
            color={filters.wheelchair_accessible ? 'primary' : 'default'}
            variant={filters.wheelchair_accessible ? 'filled' : 'outlined'}
            onClick={() => setFilters(f => ({ ...f, wheelchair_accessible: !f.wheelchair_accessible }))}
          />
          <Chip
            icon={<RemoteIcon />}
            label="Remote Friendly"
            color={filters.remote_friendly ? 'primary' : 'default'}
            variant={filters.remote_friendly ? 'filled' : 'outlined'}
            onClick={() => setFilters(f => ({ ...f, remote_friendly: !f.remote_friendly }))}
          />
          <Chip
            icon={<DiversityIcon />}
            label="Inclusive Hiring"
            color={filters.inclusive_hiring ? 'primary' : 'default'}
            variant={filters.inclusive_hiring ? 'filled' : 'outlined'}
            onClick={() => setFilters(f => ({ ...f, inclusive_hiring: !f.inclusive_hiring }))}
          />
          <Chip
            icon={<HearingIcon />}
            label="Sign Language Support"
            color={filters.sign_language_support ? 'primary' : 'default'}
            variant={filters.sign_language_support ? 'filled' : 'outlined'}
            onClick={() => setFilters(f => ({ ...f, sign_language_support: !f.sign_language_support }))}
          />
          <Chip
            icon={<ColorLensIcon />}
            label="Colorblind-friendly UI"
            color={filters.colorblind_friendly_ui ? 'primary' : 'default'}
            variant={filters.colorblind_friendly_ui ? 'filled' : 'outlined'}
            onClick={() => setFilters(f => ({ ...f, colorblind_friendly_ui: !f.colorblind_friendly_ui }))}
          />
        </Box>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Loading State */}
      {loading && (
        <Grid container spacing={3}>
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <Grid key={item} size={{ xs: 12, sm: 6, lg: 4 }}>
              <JobSkeleton />
            </Grid>
          ))}
        </Grid>
      )}

      {/* No Jobs Found */}
      {!loading && jobs.length === 0 && !error && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <AccessibilityIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            No jobs found
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Try adjusting your search criteria or check back later for new opportunities.
          </Typography>
          <Button variant="contained" onClick={fetchJobs}>
            Reload Jobs
          </Button>
        </Box>
      )}

      {/* Jobs Grid */}
      {!loading && jobs.length > 0 && (
        <>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Found {jobs.length} inclusive job opportunities
          </Typography>
          
          <Grid container spacing={3}>
            {jobs.map((job) => (
              <Grid key={job.id} size={{ xs: 12, sm: 6, lg: 4 }}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    transition: 'transform 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 3
                    }
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    {/* Company Logo & Title */}
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                      {job.logo && (
                        <Box
                          component="img"
                          src={job.logo}
                          alt={`${job.company} logo`}
                          sx={{
                            width: 48,
                            height: 48,
                            borderRadius: 1,
                            mr: 2,
                            objectFit: 'contain'
                          }}
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      )}
                      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                        <Typography variant="h6" component="h3" sx={{ mb: 1 }}>
                          {job.title}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <BusinessIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            {job.company}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    {/* Location & Salary */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <LocationIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {job.location}
                      </Typography>
                      {job.isRemote && (
                        <Chip label="Remote" size="small" color="primary" sx={{ ml: 1 }} />
                      )}
                    </Box>

                    {job.salary && (
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <ScheduleIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {job.salary}
                        </Typography>
                      </Box>
                    )}

                    {/* Job Description */}
                    <Typography variant="body2" sx={{ mb: 2 }} color="text.secondary">
                      {job.description && job.description.length > 150
                        ? `${job.description.substring(0, 150)}...`
                        : job.description}
                    </Typography>

                    {/* Tags */}
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                      {job.tags?.slice(0, 3).map((tag, index) => (
                        <Chip
                          key={index}
                          label={tag}
                          size="small"
                          variant="outlined"
                          color="primary"
                        />
                      ))}
                    </Box>

                    {/* Accessibility Features */}
                    {job.accessibility && job.accessibility.length > 0 && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="caption" color="primary" sx={{ fontWeight: 'bold', mb: 1, display: 'block' }}>
                          <AccessibilityIcon sx={{ fontSize: 14, mr: 0.5 }} />
                          Accessibility Features:
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {job.accessibility.slice(0, 2).map((feature, index) => (
                            <Chip
                              key={index}
                              label={feature}
                              size="small"
                              color="success"
                              variant="outlined"
                            />
                          ))}
                        </Box>
                      </Box>
                    )}

                    {/* Accessibility Flags Row */}
                    {job.accessibilityFlags && (
                      <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {job.accessibilityFlags.wheelchairAccessible && <Chip size="small" icon={<WheelchairIcon sx={{ fontSize: 16 }} />} label="Wheelchair" />}
                        {job.accessibilityFlags.remoteFriendly && <Chip size="small" icon={<RemoteIcon sx={{ fontSize: 16 }} />} label="Remote" />}
                        {job.accessibilityFlags.inclusiveHiring && <Chip size="small" icon={<DiversityIcon sx={{ fontSize: 16 }} />} label="Inclusive" />}
                        {job.accessibilityFlags.signLanguageSupport && <Chip size="small" icon={<HearingIcon sx={{ fontSize: 16 }} />} label="Sign Lang" />}
                        {job.accessibilityFlags.colorblindFriendlyUI && <Chip size="small" icon={<ColorLensIcon sx={{ fontSize: 16 }} />} label="Colorblind" />}
                      </Box>
                    )}
                  </CardContent>

                  <CardActions sx={{ p: 2, pt: 0 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={() => {
                        if (job.applyUrl) {
                          window.open(job.applyUrl, '_blank');
                        } else {
                          console.log('No direct apply URL available for:', job.title);
                        }
                      }}
                    >
                      {job.applyUrl ? 'Apply Now' : 'View Details'}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Container>
  );
};

export default JobRecommendations;
