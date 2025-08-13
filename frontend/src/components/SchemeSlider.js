import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  IconButton,
  Chip,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  ArrowForward as ArrowForwardIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const SchemeSlider = ({ schemes }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % schemes.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + schemes.length) % schemes.length);
  };

  // Auto slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000); // Change slide every 5 seconds

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []); // Empty dependency array means this effect runs once on mount

  // Pause auto-sliding when user hovers over the slider
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    let interval;
    if (!isPaused) {
      interval = setInterval(() => {
        nextSlide();
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <Box 
      sx={{ 
        position: 'relative', 
        height: { xs: 'auto', sm: 500 },
        overflow: 'hidden', 
        borderRadius: 2,
        bgcolor: 'background.paper',
        boxShadow: 1
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5 }}
          style={{ height: '100%' }}
        >
          <Card sx={{ 
            height: '100%', 
            position: 'relative',
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' }
          }}>
            <CardMedia
              component="img"
              sx={{
                height: { xs: 200, sm: '100%' },
                width: { xs: '100%', sm: '50%' },
                objectFit: 'cover'
              }}
              image={schemes[currentIndex].image}
              alt={schemes[currentIndex].title}
            />
            <Box sx={{ 
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              p: 3
            }}>
              <Typography variant="h5" gutterBottom>
                {schemes[currentIndex].title}
              </Typography>
              <Typography 
                variant="body1" 
                color="text.secondary" 
                paragraph
                sx={{
                  flex: 1,
                  overflow: 'auto',
                  mb: 2
                }}
              >
                {schemes[currentIndex].description}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <Chip 
                  label={schemes[currentIndex].type} 
                  color="primary" 
                  size="small" 
                />
                <Chip 
                  label={schemes[currentIndex].deadline} 
                  color="secondary" 
                  size="small" 
                />
              </Box>
              <Button 
                variant="contained" 
                endIcon={<ArrowForwardIcon />}
                fullWidth
                size="large"
                sx={{ mt: 'auto' }}
              >
                Apply Now
              </Button>
            </Box>
          </Card>
        </motion.div>
      </AnimatePresence>
      
      <IconButton
        onClick={prevSlide}
        sx={{
          position: 'absolute',
          left: 8,
          top: '50%',
          transform: 'translateY(-50%)',
          bgcolor: 'rgba(255, 255, 255, 0.9)',
          '&:hover': { bgcolor: 'rgba(255, 255, 255, 1)' },
          display: { xs: 'none', sm: 'flex' }
        }}
      >
        <ArrowBackIcon />
      </IconButton>
      
      <IconButton
        onClick={nextSlide}
        sx={{
          position: 'absolute',
          right: 8,
          top: '50%',
          transform: 'translateY(-50%)',
          bgcolor: 'rgba(255, 255, 255, 0.9)',
          '&:hover': { bgcolor: 'rgba(255, 255, 255, 1)' },
          display: { xs: 'none', sm: 'flex' }
        }}
      >
        <ArrowForwardIcon />
      </IconButton>

      {/* Mobile Navigation Dots */}
      <Box sx={{ 
        display: { xs: 'flex', sm: 'none' },
        justifyContent: 'center',
        gap: 1,
        p: 2
      }}>
        {schemes.map((_, index) => (
          <IconButton
            key={index}
            size="small"
            onClick={() => setCurrentIndex(index)}
            sx={{
              bgcolor: currentIndex === index ? 'primary.main' : 'grey.300',
              '&:hover': {
                bgcolor: currentIndex === index ? 'primary.dark' : 'grey.400'
              }
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default SchemeSlider;

