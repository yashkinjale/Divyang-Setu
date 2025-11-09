import React from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  Fade,
  Slide,
  Zoom,
} from '@mui/material';
import {
  MailOutline,
  Phone,
  LocationOn,
  Instagram,
  Twitter,
  LinkedIn,
} from '@mui/icons-material';

const ContactPage = () => {
  const contactInfo = [
    {
      icon: MailOutline,
      title: 'Email',
      value: 'support@divyangsetu.org',
      color: '#4285F4',
      link: 'mailto:support@divyangsetu.org',
    },
    {
      icon: Phone,
      title: 'Phone',
      value: '+91 1800-XXX-XXXX',
      color: '#1976D2',
      link: 'tel:+911800XXXXXXX',
    },
    {
      icon: LocationOn,
      title: 'Location',
      value: 'Mumbai, Maharashtra, India',
      color: '#2196F3',
      link: 'https://www.google.com/maps/place/Mumbai,+Maharashtra,+India',
    },
    {
      icon: Instagram,
      title: 'Instagram',
      value: '@divyangsetu',
      color: '#1565C0',
      link: 'https://www.instagram.com/divyangsetu',
    },
    {
      icon: Twitter,
      title: 'Twitter',
      value: '@divyangsetu',
      color: '#4285F4',
      link: 'https://twitter.com/divyangsetu',
    },
    {
      icon: LinkedIn,
      title: 'LinkedIn',
      value: 'DivyangSetu',
      color: '#1976D2',
      link: 'https://www.linkedin.com/company/divyangsetu',
    },
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#fafafa' }}>
      {/* Header with Fade In */}
      <Fade in={true} timeout={1000}>
        <Box
          sx={{
            background: 'linear-gradient(135deg, #4285F4 0%, #1565C0 100%)',
            color: 'white',
            py: 12,
            textAlign: 'center',
          }}
        >
          <Container maxWidth="md">
            <Slide direction="down" in={true} timeout={800}>
              <Typography
                variant="h2"
                sx={{ fontWeight: 700, mb: 3, fontSize: { xs: '2.5rem', md: '3.5rem' } }}
              >
                Contact Us
              </Typography>
            </Slide>
            <Slide direction="up" in={true} timeout={1000}>
              <Typography variant="h5" sx={{ opacity: 0.95 }}>
                We're here to help and answer any questions you might have
              </Typography>
            </Slide>
          </Container>
        </Box>
      </Fade>

      {/* Contact Info Cards with Staggered Animation */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Fade in={true} timeout={1200}>
          <Typography variant="h4" align="center" sx={{ fontWeight: 700, mb: 6, color: '#263238' }}>
            Get In Touch
          </Typography>
        </Fade>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4, justifyContent: 'center' }}>
          {contactInfo.map((info, index) => (
            <Zoom 
              key={index}
              in={true} 
              timeout={800}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <Card
                component="a"
                href={info.link}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  p: 4,
                  textAlign: 'center',
                  height: '220px',
                  width: '280px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  background: 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease',
                  textDecoration: 'none',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 8px 20px rgba(66, 133, 244, 0.3)',
                    background: 'linear-gradient(135deg, #BBDEFB 0%, #90CAF9 100%)',
                  },
                }}
              >
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: '12px',
                    background: `linear-gradient(135deg, ${info.color} 0%, ${info.color}DD 100%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2,
                  }}
                >
                  <info.icon sx={{ fontSize: 32, color: 'white' }} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: '#263238' }}>
                  {info.title}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {info.value}
                </Typography>
              </Card>
            </Zoom>
          ))}
        </Box>
      </Container>

      {/* Footer with Slide In */}
      <Slide direction="up" in={true} timeout={1000}>
        <Box
          component="footer"
          sx={{
            background: 'linear-gradient(135deg, #1565C0 0%, #0D47A1 100%)',
            color: 'white',
            py: 6,
            mt: 8,
          }}
        >
          <Container maxWidth="lg">
            <Typography variant="body1" align="center" sx={{ fontSize: '18px' }}>
              © 2025 DivyangSetu. All rights reserved.
            </Typography>
          </Container>
        </Box>
      </Slide>
    </Box>
  );
};

export default ContactPage;