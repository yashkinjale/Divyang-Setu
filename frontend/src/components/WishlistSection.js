import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Chip,
  IconButton,
  LinearProgress,
  Snackbar,
  Alert,
  CircularProgress,
  Select,
  FormControl,
  InputLabel,
  Fab,
  Zoom,
  Fade,
  Paper,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  AttachFile as AttachFileIcon,
  CalendarToday as CalendarIcon,
  LocalOffer as LocalOfferIcon,
  Favorite as FavoriteIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { wishlistApi } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const WishlistSection = () => {
  const { user } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const refreshIntervalRef = useRef(null);
  
  const [formData, setFormData] = useState({
    itemName: '',
    description: '',
    amountRequired: '',
    quantity: '1',
    deadline: '',
    urgencyLevel: 'Medium',
    category: '',
    supportingDocuments: []
  });

  // Fetch wishlist items with debugging
  const fetchWishlistItems = async () => {
    try {
      if (!user) {
        return;
      }

      console.log('🔄 Fetching wishlist items...');
      const response = await wishlistApi.getAll();
      
      console.log('📦 Wishlist data received:');
      response.data.data.forEach((item, idx) => {
        console.log(`  [${idx}] ${item.itemName}: ₹${item.amountRaised || 0}/${item.amountRequired} (${item.progress || 0}%)`);
      });

      // Force re-render by creating new array
      setWishlistItems([...response.data.data]);
      setFetchLoading(false);
    } catch (error) {
      console.error('Error fetching wishlist items:', error);
      if (fetchLoading) {
        showSnackbar(error.response?.data?.message || 'Error fetching wishlist items', 'error');
        setFetchLoading(false);
      }
    }
  };

  // Set up auto-refresh
  useEffect(() => {
    fetchWishlistItems();

    // Auto-refresh every 3 seconds
    refreshIntervalRef.current = setInterval(() => {
      console.log('⏰ Auto-refresh triggered');
      fetchWishlistItems();
    }, 3000);

    // Cleanup on unmount
    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
        console.log('🛑 Refresh interval cleared');
      }
    };
  }, [user]);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!user) {
        showSnackbar('Please log in to add wishlist items', 'error');
        return;
      }

      const payload = {
        itemName: formData.itemName.trim(),
        description: formData.description.trim(),
        amountRequired: parseFloat(formData.amountRequired),
        quantity: parseInt(formData.quantity),
        category: formData.category,
        urgencyLevel: formData.urgencyLevel
      };

      if (formData.deadline) {
        payload.deadline = formData.deadline;
      }

      const response = await wishlistApi.create(payload);

      if (formData.supportingDocuments.length > 0 && formData.supportingDocuments[0].size) {
        const formDataToSend = new FormData();
        formData.supportingDocuments.forEach(file => {
          formDataToSend.append('documents', file);
        });

        await wishlistApi.uploadDocuments(response.data.data._id, formDataToSend);
      }

      setOpenForm(false);
      resetForm();
      await fetchWishlistItems();
      showSnackbar('Wishlist item added successfully');
    } catch (error) {
      console.error('Error adding wishlist item:', error);
      if (error.response) {
        showSnackbar(error.response.data.message || 'Error adding wishlist item', 'error');
      } else if (error.request) {
        showSnackbar('No response from server', 'error');
      } else {
        showSnackbar('Error adding wishlist item', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteDialog({ open: true, id });
  };

  const handleDeleteConfirm = async () => {
    try {
      if (!user) {
        showSnackbar('Please log in to delete wishlist items', 'error');
        return;
      }

      await wishlistApi.delete(deleteDialog.id);
      setDeleteDialog({ open: false, id: null });
      await fetchWishlistItems();
      showSnackbar('Wishlist item deleted successfully');
    } catch (error) {
      console.error('Error deleting wishlist item:', error);
      showSnackbar(error.response?.data?.message || 'Error deleting wishlist item', 'error');
    }
  };

  const resetForm = () => {
    setFormData({
      itemName: '',
      description: '',
      amountRequired: '',
      quantity: '1',
      deadline: '',
      urgencyLevel: 'Medium',
      category: '',
      supportingDocuments: []
    });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      supportingDocuments: [...prev.supportingDocuments, ...files]
    }));
  };

  const removeFile = (index) => {
    setFormData(prev => ({
      ...prev,
      supportingDocuments: prev.supportingDocuments.filter((_, i) => i !== index)
    }));
  };

  const getUrgencyColor = (level) => {
    switch (level) {
      case 'High': return 'error';
      case 'Medium': return 'warning';
      case 'Low': return 'success';
      default: return 'default';
    }
  };

  const getProgress = (item) => {
    if (!item.amountRequired) return 0;
    
    if (item.progress !== undefined && item.progress !== null) {
      return Math.min(Math.max(item.progress, 0), 100);
    }
    
    if (item.amountRaised !== undefined) {
      return Math.min(Math.round((item.amountRaised / item.amountRequired) * 100), 100);
    }
    
    return 0;
  };

  const getAmountRaised = (item) => {
    return Math.max(item.amountRaised || 0, 0);
  };

  if (fetchLoading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '60vh',
        bgcolor: 'background.default'
      }}>
        <CircularProgress size={60} thickness={4} sx={{ color: '#1976d2' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      bgcolor: '#fafbfc',
      py: { xs: 3, md: 5 },
      px: { xs: 2, sm: 3, md: 4 }
    }}>
      <Container maxWidth="xl">
        <Fade in timeout={600}>
          <Box sx={{ mb: 4 }}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              mb: 2,
              flexWrap: 'wrap',
              gap: 2
            }}>
              <Box>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontWeight: 700,
                    color: '#1a1a1a',
                    letterSpacing: '-0.02em',
                    fontSize: { xs: '1.75rem', sm: '2.125rem' },
                    mb: 0.5
                  }}
                >
                  My Wishlist
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#64748b',
                    fontSize: '0.938rem'
                  }}
                >
                  {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} in your wishlist
                </Typography>
              </Box>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setOpenForm(true)}
                sx={{
                  bgcolor: '#1976d2',
                  borderRadius: '12px',
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 600,
                  px: 3.5,
                  py: 1.5,
                  boxShadow: '0 4px 14px rgba(25, 118, 210, 0.3)',
                  '&:hover': {
                    bgcolor: '#1565c0',
                    boxShadow: '0 6px 20px rgba(25, 118, 210, 0.4)',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                Add New Item
              </Button>
            </Box>
          </Box>
        </Fade>

        {wishlistItems.length === 0 ? (
          <Zoom in timeout={600}>
            <Paper 
              elevation={0}
              sx={{ 
                textAlign: 'center', 
                py: 10,
                bgcolor: 'white',
                borderRadius: '20px',
                border: '2px dashed #e2e8f0',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
              }}
            >
              <FavoriteIcon sx={{ fontSize: 80, mb: 3, color: '#cbd5e1', opacity: 0.6 }} />
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#334155', mb: 1 }}>
                No wishlist items yet
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b', mb: 3, maxWidth: 400, mx: 'auto' }}>
                Start building your wishlist by adding items you need. Track progress and manage your goals all in one place.
              </Typography>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => setOpenForm(true)}
                sx={{
                  borderRadius: '10px',
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 3,
                  py: 1.2,
                  borderColor: '#1976d2',
                  color: '#1976d2',
                  '&:hover': {
                    borderColor: '#1565c0',
                    bgcolor: 'rgba(25, 118, 210, 0.04)'
                  }
                }}
              >
                Add Your First Item
              </Button>
            </Paper>
          </Zoom>
        ) : (
          <Grid container spacing={3}>
            {wishlistItems.map((item, index) => {
              const progress = getProgress(item);
              const amountRaised = getAmountRaised(item);
              
              return (
                <Grid item xs={12} sm={6} lg={4} key={item._id}>
                  <Zoom in timeout={400} style={{ transitionDelay: `${index * 80}ms` }}>
                    <Card
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        bgcolor: 'white',
                        borderRadius: '16px',
                        border: '1px solid #f1f5f9',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        overflow: 'hidden',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 12px 28px rgba(25, 118, 210, 0.15)',
                          borderColor: '#1976d2'
                        }
                      }}
                    >
                      <CardContent sx={{ flexGrow: 1, p: 3 }}>
                        <Box sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'flex-start',
                          mb: 2
                        }}>
                          <Box sx={{ flex: 1, pr: 1 }}>
                            <Typography 
                              variant="h6" 
                              sx={{ 
                                fontWeight: 700,
                                color: '#1e293b',
                                mb: 0.5,
                                fontSize: '1.125rem',
                                lineHeight: 1.4
                              }}
                            >
                              {item.itemName}
                            </Typography>
                            <Chip
                              label={item.category}
                              size="small"
                              sx={{ 
                                bgcolor: '#eff6ff',
                                color: '#1976d2',
                                fontWeight: 600,
                                fontSize: '0.75rem',
                                height: '24px'
                              }}
                            />
                          </Box>
                          <IconButton 
                            onClick={() => handleDeleteClick(item._id)}
                            size="small"
                            sx={{ 
                              color: '#94a3b8',
                              '&:hover': { 
                                bgcolor: '#fee2e2',
                                color: '#ef4444'
                              }
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>

                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: '#64748b',
                            mb: 3,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}
                        >
                          {item.description}
                        </Typography>

                        {item.amountRequired && (
                          <Box sx={{ mb: 3 }}>
                            <Box sx={{ 
                              display: 'flex', 
                              justifyContent: 'space-between', 
                              alignItems: 'center',
                              mb: 1.5
                            }}>
                              <Typography 
                                variant="body2" 
                                sx={{ 
                                  fontWeight: 600,
                                  color: '#475569',
                                  fontSize: '0.813rem'
                                }}
                              >
                                Progress
                              </Typography>
                              <Typography 
                                variant="body2" 
                                sx={{ 
                                  fontWeight: 700,
                                  color: '#1976d2',
                                  fontSize: '0.875rem'
                                }}
                              >
                                ₹{amountRaised.toLocaleString()} / ₹{item.amountRequired.toLocaleString()}
                              </Typography>
                            </Box>
                            <Box sx={{ position: 'relative' }}>
                              <LinearProgress
                                variant="determinate"
                                value={progress}
                                sx={{ 
                                  height: 10, 
                                  borderRadius: '10px',
                                  bgcolor: '#f1f5f9',
                                  '& .MuiLinearProgress-bar': {
                                    borderRadius: '10px',
                                    bgcolor: progress === 100 ? '#10b981' : '#1976d2',
                                    boxShadow: progress === 100 
                                      ? '0 0 10px rgba(16, 185, 129, 0.4)'
                                      : '0 0 10px rgba(25, 118, 210, 0.4)'
                                  }
                                }}
                              />
                              {progress === 100 && (
                                <CheckCircleIcon 
                                  sx={{ 
                                    position: 'absolute',
                                    right: -4,
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: '#10b981',
                                    fontSize: '1.25rem',
                                    bgcolor: 'white',
                                    borderRadius: '50%'
                                  }} 
                                />
                              )}
                            </Box>
                            <Typography 
                              variant="caption" 
                              sx={{ 
                                color: progress === 100 ? '#10b981' : '#64748b',
                                fontWeight: 600,
                                fontSize: '0.75rem',
                                mt: 0.5,
                                display: 'block'
                              }}
                            >
                              {progress}% {progress === 100 ? 'Completed!' : 'funded'}
                            </Typography>
                          </Box>
                        )}

                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                          <Chip
                            label={`₹${item.amountRequired.toLocaleString()}`}
                            size="small"
                            sx={{ 
                              bgcolor: '#f0fdf4',
                              color: '#15803d',
                              fontWeight: 700,
                              fontSize: '0.813rem',
                              height: '28px'
                            }}
                          />
                          <Chip
                            label={`Qty: ${item.quantity}`}
                            size="small"
                            sx={{ 
                              bgcolor: '#fef3c7',
                              color: '#b45309',
                              fontWeight: 600,
                              fontSize: '0.813rem',
                              height: '28px'
                            }}
                          />
                          <Chip
                            label={item.urgencyLevel}
                            color={getUrgencyColor(item.urgencyLevel)}
                            size="small"
                            sx={{ 
                              fontWeight: 600,
                              fontSize: '0.813rem',
                              height: '28px'
                            }}
                          />
                        </Box>

                        {item.deadline && (
                          <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 1,
                            pt: 2,
                            borderTop: '1px solid #f1f5f9'
                          }}>
                            <CalendarIcon sx={{ fontSize: '1rem', color: '#94a3b8' }} />
                            <Typography 
                              variant="caption" 
                              sx={{ 
                                color: '#64748b',
                                fontWeight: 500,
                                fontSize: '0.813rem'
                              }}
                            >
                              Deadline: {new Date(item.deadline).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </Typography>
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  </Zoom>
                </Grid>
              );
            })}
          </Grid>
        )}

        <Dialog 
          open={openForm} 
          onClose={() => !loading && setOpenForm(false)} 
          maxWidth="sm" 
          fullWidth
          TransitionComponent={Zoom}
          PaperProps={{
            sx: {
              borderRadius: '20px',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)'
            }
          }}
        >
          <DialogTitle sx={{ 
            fontWeight: 700, 
            fontSize: '1.5rem',
            color: '#1e293b',
            borderBottom: '1px solid #f1f5f9',
            pb: 2,
            pt: 3,
            px: 3
          }}>
            Add Wishlist Item
          </DialogTitle>
          <form onSubmit={handleSubmit}>
            <DialogContent sx={{ pt: 3, px: 3 }}>
              <Grid container spacing={2.5}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Item Name"
                    placeholder="e.g., Wheelchair, Screen Reader Software"
                    value={formData.itemName}
                    onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
                    required
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        '&:hover fieldset': {
                          borderColor: '#1976d2'
                        }
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description"
                    placeholder="Describe the item and why you need it"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    multiline
                    rows={3}
                    required
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        '&:hover fieldset': {
                          borderColor: '#1976d2'
                        }
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Amount Required"
                    placeholder="0"
                    type="number"
                    value={formData.amountRequired}
                    onChange={(e) => setFormData({ ...formData, amountRequired: e.target.value })}
                    required
                    InputProps={{
                      startAdornment: <Typography sx={{ mr: 0.5, color: '#64748b' }}>₹</Typography>
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        '&:hover fieldset': {
                          borderColor: '#1976d2'
                        }
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Quantity"
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    required
                    inputProps={{ min: 1 }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        '&:hover fieldset': {
                          borderColor: '#1976d2'
                        }
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Category</InputLabel>
                    <Select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      label="Category"
                      required
                      sx={{
                        borderRadius: '12px',
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#1976d2'
                        }
                      }}
                    >
                      <MenuItem value="Medical">Medical</MenuItem>
                      <MenuItem value="Education">Education</MenuItem>
                      <MenuItem value="Mobility">Mobility</MenuItem>
                      <MenuItem value="Technology">Technology</MenuItem>
                      <MenuItem value="Other">Other</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Urgency Level</InputLabel>
                    <Select
                      value={formData.urgencyLevel}
                      onChange={(e) => setFormData({ ...formData, urgencyLevel: e.target.value })}
                      label="Urgency Level"
                      sx={{
                        borderRadius: '12px',
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#1976d2'
                        }
                      }}
                    >
                      <MenuItem value="Low">Low</MenuItem>
                      <MenuItem value="Medium">Medium</MenuItem>
                      <MenuItem value="High">High</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Deadline (Optional)"
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ min: new Date().toISOString().split('T')[0] }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        '&:hover fieldset': {
                          borderColor: '#1976d2'
                        }
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    component="label"
                    variant="outlined"
                    startIcon={<AttachFileIcon />}
                    fullWidth
                    sx={{
                      borderRadius: '12px',
                      textTransform: 'none',
                      py: 1.5,
                      fontWeight: 600,
                      borderColor: '#cbd5e1',
                      color: '#475569',
                      '&:hover': {
                        borderColor: '#1976d2',
                        bgcolor: 'rgba(25, 118, 210, 0.04)',
                        color: '#1976d2'
                      }
                    }}
                  >
                    Upload Supporting Documents (Optional)
                    <input
                      type="file"
                      hidden
                      multiple
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    />
                  </Button>
                  {formData.supportingDocuments.length > 0 && (
                    <Box sx={{ mt: 1.5, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {formData.supportingDocuments.map((file, index) => (
                        <Chip
                          key={index}
                          label={file.name}
                          onDelete={() => removeFile(index)}
                          size="small"
                          sx={{ 
                            maxWidth: '200px',
                            bgcolor: '#f1f5f9',
                            '&:hover': {
                              bgcolor: '#e2e8f0'
                            }
                          }}
                        />
                      ))}
                    </Box>
                  )}
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 3, pt: 2, gap: 1.5 }}>
              <Button 
                onClick={() => setOpenForm(false)}
                disabled={loading}
                sx={{
                  textTransform: 'none',
                  borderRadius: '10px',
                  px: 3,
                  py: 1,
                  color: '#64748b',
                  fontWeight: 600,
                  '&:hover': {
                    bgcolor: '#f8fafc'
                  }
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={18} sx={{ color: 'white' }} /> : <AddIcon />}
                sx={{
                  textTransform: 'none',
                  borderRadius: '10px',
                  px: 3.5,
                  py: 1,
                  fontWeight: 600,
                  bgcolor: '#1976d2',
                  boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                  '&:hover': {
                    bgcolor: '#1565c0',
                    boxShadow: '0 6px 16px rgba(25, 118, 210, 0.4)'
                  },
                  '&:disabled': {
                    bgcolor: '#cbd5e1'
                  }
                }}
              >
                {loading ? 'Adding...' : 'Add Item'}
              </Button>
            </DialogActions>
          </form>
        </Dialog>

        <Dialog
          open={deleteDialog.open}
          onClose={() => setDeleteDialog({ open: false, id: null })}
          TransitionComponent={Zoom}
          PaperProps={{
            sx: { borderRadius: '16px', maxWidth: '400px' }
          }}
        >
          <DialogTitle sx={{ fontWeight: 700, color: '#1e293b', pb: 1 }}>
            Confirm Delete
          </DialogTitle>
          <DialogContent>
            <Typography sx={{ color: '#64748b' }}>
              Are you sure you want to delete this wishlist item? This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
            <Button 
              onClick={() => setDeleteDialog({ open: false, id: null })}
              sx={{ 
                textTransform: 'none', 
                borderRadius: '10px',
                fontWeight: 600,
                color: '#64748b'
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleDeleteConfirm} 
              variant="contained"
              sx={{ 
                textTransform: 'none', 
                borderRadius: '10px',
                fontWeight: 600,
                bgcolor: '#ef4444',
                '&:hover': {
                  bgcolor: '#dc2626'
                }
              }}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          TransitionComponent={Fade}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            variant="filled"
            icon={snackbar.severity === 'success' ? <CheckCircleIcon /> : undefined}
            sx={{ 
              width: '100%',
              borderRadius: '12px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
              fontWeight: 600,
              fontSize: '0.938rem',
              alignItems: 'center',
              bgcolor: snackbar.severity === 'success' ? '#10b981' : undefined,
              '& .MuiAlert-icon': {
                fontSize: '1.5rem'
              }
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>

        {wishlistItems.length > 0 && (
          <Zoom in timeout={600} style={{ transitionDelay: '400ms' }}>
            <Fab
              color="primary"
              aria-label="add"
              onClick={() => setOpenForm(true)}
              sx={{
                position: 'fixed',
                bottom: 24,
                right: 24,
                display: { xs: 'flex', sm: 'none' },
                bgcolor: '#1976d2',
                boxShadow: '0 8px 24px rgba(25, 118, 210, 0.4)',
                '&:hover': {
                  bgcolor: '#1565c0',
                  boxShadow: '0 12px 32px rgba(25, 118, 210, 0.5)',
                  transform: 'scale(1.1)'
                },
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              <AddIcon sx={{ fontSize: '1.75rem' }} />
            </Fab>
          </Zoom>
        )}
      </Container>
    </Box>
  );
};

export default WishlistSection;