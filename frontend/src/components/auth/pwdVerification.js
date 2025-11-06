import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Alert,
  IconButton,
  CircularProgress,
  LinearProgress,
} from '@mui/material';
import { CloudUpload, Close, CheckCircle, HourglassEmpty } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { disabledApi, pwdApi } from '../../utils/api';

const PWDCertificateVerification = () => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Load saved file name
  useEffect(() => {
    const savedFileName = sessionStorage.getItem('pwdFileName');
    if (savedFileName) {
      setFile({ name: savedFileName });
    }
  }, []);

  // Save file name
  useEffect(() => {
    if (file) {
      sessionStorage.setItem('pwdFileName', file.name);
    } else {
      sessionStorage.removeItem('pwdFileName');
    }
  }, [file]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 7 * 1024 * 1024) {
        setError('File size should not exceed 7MB.');
        setFile(null);
      } else if (
        !['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'].includes(selectedFile.type)
      ) {
        setError('Invalid file format. Please upload a PDF, JPG, or PNG file.');
        setFile(null);
      } else {
        setError('');
        setSuccess('');
        setFile(selectedFile);
      }
    }
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    handleFileChange({ target: { files: [droppedFile] } });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file to upload.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');
    setUploadProgress(10);

    let progressInterval = null;

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('name', 'PWD Certificate');

      setUploadProgress(20);

      // Simulate progress updates during OCR processing
      progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev < 90) {
            return prev + 5; // Gradually increase progress
          }
          return prev;
        });
      }, 500);

      const response = await pwdApi.verify(formData);
      
      if (progressInterval) {
        clearInterval(progressInterval);
      }
      setUploadProgress(100);

      if (response.data.success || response.status === 202) {
        const status = response.data.status;
        const certificateData = response.data.certificateData;
        
        // Show appropriate success message
        if (status === 'verified') {
          let successMsg = '✅ Certificate verified successfully! Your account is now verified.';
          if (certificateData?.certificateNumber) {
            successMsg += ` Certificate No: ${certificateData.certificateNumber}.`;
          }
          if (certificateData?.disabilityPercentage) {
            successMsg += ` Disability: ${certificateData.disabilityPercentage}%.`;
          }
          setSuccess(successMsg);
        } else if (status === 'pending_manual') {
          const manualReviewMsg = response.data.message || 
            '📋 Certificate submitted for manual review. Our team will verify it within 24-48 hours. You will be notified once verification is complete.';
          setSuccess(manualReviewMsg);
        } else {
          setSuccess('✅ Document uploaded successfully! Verification complete.');
        }
        
        sessionStorage.removeItem('pwdFileName');
        setFile(null);
        
        // Update user data
        try {
          const profileResponse = await disabledApi.getProfile();
          const updatedUser = { 
            ...(profileResponse.data.user || profileResponse.data), 
            type: 'disabled' 
          };
          
          if (status === 'verified') {
            updatedUser.isVerified = true;
            updatedUser.verificationStatus = 'verified';
          } else {
            updatedUser.verificationStatus = status || 'pending_manual';
          }
          
          localStorage.setItem('user', JSON.stringify(updatedUser));
        } catch (err) {
          console.error('Error refreshing user data:', err);
        }
        
        // Redirect after showing success message
        setTimeout(() => {
          navigate('/disabled/dashboard', { replace: true });
        }, 2500);
        
      } else {
        setError(response.data.message || 'Upload failed. Please try again.');
      }
    } catch (err) {
      // Clear progress interval if still running
      if (progressInterval) {
        clearInterval(progressInterval);
      }
      
      console.error('Upload Error:', {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
      });
      
      const errorMsg = err.response?.data?.message || '';
      const errorDetails = err.response?.data?.details;
      
      // Check if it's actually a rejection or just an error message
      if (err.response?.data?.status === 'rejected') {
        let errorText = '❌ ' + errorMsg;
        if (errorDetails?.errors && errorDetails.errors.length > 0) {
          errorText += '\n\nMissing or invalid fields:';
          errorDetails.errors.forEach((err, idx) => {
            errorText += `\n• ${err}`;
          });
        }
        setError(errorText);
      } else if (errorMsg.includes('PDF files are not supported')) {
        setError('PDF files are not supported yet. Please upload a clear image (JPG/PNG) of your certificate.');
      } else {
        // For other errors, show a helpful message but don't treat as failure
        // The backend should have already sent it for manual review
        setError(errorMsg || 'An error occurred, but your certificate has been submitted for review.');
      }
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  // Redirect if already verified
  useEffect(() => {
    if (user?.isVerified) {
      navigate('/disabled/dashboard', { replace: true });
    }
  }, [user, navigate]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        p: 3,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 2,
          textAlign: 'center',
          maxWidth: 600,
          width: '100%',
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Upload Your PWD Certificate
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Upload your official Disability Certificate for verification
        </Typography>

        <Alert severity="info" sx={{ mb: 2, textAlign: 'left' }}>
          <Typography variant="subtitle2" gutterBottom>
            <strong>Accepted Documents:</strong>
          </Typography>
          <Typography variant="body2" component="div">
            • Official PWD/Disability Certificate from Government authorities
            <br />
            • UDID Card (Unique Disability ID)
            <br />
            • Certificate should have QR code or clear text visible
            <br />
            • Both images (JPG/PNG) and PDFs are accepted
          </Typography>
        </Alert>

        <Alert severity="warning" sx={{ mb: 3, textAlign: 'left' }}>
          <Typography variant="body2">
            <strong>Important:</strong> Only submit PWD/Disability certificates. Random images or other documents will be rejected.
          </Typography>
        </Alert>

        <Box
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          sx={{
            border: '2px dashed',
            borderColor: 'grey.400',
            borderRadius: 2,
            p: 4,
            textAlign: 'center',
            mb: 3,
            cursor: 'pointer',
            backgroundColor: file ? 'grey.100' : 'transparent',
            '&:hover': { backgroundColor: 'grey.50' },
          }}
        >
          <input
            accept="application/pdf,image/jpeg,image/png,image/jpg"
            style={{ display: 'none' }}
            id="raised-button-file"
            type="file"
            onChange={handleFileChange}
            disabled={loading}
          />
          <label htmlFor="raised-button-file">
            <CloudUpload sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" component="p" gutterBottom>
              Drag & Drop or Select a File
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Click the button below to select your certificate
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
              Formats: PDF, JPG, PNG | Max size: 7MB
            </Typography>
            <Button 
              variant="contained" 
              component="span" 
              sx={{ mt: 2 }}
              disabled={loading}
            >
              Choose File
            </Button>
          </label>
        </Box>

        {file && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              p: 2,
              border: '1px solid',
              borderColor: 'grey.300',
              borderRadius: 2,
              mb: 3,
              backgroundColor: 'grey.50',
            }}
          >
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {file.name}
            </Typography>
            <IconButton onClick={() => setFile(null)} disabled={loading}>
              <Close />
            </IconButton>
          </Box>
        )}

        {loading && (
          <Box sx={{ mb: 3 }}>
            <LinearProgress variant="determinate" value={uploadProgress} />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
              {uploadProgress < 20 
                ? 'Uploading certificate...' 
                : uploadProgress < 40 
                ? 'Processing image for OCR...' 
                : uploadProgress < 80 
                ? 'Extracting text from certificate...' 
                : uploadProgress < 95
                ? 'Validating certificate data...'
                : 'Finalizing verification...'}
            </Typography>
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 3, textAlign: 'left' }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert 
            severity="success" 
            icon={success.includes('manual') ? <HourglassEmpty /> : <CheckCircle />}
            sx={{ mb: 3, textAlign: 'left' }}
          >
            {success}
          </Alert>
        )}

        <Button
          variant="contained"
          size="large"
          onClick={handleSubmit}
          disabled={loading || !file}
          sx={{
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            color: 'white',
            width: '100%',
            mb: 2,
          }}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            'Submit for Verification'
          )}
        </Button>

        <Button
          variant="outlined"
          size="medium"
          onClick={() => navigate('/disabled/dashboard')}
          disabled={loading}
          sx={{ width: '100%' }}
        >
          Skip for Now
        </Button>
      </Paper>
    </Box>
  );
};

export default PWDCertificateVerification;