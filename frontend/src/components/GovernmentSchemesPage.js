import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  IconButton,
  Pagination,
  useTheme,
  useMediaQuery,
  Paper,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  CalendarToday as CalendarIcon,
  Star as StarIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import SchemeDetailsModal from './SchemeDetailsModal';

// Mock data for government schemes
// REMOVED: local mockSchemes array to ensure frontend uses API data

const SchemeCard = ({ scheme, onViewDetails }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    style={{ 
      height: '100%', 
      display: 'flex',
      width: '100%'
    }}
  >
    <Card sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column', 
      position: 'relative',
      width: '100%',
      minHeight: '520px',
      maxHeight: '520px',
      overflow: 'hidden'
    }}>
      {scheme.isRecommended && (
        <Chip
          label="Recommended"
          color="primary"
          size="small"
          icon={<StarIcon />}
          sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}
        />
      )}
      <CardMedia 
        component="img" 
        height="200" 
        image={scheme.image} 
        alt={scheme.name} 
        sx={{ objectFit: 'cover' }} 
      />
      <CardContent sx={{ 
        flexGrow: 1, 
        display: 'flex', 
        flexDirection: 'column',
        p: 2,
        '&:last-child': { pb: 2 }
      }}>
        <Typography variant="h6" sx={{ 
          fontWeight: 'bold', 
          mb: 1, 
          lineHeight: 1.2,
          fontSize: '1rem',
          height: '2.4rem',
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical'
        }}>
          {scheme.name}
        </Typography>
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ 
            flexGrow: 1,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            lineHeight: 1.4,
            fontSize: '0.875rem',
            mb: 2
          }}
        >
          {scheme.description}
        </Typography>
        <Box sx={{ 
          display: 'flex', 
          gap: 0.5, 
          mb: 2, 
          flexWrap: 'wrap',
          minHeight: '32px'
        }}>
          <Chip label={scheme.type} size="small" color="primary" variant="outlined" />
          <Chip label={scheme.disabilityType} size="small" color="secondary" variant="outlined" />
          <Chip label={scheme.ageGroup} size="small" color="info" variant="outlined" />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <CalendarIcon sx={{ fontSize: 16 }} />
          <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
            Deadline: {scheme.deadline}
          </Typography>
        </Box>
        <Typography variant="body2" color="primary" sx={{ fontWeight: 'bold', mb: 1 }}>
          Benefits: {scheme.benefits}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
          {scheme.applications} applications
        </Typography>
      </CardContent>
      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button 
          variant="contained" 
          fullWidth 
          endIcon={<ArrowForwardIcon />} 
          onClick={() => onViewDetails(scheme)}
          sx={{ py: 1 }}
        >
          View Details
        </Button>
      </CardActions>
    </Card>
  </motion.div>
);

const FilterPanel = ({ filters, tempFilters, setTempFilters, onClearFilters, onApplyFilters, hasActiveFilters, resultCount }) => {
  const disabilityTypes = ["All Disabilities", "Physical Disabilities", "Visual Impairment", "Hearing Impairment", "Intellectual Disabilities", "Mental Health Conditions"];
  const locations = ["All India", "Delhi", "Mumbai", "Bangalore", "Chennai", "Kolkata", "Hyderabad", "Pune"];
  const ageGroups = ["All Ages", "0-5 years", "6-17 years", "18-25 years", "26-45 years", "46-60 years", "60+ years"];
  const eligibilityCriteria = ["All Criteria", "Income based", "Education based", "Age based", "Disability specific", "Employment status"];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>Filters</Typography>
        <Grid container spacing={3}>
          {[
            { label: "Select Disability Type", value: tempFilters.disabilityType, key: 'disabilityType', options: disabilityTypes },
            { label: "Select Location", value: tempFilters.location, key: 'location', options: locations },
            { label: "Select Age Group", value: tempFilters.ageGroup, key: 'ageGroup', options: ageGroups },
            { label: "Select Eligibility Criteria", value: tempFilters.eligibilityCriteria, key: 'eligibilityCriteria', options: eligibilityCriteria }
          ].map(({ label, value, key, options }) => (
            <Grid item xs={12} sm={6} md={3} key={key}>
              <FormControl fullWidth size="small">
                <InputLabel>{label}</InputLabel>
                <Select
                  value={value}
                  label={label}
                  onChange={(e) => setTempFilters({ ...tempFilters, [key]: e.target.value })}
                >
                  {options.map((opt) => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
          ))}
        </Grid>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, mt: 3 }}>
          <Button variant="contained" startIcon={<FilterIcon />} onClick={onApplyFilters}>Apply Filters</Button>
          {hasActiveFilters && (
            <Button variant="outlined" onClick={onClearFilters}>Clear All</Button>
          )}
          <Typography variant="body2" color="text.secondary">{resultCount} scheme{resultCount !== 1 ? 's' : ''} available</Typography>
        </Box>
      </Paper>
    </motion.div>
  );
};

const GovernmentSchemesPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  const [searchTerm, setSearchTerm] = useState('');
  const [tempSearchTerm, setTempSearchTerm] = useState('');
  const [filters, setFilters] = useState({ disabilityType: 'All Disabilities', location: 'All India', ageGroup: 'All Ages', eligibilityCriteria: 'All Criteria' });
  const [tempFilters, setTempFilters] = useState({ ...filters });
  const [schemes, setSchemes] = useState([]);
  const [filteredSchemes, setFilteredSchemes] = useState([]);
  const [recommendedSchemes, setRecommendedSchemes] = useState([]);
  const [page, setPage] = useState(1);
  const schemesPerPage = 6;
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const readyTimer = setTimeout(() => setShowContent(true), 300);
    return () => clearTimeout(readyTimer);
  }, []);

  // Fetch from API only (no local mock fallbacks)
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [allRes, recRes] = await Promise.all([
          axios.get('http://localhost:5000/api/schemes'),
          axios.get('http://localhost:5000/api/schemes/recommended')
        ]);
        const all = allRes.data?.data ?? [];
        const rec = recRes.data?.data ?? [];
        setSchemes(all);
        setFilteredSchemes(all);
        setRecommendedSchemes(rec);
      } catch (e) {
        setError('Failed to load schemes. Ensure backend is running on http://localhost:5000');
        setSchemes([]);
        setFilteredSchemes([]);
        setRecommendedSchemes([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    let filtered = [...schemes];
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(s =>
        s.name.toLowerCase().includes(searchLower) ||
        s.description.toLowerCase().includes(searchLower) ||
        s.type.toLowerCase().includes(searchLower) ||
        (s.benefits || '').toLowerCase().includes(searchLower) ||
        (s.eligibility || '').toLowerCase().includes(searchLower)
      );
    }
    if (filters.disabilityType !== 'All Disabilities') filtered = filtered.filter(s => s.disabilityType === filters.disabilityType);
    if (filters.location !== 'All India') filtered = filtered.filter(s => s.location === filters.location || s.location === 'All India');
    if (filters.ageGroup !== 'All Ages') filtered = filtered.filter(s => s.ageGroup === filters.ageGroup || s.ageGroup === 'All ages');
    if (filters.eligibilityCriteria !== 'All Criteria') {
      const el = filters.eligibilityCriteria.toLowerCase();
      filtered = filtered.filter(s => (s.eligibility || '').toLowerCase().includes(el.split(' ')[0]));
    }
    setFilteredSchemes(filtered);
    setPage(1);
  }, [searchTerm, filters, schemes]);

  const handleViewDetails = (scheme) => { setSelectedScheme(scheme); setModalOpen(true); };
  const clearAllFilters = () => {
    setSearchTerm('');
    setTempSearchTerm('');
    setFilters({ disabilityType: 'All Disabilities', location: 'All India', ageGroup: 'All Ages', eligibilityCriteria: 'All Criteria' });
    setTempFilters({ disabilityType: 'All Disabilities', location: 'All India', ageGroup: 'All Ages', eligibilityCriteria: 'All Criteria' });
  };
  const applySearch = () => setSearchTerm(tempSearchTerm);
  const applyFilters = () => setFilters({ ...tempFilters });
  const hasActiveFilters = () =>
    searchTerm ||
    filters.disabilityType !== 'All Disabilities' ||
    filters.location !== 'All India' ||
    filters.ageGroup !== 'All Ages' ||
    filters.eligibilityCriteria !== 'All Criteria';

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}><CircularProgress /></Box>;
  if (error) return (
    <Container sx={{ py: 4 }}>
      <Alert severity="error">{error}</Alert>
      <Button variant="contained" onClick={() => window.location.reload()} sx={{ mt: 2 }}>Retry</Button>
    </Container>
  );

  const currentSchemes = filteredSchemes.slice((page - 1) * schemesPerPage, page * schemesPerPage);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pt: 2 }}>
      <Container maxWidth="lg">
        {showContent && (
          <>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <Box sx={{ mb: 4 }}>
                <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold' }}>Government Schemes for Disabled Persons</Typography>
                <Typography variant="h6" color="text.secondary">Find schemes tailored to your needs. Use the filters below to narrow down your search or explore our recommendations.</Typography>
              </Box>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
              <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <TextField
                    fullWidth
                    placeholder="Search for schemes..."
                    value={tempSearchTerm}
                    onChange={(e) => setTempSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && applySearch()}
                    InputProps={{
                      startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>,
                      endAdornment: tempSearchTerm && <InputAdornment position="end"><IconButton onClick={() => setTempSearchTerm('')}><Typography variant="body2">✕</Typography></IconButton></InputAdornment>
                    }}
                  />
                  <Button variant="contained" onClick={applySearch}>Search</Button>
                </Box>
                {searchTerm && <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>{filteredSchemes.length} scheme{filteredSchemes.length !== 1 ? 's' : ''} found for "{searchTerm}"</Typography>}
              </Box>
            </motion.div>

            <FilterPanel
              filters={filters}
              tempFilters={tempFilters}
              setTempFilters={setTempFilters}
              onClearFilters={clearAllFilters}
              onApplyFilters={applyFilters}
              hasActiveFilters={hasActiveFilters()}
              resultCount={filteredSchemes.length}
            />

            {/* Recommendations first unless filtering */}
            {recommendedSchemes.length > 0 && !hasActiveFilters() && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}>
                <Box sx={{ mb: 6 }}>
                  <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>Recommended Schemes</Typography>
                  <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                      xs: '1fr',
                      sm: 'repeat(2, 1fr)',
                      lg: 'repeat(3, 1fr)'
                    },
                    gap: 3,
                    width: '100%'
                  }}>
                    {recommendedSchemes.slice(0, 3).map((scheme, i) => (
                      <motion.div 
                        key={scheme.id}
                        initial={{ opacity: 0, y: 20 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        transition={{ duration: 0.6, delay: 0.6 + i * 0.1 }}
                        style={{ height: '520px' }}
                      >
                        <SchemeCard scheme={scheme} onViewDetails={handleViewDetails} />
                      </motion.div>
                    ))}
                  </Box>
                </Box>
              </motion.div>
            )}

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.6 }}>
              <Box>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>All Available Schemes</Typography>
                {currentSchemes.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 8 }}>
                    <Typography variant="h6" color="text.secondary">No schemes found matching your criteria.</Typography>
                    <Typography variant="body2" color="text.secondary">Try adjusting your search or filters.</Typography>
                  </Box>
                ) : (
                  <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                      xs: '1fr',
                      sm: 'repeat(2, 1fr)',
                      lg: 'repeat(3, 1fr)'
                    },
                    gap: 3,
                    width: '100%'
                  }}>
                    <AnimatePresence>
                      {currentSchemes.map((scheme, i) => (
                        <motion.div 
                          key={scheme.id}
                          initial={{ opacity: 0, scale: 0.9 }} 
                          animate={{ opacity: 1, scale: 1 }} 
                          exit={{ opacity: 0, scale: 0.9 }} 
                          transition={{ duration: 0.4, delay: i * 0.1 }}
                          style={{ height: '520px' }}
                        >
                          <SchemeCard scheme={scheme} onViewDetails={handleViewDetails} />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </Box>
                )}
                {filteredSchemes.length > schemesPerPage && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <Pagination count={Math.ceil(filteredSchemes.length / schemesPerPage)} page={page} onChange={(_, v) => setPage(v)} color="primary" size="large" />
                  </Box>
                )}
              </Box>
            </motion.div>
          </>
        )}
      </Container>
      <SchemeDetailsModal open={modalOpen} scheme={selectedScheme} onClose={() => setModalOpen(false)} />
    </Box>
  );
};

export default GovernmentSchemesPage;