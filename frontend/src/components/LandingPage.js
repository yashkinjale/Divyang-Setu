import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Grid, 
  Card, 
  CardContent,
  useTheme,
  Fade,
  Grow,
  Avatar,
  IconButton,
  Paper,
  Divider,
  AppBar,
  Toolbar,
  Link
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import HandshakeIcon from '@mui/icons-material/Handshake';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PeopleIcon from '@mui/icons-material/People';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CelebrationIcon from '@mui/icons-material/Celebration';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';

const Navbar = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <AppBar position="sticky" color="default" elevation={1}>
      <Toolbar>
        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
          <Typography
            variant="h6"
            component="div"
            sx={{
              color: theme.palette.primary.main,
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
            onClick={() => navigate('/')}
          >
            <AccessibilityNewIcon />
            DivyangSetu
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 3 }}>
          <Button
            variant="text"
            color="inherit"
            sx={{ 
              '&:hover': { 
                color: theme.palette.primary.main,
                transition: 'color 0.2s'
              }
            }}
            onClick={() => navigate('/job-postings')}
          >
            Job Postings
          </Button>
          <Button
            variant="text"
            color="inherit"
            sx={{ 
              '&:hover': { 
                color: theme.palette.primary.main,
                transition: 'color 0.2s'
              }
            }}
          >
            About Us
          </Button>
          <Button
            variant="text"
            color="inherit"
            sx={{ 
              '&:hover': { 
                color: theme.palette.primary.main,
                transition: 'color 0.2s'
              }
            }}
          >
            Contact Us
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

const FeatureCard = ({ icon: Icon, title, description }) => {
  const theme = useTheme();
  return (
    <Card sx={{ height: '100%', p: 2 }}>
      <CardContent sx={{ textAlign: 'center' }}>
        <Icon sx={{ fontSize: 40, color: theme.palette.primary.main, mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
};

const StatCard = ({ icon: Icon, value, label }) => {
  const theme = useTheme();
  return (
    <Card sx={{ 
      height: '100%', 
      p: 2, 
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <Icon sx={{ fontSize: 40, color: 'white', mb: 2 }} />
      <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', mb: 1, color: 'white' }}>
        {value}
      </Typography>
      <Typography variant="body1" sx={{ color: 'white' }}>
        {label}
      </Typography>
    </Card>
  );
};

const TestimonialCard = ({ name, role, content, avatar }) => {
  return (
    <Card sx={{ height: '100%', p: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box
            sx={{
              width: 56,
              height: 56,
              mr: 2,
              bgcolor: '#87CEFA',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
              {name.charAt(0)}
            </Typography>
          </Box>
          <Box>
            <Typography variant="h6">{name}</Typography>
            <Typography variant="body2" color="text.secondary">{role}</Typography>
          </Box>
        </Box>
        <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
          "{content}"
        </Typography>
      </CardContent>
    </Card>
  );
};

const LandingPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Navbar />
      {/* Hero Section */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          py: { xs: 8, md: 12 },
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
          },
        }}
      >
        <Container maxWidth="lg">
          <Fade in timeout={1000}>
            <Box textAlign="center" mb={8}>
              <Typography
                variant="h2"
                component="h1"
                sx={{
                  color: 'white',
                  fontWeight: 'bold',
                  mb: 2,
                  textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
                }}
              >
                DivyangSetu
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  color: 'white',
                  opacity: 0.9,
                  maxWidth: '600px',
                  mx: 'auto',
                }}
              >
                Bridging the gap between donors and differently-abled individuals
              </Typography>
            </Box>
          </Fade>

          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} md={6}>
              <Grow in timeout={1000}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  <CardContent sx={{ flexGrow: 1, textAlign: 'center', py: 4 }}>
                    <AccessibilityNewIcon
                      sx={{ fontSize: 60, color: theme.palette.primary.main, mb: 2 }}
                    />
                    <Typography variant="h4" component="h2" gutterBottom>
                      I am Differently-Abled
                    </Typography>
                    <Typography color="text.secondary" paragraph>
                      Register to connect with donors and receive the support you need
                    </Typography>
                    <Box sx={{ mt: 3 }}>
                      <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        onClick={() => navigate('/disabled/register')}
                        sx={{ mr: 2 }}
                      >
                        Register
                      </Button>
                      <Button
                        variant="outlined"
                        color="primary"
                        size="large"
                        onClick={() => navigate('/disabled/login')}
                      >
                        Login
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grow>
            </Grid>

            <Grid item xs={12} md={6}>
              <Grow in timeout={1500}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  <CardContent sx={{ flexGrow: 1, textAlign: 'center', py: 4 }}>
                    <VolunteerActivismIcon
                      sx={{ fontSize: 60, color: theme.palette.secondary.main, mb: 2 }}
                    />
                    <Typography variant="h4" component="h2" gutterBottom>
                      I want to Donate
                    </Typography>
                    <Typography color="text.secondary" paragraph>
                      Join our community of donors and make a difference in someone's life
                    </Typography>
                    <Box sx={{ mt: 3 }}>
                      <Button
                        variant="contained"
                        color="secondary"
                        size="large"
                        onClick={() => navigate('/donor/register')}
                        sx={{ mr: 2 }}
                      >
                        Register
                      </Button>
                      <Button
                        variant="outlined"
                        color="secondary"
                        size="large"
                        onClick={() => navigate('/donor/login')}
                      >
                        Login
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grow>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" align="center" gutterBottom>
          Why Choose DivyangSetu?
        </Typography>
        <Typography variant="h6" align="center" color="text.secondary" sx={{ mb: 6 }}>
          Making a difference, one connection at a time
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <FeatureCard
              icon={HandshakeIcon}
              title="Direct Connection"
              description="Connect directly with donors and recipients, ensuring transparency and trust"
            />
          </Grid>
          {/* <Grid item xs={12} sm={6} md={4}>
            <FeatureCard
              icon={EmojiObjectsIcon}
              title="Smart Matching"
              description="Our intelligent system matches donors with recipients based on needs and preferences"
            />
          </Grid> */}
          <Grid item xs={12} sm={6} md={4}>
            <FeatureCard
              icon={FavoriteIcon}
              title="Community Support"
              description="Join a supportive community dedicated to making a positive impact"
            />
          </Grid>
        </Grid>
      </Container>

      {/* Statistics Section */}
      <Box sx={{ bgcolor: 'primary.main', py: 8, color: 'white' }}>
        <Container maxWidth="lg">
          <Typography variant="h3" align="center" gutterBottom sx={{ mb: 6 }}>
            Our Impact
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} sm={4} sx={{ display: 'flex', justifyContent: 'center' }}>
              <StatCard
                icon={PeopleIcon}
                value="10,000+"
                label="Lives Impacted"
              />
            </Grid>
            <Grid item xs={12} sm={4} sx={{ display: 'flex', justifyContent: 'center' }}>
              <StatCard
                icon={AttachMoneyIcon}
                value="₹50L+"
                label="Donations Raised"
              />
            </Grid>
            <Grid item xs={12} sm={4} sx={{ display: 'flex', justifyContent: 'center' }}>
              <StatCard
                icon={CelebrationIcon}
                value="500+"
                label="Success Stories"
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" align="center" gutterBottom>
          Success Stories
        </Typography>
        <Typography variant="h6" align="center" color="text.secondary" sx={{ mb: 6 }}>
          Hear from our community members
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <TestimonialCard
              name="Priya Sharma"
              role="Recipient"
              content="DivyangSetu helped me get the wheelchair I needed. The platform made it easy to connect with kind donors who understood my needs."
              avatar="https://i.pravatar.cc/150?img=1"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TestimonialCard
              name="Rajesh Patel"
              role="Donor"
              content="I'm proud to be part of this community. The transparency and direct connection with recipients make the donation process meaningful."
              avatar="https://i.pravatar.cc/150?img=2"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TestimonialCard
              name="Anita Desai"
              role="Recipient"
              content="Thanks to DivyangSetu, I received the hearing aids I needed. The support from donors has been life-changing."
              avatar="https://i.pravatar.cc/150?img=3"
            />
          </Grid>
        </Grid>
      </Container>

      {/* Call to Action Section */}
      <Box sx={{ bgcolor: 'secondary.main', py: 8, color: 'white' }}>
        <Container maxWidth="md">
          <Typography variant="h3" align="center" gutterBottom>
            Ready to Make a Difference?
          </Typography>
          <Typography variant="h6" align="center" sx={{ mb: 4, opacity: 0.9 }}>
            Join our community today and be part of the change
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => navigate('/donor/register')}
              sx={{ bgcolor: 'white', color: 'secondary.main', '&:hover': { bgcolor: 'grey.100' } }}
            >
              Become a Donor
            </Button>
            <Button
              variant="outlined"
              color="inherit"
              size="large"
              onClick={() => navigate('/disabled/register')}
              sx={{ borderColor: 'white', color: 'white', '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' } }}
            >
              Register as Recipient
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Footer */}
      <Box component="footer" sx={{ bgcolor: 'background.paper', py: 6 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>
                DivyangSetu
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Bridging the gap between donors and differently-abled individuals through technology and compassion.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>
                Quick Links
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button color="inherit" onClick={() => navigate('/donor/register')}>Donate</Button>
                <Button color="inherit" onClick={() => navigate('/disabled/register')}>Get Help</Button>
                <Button color="inherit">About Us</Button>
                <Button color="inherit">Contact</Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>
                Connect With Us
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <IconButton color="primary"><LinkedInIcon /></IconButton>
                <IconButton color="primary"><TwitterIcon /></IconButton>
                <IconButton color="primary"><FacebookIcon /></IconButton>
                <IconButton color="primary"><InstagramIcon /></IconButton>
              </Box>
            </Grid>
          </Grid>
          <Divider sx={{ my: 4 }} />
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} DivyangSetu. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage; 