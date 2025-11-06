import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Tabs,
  Tab,
  IconButton,
  AppBar,
  Toolbar,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  People,
  Visibility,
  EmojiObjects,
  Favorite,
  TrendingUp,
  CheckCircle,
  WorkOutline,
  EmojiEvents,
  MailOutline,
  Phone,
  LocationOn,
  LinkedIn,
  Twitter,
  Facebook,
  Instagram,
  Home,
  Accessibility,
} from '@mui/icons-material';

const AboutPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const stats = [
    { icon: People, label: 'PWD Users', value: '10,000+', color: '#4285F4' },
    { icon: Favorite, label: 'Donors', value: '5,000+', color: '#1976D2' },
    { icon: CheckCircle, label: 'Wishes Fulfilled', value: '25,000+', color: '#2196F3' },
    { icon: TrendingUp, label: 'Jobs Placed', value: '3,500+', color: '#1565C0' }
  ];

  const features = [
    {
      icon: Favorite,
      title: 'Wish Fulfillment',
      description: 'Connect PWD individuals with generous donors to fulfill their wishes and needs.'
    },
    {
      icon: WorkOutline,
      title: 'Job Opportunities',
      description: 'Exclusive job board connecting PWD talent with inclusive employers.'
    },
    {
      icon: EmojiEvents,
      title: 'Government Schemes',
      description: 'Comprehensive database of government schemes and benefits for PWD.'
    },
    {
      icon: CheckCircle,
      title: 'Certificate Verification',
      description: 'AI-powered PWD certificate verification for secure and instant authentication.'
    }
  ];

  const team = [
    {
      name: 'Yash Kinjale',
      role: 'Founder & CEO',
      image: 'Founder3.jpg',
      description: 'Social entrepreneur passionate about disability rights and inclusion.'
    },
    {
      name: 'JayRaj Desai',
      role: 'CTO',
      image: 'Founder2.jpg',
      description: 'Tech innovator building accessible solutions for social impact.'
    },
    {
      name: 'Atharva Surve',
      role: 'Head of Operations',
      image: 'Founder1.jpg',
      description: 'Expert in community building and program management.'
    },
    {
      name: 'Sujal Kadam',
      role: 'Accessibility Lead',
      image: 'Founder4.jpg',
      description: 'Ensuring every feature is accessible to all users.'
    }
  ];

  const milestones = [
    { year: '2025', event: 'Founded', description: 'Started with a vision to empower PWD community' },
    { year: '2025', event: 'Tested', description: 'Successfully tested our platform with initial users' },
    { year: '2026', event: 'Implementation', description: 'Full-scale implementation across India' }
  ];

  const values = [
    { title: 'Inclusivity', desc: 'Everyone deserves equal opportunities regardless of their abilities.' },
    { title: 'Dignity', desc: 'We respect and honor the unique strengths of every individual.' },
    { title: 'Innovation', desc: 'Using cutting-edge technology to solve real-world challenges.' },
    { title: 'Transparency', desc: 'Building trust through open communication and accountability.' },
    { title: 'Empowerment', desc: 'Enabling PWD individuals to take control of their future.' },
    { title: 'Community', desc: 'Fostering connections that create lasting positive impact.' }
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#fafafa' }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #4285F4 0%, #1565C0 100%)',
          color: 'white',
          py: 12,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h2"
            sx={{ fontWeight: 700, mb: 3, fontSize: { xs: '2.5rem', md: '3.5rem' } }}
          >
            About DivyangSetu
          </Typography>
          <Typography variant="h5" sx={{ opacity: 0.95, mb: 4 }}>
            Bridging Dreams and Opportunities for Persons with Disabilities
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.95)',
                color: '#e3eeffff',
                px: 4,
                py: 1.5,
                fontWeight: 600,
                textTransform: 'none',
                boxShadow: '0 4px 12px rgba(255, 255, 255, 0.3)',
                '&:hover': { 
                  bgcolor: 'rgba(255, 255, 255, 1)',
                  boxShadow: '0 6px 16px rgba(255, 255, 255, 0.4)',
                },
              }}
              onClick={() => navigate('/donor/register')}
            >
              Join Our Mission
            </Button>
            <Button
              variant="outlined"
              size="large"
              sx={{
                borderColor: 'rgba(255, 255, 255, 0.95)',
                bgcolor: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                px: 4,
                py: 1.5,
                fontWeight: 600,
                textTransform: 'none',
                '&:hover': { 
                  borderColor: 'white', 
                  bgcolor: 'rgba(255,255,255,0.2)' 
                },
              }}
              onClick={() => navigate('/')}
            >
              Learn More
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Stats Section */}
      <Container maxWidth="lg" sx={{ mt: -6, mb: 8 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, flexWrap: 'wrap' }}>
          {stats.map((stat, index) => (
            <Card
              key={index}
              sx={{
                textAlign: 'center',
                p: 3,
                minWidth: { xs: '140px', sm: '200px', md: '220px' },
                flex: { xs: '0 1 45%', md: '0 1 22%' },
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                transition: 'transform 0.3s ease',
                '&:hover': { transform: 'translateY(-8px)' },
              }}
            >
              <stat.icon sx={{ fontSize: 48, color: stat.color, mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                {stat.value}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {stat.label}
              </Typography>
            </Card>
          ))}
        </Box>
      </Container>

      {/* Mission, Vision, Values Tabs */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ 
          borderBottom: 1, 
          borderColor: 'divider', 
          mb: 4,
          background: 'linear-gradient(to right, transparent, rgba(66, 133, 244, 0.1), transparent)',
          py: 1
        }}>
          <Tabs value={activeTab} onChange={handleTabChange} centered>
            <Tab label="Mission" sx={{ textTransform: 'none', fontWeight: 600, fontSize: '16px' }} />
            <Tab label="Vision" sx={{ textTransform: 'none', fontWeight: 600, fontSize: '16px' }} />
            <Tab label="Values" sx={{ textTransform: 'none', fontWeight: 600, fontSize: '16px' }} />
          </Tabs>
        </Box>

        {activeTab === 0 && (
          <Card sx={{ p: 6, boxShadow: '0 4px 16px rgba(0,0,0,0.08)', mx: 'auto' }}>
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <EmojiObjects sx={{ fontSize: 48, color: '#4285F4' }} />
                  <Typography variant="h3" sx={{ fontWeight: 700 }}>
                    Our Mission
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8, fontSize: '16px' }}>
                  To empower Persons with Disabilities (PWD) by creating a comprehensive digital ecosystem 
                  that connects them with opportunities, resources, and a supportive community.
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.8, fontSize: '16px' }}>
                  We believe every individual deserves equal access to employment, education, healthcare, 
                  and the fulfillment of their dreams. Through technology and compassion, we're making this vision a reality.
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <img
                    src="https://cdn.prod.website-files.com/65723defcc7c8c842f5d8a69/657fe8525dfc85aa91b475ce_Volunteer-in-Disability.png"
                    alt="Mission"
                    style={{ width: '100%', maxWidth: '500px', borderRadius: '12px', boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}
                  />
                </Box>
              </Grid>
            </Grid>
          </Card>
        )}

        {activeTab === 1 && (
          <Card sx={{ p: 6, boxShadow: '0 4px 16px rgba(0,0,0,0.08)', mx: 'auto' }}>
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <img
                    src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&h=400&fit=crop"
                    alt="Vision"
                    style={{ width: '100%', maxWidth: '500px', borderRadius: '12px', boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <Visibility sx={{ fontSize: 48, color: '#1976D2' }} />
                  <Typography variant="h3" sx={{ fontWeight: 700 }}>
                    Our Vision
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8, fontSize: '16px' }}>
                  A world where disability is not a barrier but a unique perspective that enriches society. 
                  We envision an inclusive future where every PWD individual has equal opportunities to thrive, 
                  contribute, and live with dignity.
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.8, fontSize: '16px' }}>
                  By 2030, we aim to become India's largest platform for PWD empowerment, touching millions 
                  of lives and setting global standards for inclusive technology.
                </Typography>
              </Grid>
            </Grid>
          </Card>
        )}

        {activeTab === 2 && (
          <Card sx={{ p: 6, boxShadow: '0 4px 16px rgba(0,0,0,0.08)', mx: 'auto' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4, justifyContent: 'center' }}>
              <EmojiObjects sx={{ fontSize: 48, color: '#2196F3' }} />
              <Typography variant="h3" sx={{ fontWeight: 700 }}>
                Our Values
              </Typography>
            </Box>
            <Grid container spacing={3} justifyContent="center">
              {values.map((value, index) => (
                <Grid item xs={12} md={6} key={index} sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Card
                    sx={{
                      p: 3,
                      width: '100%',
                      maxWidth: '450px',
                      background: 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)',
                      boxShadow: 'none',
                      transition: 'all 0.3s ease',
                      '&:hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.1)' },
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                      {value.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {value.desc}
                    </Typography>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Card>
        )}
      </Container>

      {/* Features Section */}
      <Box sx={{ 
        background: 'linear-gradient(180deg, #ffffff 0%, #E3F2FD 50%, #ffffff 100%)',
        py: 10 
      }}>
        <Container maxWidth="lg">
          <Typography variant="h3" align="center" sx={{ fontWeight: 700, mb: 2 }}>
            What We Offer
          </Typography>
          <Typography variant="h6" align="center" color="text.secondary" sx={{ mb: 6 }}>
            Comprehensive solutions for the PWD community
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card
                  sx={{
                    p: 3,
                    height: '100%',
                    textAlign: 'center',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 64,
                      height: 64,
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, #4285F4 0%, #1565C0 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 2,
                    }}
                  >
                    <feature.icon sx={{ fontSize: 32, color: 'white' }} />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Timeline Section */}
      <Container maxWidth="md" sx={{ py: 10 }}>
        <Typography variant="h3" align="center" sx={{ 
          fontWeight: 700, 
          mb: 2,
          background: 'linear-gradient(135deg, #4285F4 0%, #1565C0 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          Our Journey
        </Typography>
        <Typography variant="h6" align="center" color="text.secondary" sx={{ mb: 6 }}>
          Milestones that shaped our impact
        </Typography>
        <Box>
          {milestones.map((milestone, index) => (
            <Card
              key={index}
              sx={{
                p: 3,
                mb: 3,
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                transition: 'all 0.3s ease',
                '&:hover': { boxShadow: '0 6px 16px rgba(0,0,0,0.15)' },
              }}
            >
              <Typography variant="h6" sx={{ color: '#4285F4', fontWeight: 600, mb: 1 }}>
                {milestone.year}
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                {milestone.event}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {milestone.description}
              </Typography>
            </Card>
          ))}
        </Box>
      </Container>

      {/* Team Section - UPDATED */}
      <Box sx={{ 
        background: 'linear-gradient(180deg, #ffffff 0%, #E3F2FD 50%, #ffffff 100%)',
        py: 10 
      }}>
        <Container maxWidth="lg">
          <Typography variant="h3" align="center" sx={{ 
            fontWeight: 700, 
            mb: 2,
            background: 'linear-gradient(135deg, #4285F4 0%, #1565C0 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Meet Our Team
          </Typography>
          <Typography variant="h6" align="center" color="text.secondary" sx={{ mb: 6 }}>
            Passionate individuals driving change
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            {team.map((member, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    overflow: 'hidden',
                    borderRadius: '16px',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    background: 'white',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    '&:hover': {
                      transform: 'translateY(-12px)',
                      boxShadow: '0 12px 28px rgba(66, 133, 244, 0.25)',
                    },
                  }}
                >
                  <Box sx={{ position: 'relative', overflow: 'hidden', height: 280 }}>
                    <img
                      src={member.image}
                      alt={member.name}
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover',
                        transition: 'transform 0.4s ease'
                      }}
                    />
                  </Box>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5, color: '#263238' }}>
                      {member.name}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: '#4285F4', 
                        fontWeight: 700, 
                        mb: 1.5,
                        textTransform: 'uppercase',
                        fontSize: '12px',
                        letterSpacing: '0.5px'
                      }}
                    >
                      {member.role}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      sx={{ 
                        fontSize: '14px',
                        lineHeight: 1.6
                      }}
                    >
                      {member.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #4285F4 0%, #1565C0 100%)',
          color: 'white',
          py: 10,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
            Join Us in Making a Difference
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.95, mb: 4 }}>
            Whether you're a PWD individual seeking opportunities or a donor wanting to make an impact
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.95)',
                color: '#e3eeffff',
                px: 4,
                py: 1.5,
                fontWeight: 600,
                textTransform: 'none',
                '&:hover': { bgcolor: 'rgba(255, 255, 255, 1)' },
              }}
              onClick={() => navigate('/donor/register')}
            >
              Get Started
            </Button>
            <Button
              variant="outlined"
              size="large"
              sx={{
                borderColor: 'white',
                color: 'white',
                px: 4,
                py: 1.5,
                fontWeight: 600,
                textTransform: 'none',
                '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' },
              }}
            >
              Contact Us
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Footer */}
      <Box component="footer" sx={{ bgcolor: '#263238', color: 'white', py: 6 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 2 }}>
                <MailOutline />
                <Typography variant="body2">support@divyangsetu.org</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 2 }}>
                <Phone />
                <Typography variant="body2">+91 1800-XXX-XXXX</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 2 }}>
                <LocationOn />
                <Typography variant="body2">Mumbai, Maharashtra, India</Typography>
              </Box>
            </Grid>
          </Grid>
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <IconButton sx={{ color: 'white' }}>
              <LinkedIn />
            </IconButton>
            <IconButton sx={{ color: 'white' }}>
              <Twitter />
            </IconButton>
            <IconButton sx={{ color: 'white' }}>
              <Facebook />
            </IconButton>
            <IconButton sx={{ color: 'white' }}>
              <Instagram />
            </IconButton>
          </Box>
          <Typography variant="body2" align="center" sx={{ mt: 3, opacity: 0.8 }}>
            © {new Date().getFullYear()} DivyangSetu. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default AboutPage;