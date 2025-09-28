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

  // Load jobs on component mount and when filters change
  useEffect(() => {
    fetchJobs();
  }, [filters]); // Re-fetch when filters change

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('[FRONTEND] Fetching jobs with params:', { 
        location, 
        filters: Object.entries(filters).filter(([k, v]) => v)
      });

      // Build query parameters
      const params = {
        location: location || 'India',
        // Only include filters that are true
        ...Object.fromEntries(
          Object.entries(filters).filter(([key, value]) => value === true)
        )
      };

      console.log('[FRONTEND] API params:', params);

      const response = await api.get('/jobs', {
        params,
        timeout: 25000 // Longer timeout for potentially slow backend
      });

      console.log('[FRONTEND] API response:', {
        success: response.data.success,
        count: response.data.count,
        jobsLength: response.data.jobs?.length,
        searchStrategy: response.data.searchStrategy,
        note: response.data.note
      });
      
      if (response.data.success && response.data.jobs) {
        setJobs(response.data.jobs);
        console.log(`[FRONTEND] Successfully loaded ${response.data.jobs.length} jobs`);
      } else {
        throw new Error('Invalid response structure');
      }
      
      if (response.data.note) {
        console.log('[FRONTEND] API Note:', response.data.note);
      }
      
    } catch (error) {
      console.error('[FRONTEND] Error fetching jobs:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      setError(`Failed to fetch jobs: ${error.message}`);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('[FRONTEND] Searching with query:', searchQuery);

      const params = {
        location: location || 'India',
        ...Object.fromEntries(
          Object.entries(filters).filter(([key, value]) => value === true)
        )
      };

      // Add query if provided
      if (searchQuery.trim()) {
        params.query = searchQuery.trim();
      }

      console.log('[FRONTEND] Search params:', params);

      const response = await api.get('/jobs', {
        params,
        timeout: 25000
      });

      console.log('[FRONTEND] Search response:', {
        success: response.data.success,
        count: response.data.count,
        jobsLength: response.data.jobs?.length
      });
      
      if (response.data.success && response.data.jobs) {
        setJobs(response.data.jobs);
      } else {
        throw new Error('Invalid search response');
      }
      
    } catch (error) {
      console.error('[FRONTEND] Search error:', error);
      setError(`Search failed: ${error.message}`);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filterKey) => {
    console.log('[FRONTEND] Filter changed:', filterKey);
    setFilters(prev => ({
      ...prev,
      [filterKey]: !prev[filterKey]
    }));
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
            onClick={() => handleFilterChange('wheelchair_accessible')}
            clickable
          />
          <Chip
            icon={<RemoteIcon />}
            label="Remote Friendly"
            color={filters.remote_friendly ? 'primary' : 'default'}
            variant={filters.remote_friendly ? 'filled' : 'outlined'}
            onClick={() => handleFilterChange('remote_friendly')}
            clickable
          />
          <Chip
            icon={<DiversityIcon />}
            label="Inclusive Hiring"
            color={filters.inclusive_hiring ? 'primary' : 'default'}
            variant={filters.inclusive_hiring ? 'filled' : 'outlined'}
            onClick={() => handleFilterChange('inclusive_hiring')}
            clickable
          />
          <Chip
            icon={<HearingIcon />}
            label="Sign Language Support"
            color={filters.sign_language_support ? 'primary' : 'default'}
            variant={filters.sign_language_support ? 'filled' : 'outlined'}
            onClick={() => handleFilterChange('sign_language_support')}
            clickable
          />
          <Chip
            icon={<ColorLensIcon />}
            label="Colorblind-friendly UI"
            color={filters.colorblind_friendly_ui ? 'primary' : 'default'}
            variant={filters.colorblind_friendly_ui ? 'filled' : 'outlined'}
            onClick={() => handleFilterChange('colorblind_friendly_ui')}
            clickable
          />
        </Box>

        {/* Active Filters Display */}
        {Object.entries(filters).some(([, value]) => value) && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Active filters:
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
              {Object.entries(filters)
                .filter(([, value]) => value)
                .map(([key, ]) => (
                  <Chip
                    key={key}
                    label={key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    size="small"
                    onDelete={() => handleFilterChange(key)}
                    color="primary"
                    variant="outlined"
                  />
                ))}
            </Box>
          </Box>
        )}
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Loading State */}
      {loading && (
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2 }}>
            <CircularProgress sx={{ mr: 2 }} />
            <Typography>Loading inclusive job opportunities...</Typography>
          </Box>
          <Grid container spacing={3}>
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <Grid key={item} size={{ xs: 12, sm: 6, lg: 4 }}>
                <JobSkeleton />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* No Jobs Found */}
      {!loading && jobs.length === 0 && !error && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <AccessibilityIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            No jobs found
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Try adjusting your search criteria or removing some filters to see more opportunities.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button variant="contained" onClick={fetchJobs}>
              Reload Jobs
            </Button>
            <Button 
              variant="outlined" 
              onClick={() => {
                setFilters({
                  wheelchair_accessible: false,
                  remote_friendly: false,
                  inclusive_hiring: false,
                  sign_language_support: false,
                  colorblind_friendly_ui: false,
                });
                setSearchQuery('');
              }}
            >
              Clear All Filters
            </Button>
          </Box>
        </Box>
      )}

      {/* Jobs Grid */}
      {!loading && jobs.length > 0 && (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">
              Found {jobs.length} inclusive job opportunities
            </Typography>
            <Button variant="outlined" onClick={fetchJobs} disabled={loading}>
              Refresh
            </Button>
          </Box>
          
          <Grid container spacing={3}>
            {jobs.map((job) => (
              <Grid key={job.id} size={{ xs: 12, sm: 6, lg: 4 }}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4
                    },
                    border: job.inclusivityScore > 15 ? '2px solid' : '1px solid',
                    borderColor: job.inclusivityScore > 15 ? 'primary.main' : 'divider'
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    {/* High Score Badge */}
                    {job.inclusivityScore > 15 && (
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
                        <Chip 
                          label="Highly Inclusive" 
                          color="primary" 
                          size="small" 
                          variant="filled"
                        />
                      </Box>
                    )}

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
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, flexWrap: 'wrap', gap: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <LocationIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {job.location}
                        </Typography>
                      </Box>
                      {job.isRemote && (
                        <Chip label="Remote" size="small" color="success" />
                      )}
                    </Box>

                    {job.salary && job.salary !== 'Salary Not Specified' && (
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

                    {/* Job Type & Tags */}
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                      <Chip
                        label={job.type}
                        size="small"
                        variant="filled"
                        color="info"
                      />
                      {job.tags?.slice(0, 2).map((tag, index) => (
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
                      <Box sx={{ mt: 2, p: 2, backgroundColor: 'action.hover', borderRadius: 1 }}>
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
                          {job.accessibility.length > 2 && (
                            <Chip
                              label={`+${job.accessibility.length - 2} more`}
                              size="small"
                              color="success"
                              variant="outlined"
                            />
                          )}
                        </Box>
                      </Box>
                    )}

                    {/* Accessibility Flags Row */}
                    {job.accessibilityFlags && (
                      <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {job.accessibilityFlags.wheelchairAccessible && (
                          <Chip size="small" icon={<WheelchairIcon sx={{ fontSize: 16 }} />} label="Wheelchair" color="primary" />
                        )}
                        {job.accessibilityFlags.remoteFriendly && (
                          <Chip size="small" icon={<RemoteIcon sx={{ fontSize: 16 }} />} label="Remote" color="primary" />
                        )}
                        {job.accessibilityFlags.inclusiveHiring && (
                          <Chip size="small" icon={<DiversityIcon sx={{ fontSize: 16 }} />} label="Inclusive" color="primary" />
                        )}
                        {job.accessibilityFlags.signLanguageSupport && (
                          <Chip size="small" icon={<HearingIcon sx={{ fontSize: 16 }} />} label="Sign Lang" color="primary" />
                        )}
                        {job.accessibilityFlags.colorblindFriendlyUI && (
                          <Chip size="small" icon={<ColorLensIcon sx={{ fontSize: 16 }} />} label="Colorblind" color="primary" />
                        )}
                      </Box>
                    )}

                    {/* Inclusivity Score (for debugging) */}
                    {process.env.NODE_ENV === 'development' && (
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                        Inclusivity Score: {job.inclusivityScore}
                      </Typography>
                    )}
                  </CardContent>

                  <CardActions sx={{ p: 2, pt: 0 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={() => {
                        if (job.applyUrl) {
                          window.open(job.applyUrl, '_blank', 'noopener,noreferrer');
                        } else {
                          console.log('No direct apply URL available for:', job.title);
                        }
                      }}
                      sx={{
                        backgroundColor: job.inclusivityScore > 15 ? 'primary.main' : 'primary.light',
                        '&:hover': {
                          backgroundColor: job.inclusivityScore > 15 ? 'primary.dark' : 'primary.main',
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

          {/* Load More Button (if needed in future) */}
          {jobs.length >= 50 && (
            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Showing {jobs.length} jobs. Refine your search for more specific results.
              </Typography>
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default JobRecommendations;