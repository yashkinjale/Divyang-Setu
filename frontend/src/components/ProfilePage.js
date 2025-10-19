import React, { useState, useEffect } from 'react';
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
  Paper,
  Tab,
  Tabs,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  AttachFile as AttachFileIcon,
  CalendarToday as CalendarIcon,
  LocalOffer as LocalOfferIcon,
  Favorite as FavoriteIcon,
  CheckCircle as CheckCircleIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Close as CloseIcon,
  Description as DescriptionIcon,
  Timeline as TimelineIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { wishlistApi } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const WishlistSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { user } = useAuth();
  
  const [wishlistItems, setWishlistItems] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [activeTab, setActiveTab] = useState(0);
  
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

  // Fetch wishlist items
  const fetchWishlistItems = async () => {
    try {
      console.log('Fetching wishlist...');
      if (!user) {
        setLoading(false);
        return;
      }

      const response = await wishlistApi.getAll();
      console.log('Wishlist data:', response.data.data);
      setWishlistItems(response.data.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      setLoading(false);
    }
  };

  // Set up polling
  useEffect(() => {
    fetchWishlistItems();
    
    // Poll every 2 seconds
    const interval = setInterval(() => {
      fetchWishlistItems();
    }, 2000);

    return () => clearInterval(interval);
  }, [user]);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

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
      showSnackbar(error.response?.data?.message || 'Error adding wishlist item', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteDialog({ open: true, id });
  };

  const handleDeleteConfirm = async () => {
    try {
      if (!user) {
        showSnackbar('Please log in', 'error');
        return;
      }

      await wishlistApi.delete(deleteDialog.id);
      setDeleteDialog({ open: false, id: null });
      await fetchWishlistItems();
      showSnackbar('Wishlist item deleted successfully');
    } catch (error) {
      console.error('Error deleting:', error);
      showSnackbar('Error deleting wishlist item', 'error');
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

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
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
        <AnimatePresence>
          {(snackbar.open) && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Alert 
                severity={snackbar.severity}
                action={
                  <IconButton
                    color="inherit"
                    size="small"
                    onClick={handleCloseSnackbar}
                  >
                    <CloseIcon />
                  </IconButton>
                }
                sx={{ mb: 3 }}
              >
                {snackbar.message}
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Paper elevation={2} sx={{ p: 4, mb: 4, borderRadius: 2 }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={8}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                  My Wishlist
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} in your wishlist
                </Typography>
              </Grid>
              <Grid item xs={12} md={4} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setOpenForm(true)}
                  size="large"
                >
                  Add New Item
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Paper elevation={1}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs
                value={activeTab}
                onChange={(e, val) => setActiveTab(val)}
                variant={isMobile ? "scrollable" : "fullWidth"}
                scrollButtons="auto"
              >
                <Tab icon={<FavoriteIcon />} label="All Items" />
              </Tabs>
            </Box>

            <TabPanel value={activeTab} index={0}>
              {wishlistItems.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
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
                  {wishlistItems.map((item, index) => (
                    <Card key={item._id || index} variant="outlined">
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                              {item.itemName}
                            </Typography>
                            {item.description && (
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                {item.description}
                              </Typography>
                            )}
                          </Box>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Chip
                              label={`${item.urgencyLevel || 'medium'} priority`}
                              color={
                                item.urgencyLevel === "High" ? "error" :
                                item.urgencyLevel === "Medium" ? "warning" : "success"
                              }
                              size="small"
                            />
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteClick(item._id)}
                              sx={{ color: 'error.main' }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </Box>

                        {item.amountRequired && (
                          <Box sx={{ mb: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                              <Typography variant="body2">Progress</Typography>
                              <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                ₹{(item.amountRaised || 0).toLocaleString()} / ₹{(item.amountRequired || 0).toLocaleString()}
                              </Typography>
                            </Box>
                            <LinearProgress
                              variant="determinate"
                              value={item.progress || 0}
                              sx={{ height: 8, borderRadius: 1, mb: 1 }}
                            />
                            <Typography variant="caption" color="text.secondary">
                              {item.progress || 0}% completed
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
                          {item.urgencyLevel && (
                            <Chip label={item.urgencyLevel} size="small" variant="outlined" />
                          )}
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              )}
            </TabPanel>
          </Paper>
        </motion.div>

        {/* Add Item Dialog */}
        <Dialog 
          open={openForm} 
          onClose={() => !saving && setOpenForm(false)} 
          maxWidth="sm" 
          fullWidth
        >
          <DialogTitle>Add Wishlist Item</DialogTitle>
          <form onSubmit={handleSubmit}>
            <DialogContent sx={{ pt: 3 }}>
              <Grid container spacing={2.5}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Item Name"
                    value={formData.itemName}
                    onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    multiline
                    rows={3}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Amount Required"
                    type="number"
                    value={formData.amountRequired}
                    onChange={(e) => setFormData({ ...formData, amountRequired: e.target.value })}
                    required
                    InputProps={{ startAdornment: '₹' }}
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
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    component="label"
                    variant="outlined"
                    startIcon={<AttachFileIcon />}
                    fullWidth
                  >
                    Upload Documents (Optional)
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
                      {formData.supportingDocuments.map((file, idx) => (
                        <Chip
                          key={idx}
                          label={file.name}
                          onDelete={() => removeFile(idx)}
                          size="small"
                        />
                      ))}
                    </Box>
                  )}
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
              <Button 
                onClick={() => setOpenForm(false)}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={saving}
                startIcon={saving ? <CircularProgress size={18} color="inherit" /> : <AddIcon />}
              >
                {saving ? 'Adding...' : 'Add Item'}
              </Button>
            </DialogActions>
          </form>
        </Dialog>

        {/* Delete Dialog */}
        <Dialog
          open={deleteDialog.open}
          onClose={() => setDeleteDialog({ open: false, id: null })}
        >
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete this wishlist item?
            </Typography>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
            <Button onClick={() => setDeleteDialog({ open: false, id: null })}>
              Cancel
            </Button>
            <Button 
              onClick={handleDeleteConfirm} 
              variant="contained"
              color="error"
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default WishlistSection;