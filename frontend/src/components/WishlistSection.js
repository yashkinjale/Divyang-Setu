import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Grid,
  IconButton,
  Snackbar,
  Alert,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  AttachFile as AttachFileIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { wishlistApi } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const WishlistSection = () => {
  const { user } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
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

  useEffect(() => {
    fetchWishlistItems();
  }, []);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const fetchWishlistItems = async () => {
    try {
      if (!user) {
        showSnackbar('Please log in to access wishlist', 'error');
        return;
      }

      const response = await wishlistApi.getAll();
      setWishlistItems(response.data.data);
    } catch (error) {
      console.error('Error fetching wishlist items:', error);
      showSnackbar(error.response?.data?.message || 'Error fetching wishlist items', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!user) {
        showSnackbar('Please log in to add wishlist items', 'error');
        return;
      }

      // Format the request payload
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

      console.log('Sending wishlist payload:', payload);

      // Create wishlist item
      const response = await wishlistApi.create(payload);
      console.log('Wishlist creation response:', response);

      // Upload documents if any
      if (formData.supportingDocuments.length > 0 && formData.supportingDocuments[0].size) {
        const formDataToSend = new FormData();
        formData.supportingDocuments.forEach(file => {
          formDataToSend.append('documents', file);
        });

        await wishlistApi.uploadDocuments(response.data.data._id, formDataToSend);
      }

      setOpenForm(false);
      resetForm();
      fetchWishlistItems();
      showSnackbar('Wishlist item added successfully');
    } catch (error) {
      console.error('Error adding wishlist item:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        showSnackbar(error.response.data.message || 'Error adding wishlist item', 'error');
      } else if (error.request) {
        console.error('Error request:', error.request);
        showSnackbar('No response from server', 'error');
      } else {
        showSnackbar('Error adding wishlist item', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      if (!user) {
        showSnackbar('Please log in to delete wishlist items', 'error');
        return;
      }

      await wishlistApi.delete(id);
      fetchWishlistItems();
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

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" component="h2">
          My Wishlist
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenForm(true)}
        >
          Add Item
        </Button>
      </Box>

      <Grid container spacing={3}>
        {wishlistItems.map((item) => (
          <Grid item xs={12} md={6} key={item._id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="h6">{item.itemName}</Typography>
                    <Typography color="textSecondary" gutterBottom>
                      {item.category}
                    </Typography>
                  </Box>
                  <IconButton onClick={() => handleDelete(item._id)}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
                <Typography variant="body2" paragraph>
                  {item.description}
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
                  <Chip
                    label={`₹${item.amountRequired}`}
                    color="primary"
                    size="small"
                  />
                  <Chip
                    label={`Qty: ${item.quantity}`}
                    color="secondary"
                    size="small"
                  />
                  <Chip
                    label={item.urgencyLevel}
                    color={
                      item.urgencyLevel === 'High' ? 'error' :
                      item.urgencyLevel === 'Medium' ? 'warning' : 'success'
                    }
                    size="small"
                  />
                </Box>
                {item.deadline && (
                  <Typography variant="caption" color="textSecondary">
                    Deadline: {new Date(item.deadline).toLocaleDateString()}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openForm} onClose={() => setOpenForm(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Wishlist Item</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
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
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
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
              <Grid item xs={12}>
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<AttachFileIcon />}
                  fullWidth
                >
                  Upload Supporting Documents
                  <input
                    type="file"
                    hidden
                    multiple
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  />
                </Button>
                {formData.supportingDocuments.length > 0 && (
                  <Box sx={{ mt: 1 }}>
                    {formData.supportingDocuments.map((file, index) => (
                      <Chip
                        key={index}
                        label={file.name}
                        onDelete={() => removeFile(index)}
                        sx={{ m: 0.5 }}
                      />
                    ))}
                  </Box>
                )}
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenForm(false)}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              {loading ? 'Adding...' : 'Add Item'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default WishlistSection; 