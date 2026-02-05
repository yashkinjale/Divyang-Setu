import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  AppBar,
  Toolbar,
  Link,
  IconButton,
  TextField,
  InputAdornment
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';
import WorkIcon from '@mui/icons-material/Work';
import PeopleIcon from '@mui/icons-material/People';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';

const Navbar = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navItems = [
    { label: 'Job Postings', path: '/job-postings' },
    { label: 'About Us', path: '/about' },
    { label: 'Contact Us', path: '/contact' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    document.addEventListener('scroll', handleScroll);
    return () => {
      document.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  return (
    <AppBar
      position="sticky"
      color="default"
      elevation={0}
      sx={{
        bgcolor: scrolled ? 'rgba(255, 255, 255, 0.7)' : 'transparent',
        backdropFilter: scrolled ? 'blur(15px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(0, 0, 0, 0.05)' : 'none',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: scrolled ? '0 4px 20px rgba(0,0,0,0.05)' : 'none',
        position: 'fixed',
        top: 0,
        zIndex: 1100,
      }}
    >
      <Container maxWidth="lg">
        <Toolbar sx={{ padding: '8px 0 !important', justifyContent: 'space-between' }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              cursor: 'pointer',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'scale(1.02)',
              },
            }}
            onClick={() => navigate('/')}
          >
            <img
              src={require('./Disabled.jpg')}
              alt="DivyangSetu Logo"
              style={{
                height: 50,
                width: 50,
                borderRadius: '50%',
                objectFit: 'cover',
                boxShadow: scrolled ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
              }}
            />
            <Typography
              variant="h5"
              component="div"
              sx={{
                background: 'linear-gradient(45deg, #4285F4 0%, #34A853 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 800,
                letterSpacing: '-0.5px',
                display: { xs: 'none', md: 'block' },
                fontSize: scrolled ? '1.3rem' : '1.5rem',
              }}
            >
              DivyangSetu
            </Typography>
          </Box>



          {/* Mobile Menu Button */}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ display: { md: 'none' }, color: scrolled ? '#1a1a1a' : '#1a1a1a' }} // Ensure visibility
          >
            <MenuIcon />
          </IconButton>

          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
            {navItems.map((link) => (
              <Button
                key={link.label}
                variant="text"
                sx={{
                  color: scrolled ? '#1a1a1a' : 'white',
                  textTransform: 'none',
                  fontSize: '15px',
                  fontWeight: 600,
                  px: 2,
                  position: 'relative',
                  '&:hover': {
                    color: 'primary.main',
                    backgroundColor: 'transparent',
                    '&::after': {
                      width: '70%',
                    }
                  },
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: 6,
                    left: '15%',
                    width: '0%',
                    height: '2px',
                    bgcolor: 'primary.main',
                    transition: 'width 0.3s ease',
                  }
                }}
                onClick={() => navigate(link.path)}
              >
                {link.label}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </Container>
    </AppBar >
  );
};

const TestimonialCard = ({ name, role, content, image, reverse = false }) => {
  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: {
          xs: 'column',
          md: reverse ? 'row-reverse' : 'row',
        },
        borderRadius: '22px',
        overflow: 'hidden',
        boxShadow: '0 18px 45px rgba(0,0,0,0.12)',
        border: '1px solid rgba(0,0,0,0.06)',
      }}
    >
      <Box
        component="img"
        src={image}
        alt={name}
        sx={{
          width: { xs: '100%', md: '50%' },
          height: { xs: 260, md: 320 },
          objectFit: 'cover',
        }}
      />
      <CardContent
        sx={{
          flex: 1,
          p: { xs: 3.5, md: 5 },
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <Typography
          variant="h4"
          sx={{ fontWeight: 800, mb: 1.5, color: '#1a1a1a', letterSpacing: '-0.8px' }}
        >
          {name}
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{
            mb: 2.5,
            color: 'text.secondary',
            fontWeight: 600,
            letterSpacing: '0.02em',
          }}
        >
          {role}
        </Typography>
        <Typography
          variant="body1"
          sx={{
            lineHeight: 1.85,
            color: '#444',
            fontSize: '1rem',
          }}
        >
          {content}
        </Typography>
      </CardContent>
    </Card>
  );
};

const LandingPage = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [serviceSlide, setServiceSlide] = useState(0);
  const [searchQuery, setSearchQuery] = useState(''); // ⭐ NEW: Added search state

  const backgroundImages = [
    'https://media.istockphoto.com/id/486895162/photo/composite-image-of-cute-disabled-pupil.jpg?s=612x612&w=0&k=20&c=Bst_86KHTmo7HY_-uo20jpnsMQ-wmaeCyISZidpXqG4=',
    'https://wecapable.com/wp-content/uploads/2017/05/stephen-hawking-wecapable.jpg',
    'https://images.unsplash.com/photo-1584515933487-779824d29309?w=1920&q=80',
    'https://images.unsplash.com/photo-1576765608866-5b51046452be?w=1920&q=80',
    'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=1920&q=80',
    'https://media.istockphoto.com/id/1533346592/photo/a-disabled-person-in-a-wheelchair-with-a-friend-on-summer-vacation-having-fun-laughing-a-lot.jpg?s=612x612&w=0&k=20&c=q1hbzmdGjnWuivgSjxhPX0XhL3hp7k48X0CSQpefUak=',
    'https://d1nslcd7m2225b.cloudfront.net/Pictures/1024x536/4/9/1/1363491_criptales_589981.jpg',
    'https://t4.ftcdn.net/jpg/05/11/10/13/360_F_511101375_7vjfaOLPn3KOt754vFGNFlcXZDdrzigX.jpg'
  ];

  const services = [
    {
      icon: AccountBalanceIcon,
      title: "Government Schemes",
      description: "Access information and apply for various government schemes and benefits.",
      gradientBg: 'rgba(0, 0, 0, 0.02)', // Off-white/Transparent grey
      iconColor: '#9C27B0', // Purple
      redirect: '/disabled/login',
    },
    {
      icon: EmojiObjectsIcon,
      title: "Job Recommendation",
      description: "Get personalized job recommendations based on your skills and preferences.",
      gradientBg: 'rgba(0, 0, 0, 0.02)',
      iconColor: '#FF4081', // Pink
      redirect: '/disabled/login',
    },
    {
      icon: WorkIcon,
      title: "Job Postings",
      description: "Browse and apply for jobs from inclusive employers looking for diverse talent.",
      gradientBg: 'rgba(0, 0, 0, 0.02)',
      iconColor: '#1976D2', // Blue
      redirect: '/donor/login',
    },
    {
      icon: PeopleIcon,
      title: "Community Forum",
      description: "Connect with peers, share experiences, and find support in a safe space.",
      gradientBg: 'rgba(0, 0, 0, 0.02)',
      iconColor: '#388E3C', // Green
      redirect: '/disabled/login',
    },
    {
      icon: VolunteerActivismIcon,
      title: "Donate",
      description: "Make a meaningful contribution and support differently-abled individuals in need.",
      gradientBg: 'rgba(0, 0, 0, 0.02)',
      iconColor: '#D32F2F', // Red
      redirect: '/donor/register',
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % backgroundImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [backgroundImages.length]);

  // Auto-slide for services section with smooth transition
  useEffect(() => {
    const serviceInterval = setInterval(() => {
      setServiceSlide((prev) => prev + 1);
    }, 3000);
    return () => clearInterval(serviceInterval);
  }, []);

  const nextServiceSlide = () => {
    setServiceSlide((prev) => prev + 1);
  };

  const prevServiceSlide = () => {
    setServiceSlide((prev) => prev - 1);
  };

  // Create infinite loop of services
  const getInfiniteServices = () => {
    const infiniteServices = [];
    // Create 3 copies for smooth infinite scroll
    for (let i = 0; i < 3; i++) {
      infiniteServices.push(...services);
    }
    return infiniteServices;
  };

  // ⭐ NEW: Search handler function
  const handleSearch = (e) => {
    e.preventDefault();
    const query = searchQuery.toLowerCase().trim();

    if (!query) return;

    // Search mappings for different keywords
    const searchMappings = {
      // PWD/Disabled related
      'pwd': '/disabled/login',
      'disabled': '/disabled/login',
      'disability': '/disabled/login',
      'divyang': '/disabled/login',
      'differently abled': '/disabled/login',
      'specially abled': '/disabled/login',

      // Pages
      'about': '/about',
      'about us': '/about',
      'contact': '/contact',
      'contact us': '/contact',

      // Services
      'job': '/job-postings',
      'jobs': '/job-postings',
      'job posting': '/job-postings',
      'job postings': '/job-postings',
      'employment': '/job-postings',
      'career': '/job-postings',
      'work': '/job-postings',

      'donate': '/donor/register',
      'donation': '/donor/register',
      'donor': '/donor/register',
      'contribute': '/donor/register',
      'charity': '/donor/register',

      'scheme': '/disabled/login',
      'schemes': '/disabled/login',
      'government scheme': '/disabled/login',
      'government schemes': '/disabled/login',
      'benefits': '/disabled/login',

      'community': '/disabled/login',
      'forum': '/disabled/login',
      'community forum': '/disabled/login',

      'recommendation': '/disabled/login',
      'job recommendation': '/disabled/login',
    };

    // Check for exact matches first
    if (searchMappings[query]) {
      navigate(searchMappings[query]);
      setSearchQuery('');
      return;
    }

    // Check for partial matches
    for (const [key, path] of Object.entries(searchMappings)) {
      if (query.includes(key) || key.includes(query)) {
        navigate(path);
        setSearchQuery('');
        return;
      }
    }

    // If no match found, show alert
    alert(`No results found for "${searchQuery}". Try searching for: jobs, donate, about, contact, pwd, schemes, or community`);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#fafafa' }}>
      <Navbar />

      {/* Hero Section with Carousel */}
      <Box
        sx={{
          position: 'relative',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        {/* Background Images Carousel */}
        {backgroundImages.map((image, index) => (
          <Box
            key={index}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundImage: `url(${image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: currentSlide === index ? 1 : 0,
              transition: 'opacity 1.5s ease-in-out',
              zIndex: 0,
            }}
          />
        ))}

        {/* Overlay */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, rgba(25, 47, 89, 0.6) 0%, rgba(66, 133, 244, 0.5) 100%)',
            zIndex: 1,
          }}
        />

        {/* Content */}
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 2 }}>
          <Box textAlign="center">


            {/* Title */}
            <Typography
              variant="h2"
              component="h1"
              sx={{
                color: 'white',
                fontWeight: 700,
                mb: 2,
                fontSize: { xs: '2.5rem', md: '4rem' },
                textShadow: '0 2px 10px rgba(0,0,0,0.3)',
                animation: 'fadeInUp 1s ease-out',
                '@keyframes fadeInUp': {
                  from: {
                    opacity: 0,
                    transform: 'translateY(30px)',
                  },
                  to: {
                    opacity: 1,
                    transform: 'translateY(0)',
                  },
                },
                '@keyframes fadeIn': {
                  from: { opacity: 0 },
                  to: { opacity: 1 },
                },
              }}
            >
              DivyangSetu
            </Typography>

            {/* Description */}
            <Typography
              variant="h5"
              sx={{
                color: 'white',
                opacity: 0.95,
                maxWidth: '600px',
                mx: 'auto',
                mb: 5,
                fontWeight: 400,
                fontSize: { xs: '1.1rem', md: '1.3rem' },
                textShadow: '0 2px 8px rgba(0,0,0,0.3)',
                animation: 'fadeInUp 1s ease-out 0.3s both',
              }}
            >
              Bridging the gap between donors and differently-abled individuals
            </Typography>

            {/* ⭐ UPDATED: Professional Search Bar */}
            <Box
              component="form"
              onSubmit={handleSearch}
              sx={{
                display: 'flex',
                maxWidth: '750px',
                mx: 'auto',
                gap: 0,
                boxShadow: '0 15px 35px rgba(0,0,0,0.2)',
                borderRadius: '50px', // Rounder for modern look
                overflow: 'hidden',
                animation: 'fadeInUp 1s ease-out 0.6s both',
                backdropFilter: 'blur(10px)',
                background: 'rgba(255, 255, 255, 0.15)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
              }}
            >
              <TextField
                fullWidth
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for services, schemes, jobs..."
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.95)',
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '50px 0 0 50px',
                    '& fieldset': {
                      border: 'none',
                    },
                    '& input': {
                      padding: '20px 30px',
                      fontSize: '17px',
                    },
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: '#4285F4', fontSize: 26, ml: 2 }} />
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                type="submit"
                variant="contained"
                sx={{
                  minWidth: 160,
                  borderRadius: '0 50px 50px 0',
                  bgcolor: '#4285F4',
                  color: 'white',
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '18px',
                  px: 5,
                  '&:hover': {
                    bgcolor: '#3367d6',
                  },
                }}
              >
                Search
              </Button>
            </Box>
          </Box>
        </Container>

        {/* Slide Indicators */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 30,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 1.5,
            zIndex: 2,
          }}
        >
          {backgroundImages.map((_, index) => (
            <Box
              key={index}
              onClick={() => setCurrentSlide(index)}
              sx={{
                width: currentSlide === index ? 40 : 12,
                height: 12,
                borderRadius: 6,
                bgcolor: 'white',
                opacity: currentSlide === index ? 1 : 0.5,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  opacity: 0.8,
                },
              }}
            />
          ))}
        </Box>
      </Box>

      {/* User Type Selection with Dancing Cards */}
      <Container
        maxWidth="lg"
        sx={{
          py: 13,
          mt: 5, // extra gap below the hero section
        }}
      >
        <Grid
          container
          spacing={6}
          justifyContent="center"
          alignItems="stretch"
        >
          {[
            {
              emoji: '👩‍🦽',
              title: 'I am Differently-Abled',
              desc: 'Empower yourself by connecting with a community of donors and inclusive employers built specifically for you.',
              register: '/disabled/register',
              login: '/disabled/login',
              delay: '0s',
            },
            {
              emoji: '🤝',
              title: 'I am a Donor',
              desc: 'Make a direct impact. Your support provides essential aid and transforms lives in the differently-abled community.',
              register: '/donor/register',
              login: '/donor/login',
              delay: '0.2s',
            },
          ].map((user, idx) => (
            <Grid
              item
              xs={12}
              sm={10}
              md={6}
              lg={5}
              key={idx}
              sx={{
                display: "flex",
                justifyContent: idx === 0 ? "flex-end" : "flex-start",
              }}
            >
              <Box
                sx={{
                  animation: `float 6s ease-in-out infinite`,
                  animationDelay: user.delay,
                  '@keyframes float': {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-20px)' },
                  },
                  height: '100%',
                  maxWidth: 500, // a bit wider
                }}
              >
                <Card
                  sx={{
                    borderRadius: '24px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                    height: '100%',
                    transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                    cursor: 'pointer',
                    background: 'white',
                    border: '1px solid rgba(0,0,0,0.03)',
                    position: 'relative',
                    overflow: 'hidden',
                    '&:hover': {
                      boxShadow: '0 30px 60px rgba(0,0,0,0.12)',
                      transform: 'scale(1.02)',
                      borderColor: 'primary.light',
                      '& .card-gradient': {
                        opacity: 0.05,
                      }
                    },
                  }}
                >
                  {/* Decorative background gradient on hover */}
                  <Box
                    className="card-gradient"
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      background: 'linear-gradient(135deg, #4285F4 0%, #34A853 100%)',
                      opacity: 0,
                      transition: 'opacity 0.5s ease',
                      pointerEvents: 'none',
                    }}
                  />

                  <CardContent
                    sx={{
                      textAlign: 'center',
                      p: 2.5, // less vertical padding
                      position: 'relative',
                      zIndex: 1,
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <Box
                      sx={{
                        fontSize: '56px', // slightly smaller
                        mb: 2.5, // less vertical space
                        filter: 'drop-shadow(0 10px 10px rgba(0,0,0,0.1))',
                        transition: 'transform 0.5s ease',
                        '&:hover': { transform: 'rotate(10deg) scale(1.1)' }
                      }}
                    >
                      {user.emoji}
                    </Box>
                    <Typography
                      variant="h4"
                      gutterBottom
                      sx={{
                        fontWeight: 800,
                        mb: 3,
                        color: '#1a1a1a',
                        letterSpacing: '-1px'
                      }}
                    >
                      {user.title}
                    </Typography>
                    <Typography
                      paragraph
                      sx={{
                        fontSize: '15px',
                        mb: 3.5,
                        lineHeight: 1.5,
                        color: 'text.secondary',
                        maxWidth: '100%',
                        mx: 'auto'
                      }}
                    >
                      {user.desc}
                    </Typography>
                    <Box sx={{ mt: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Button
                        variant="contained"
                        size="large"
                        onClick={() => navigate(user.register)}
                        sx={{
                          borderRadius: '12px',
                          py: 2,
                          textTransform: 'none',
                          fontWeight: 700,
                          fontSize: '16px',
                          background: 'linear-gradient(45deg, #63a4ff 0%, #1976d2 100%)', // lighter blue
                          boxShadow: '0 3px 10px rgba(25, 118, 210, 0.25)',
                          '&:hover': {
                            background: 'linear-gradient(45deg, #5393ff 0%, #1565c0 100%)',
                            boxShadow: '0 6px 18px rgba(25, 118, 210, 0.35)',
                            transform: 'translateY(-2px)',
                          },
                        }}
                      >
                        Create an Account
                      </Button>
                      <Button
                        variant="outlined"
                        size="large"
                        onClick={() => navigate(user.login)}
                        sx={{
                          borderRadius: '12px',
                          py: 2,
                          textTransform: 'none',
                          fontWeight: 700,
                          fontSize: '16px',
                          borderWidth: '2px',
                          borderColor: '#e0e0e0',
                          color: '#444',
                          '&:hover': {
                            borderWidth: '2px',
                            borderColor: '#4285F4',
                            backgroundColor: 'rgba(66, 133, 244, 0.04)',
                            color: '#4285F4',
                          },
                        }}
                      >
                        Sign In
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Blue Divider */}
      <Box
        sx={{
          width: '80px',
          height: '5px',
          bgcolor: 'primary.main',
          borderRadius: '10px',
          mx: 'auto',
          mt: 4, // Reduced gap from top boxes
          mb: 6,
          boxShadow: '0 2px 10px rgba(66, 133, 244, 0.3)',
        }}
      />

      {/* Services Section with Hero Slider */}
      <Container maxWidth="xl" sx={{ py: 10, position: 'relative' }}>
        <Typography
          variant="h3"
          align="center"
          gutterBottom
          sx={{ fontWeight: 700, mb: 2 }}
        >
          Explore Our Services
        </Typography>
        <Typography
          variant="h6"
          align="center"
          color="text.secondary"
          sx={{ mb: 8, maxWidth: '700px', mx: 'auto' }}
        >
          Discover the resources and support systems available to empower our community.
        </Typography>

        <Box sx={{ position: 'relative', overflow: 'hidden' }}>
          {/* Previous Button */}
          <IconButton
            onClick={prevServiceSlide}
            sx={{
              position: 'absolute',
              left: { xs: -10, md: -50 },
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 10,
              bgcolor: 'white',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              '&:hover': {
                bgcolor: '#4285F4',
                color: 'white',
              },
            }}
          >
            <ArrowBackIosNewIcon />
          </IconButton>

          {/* Next Button */}
          <IconButton
            onClick={nextServiceSlide}
            sx={{
              position: 'absolute',
              right: { xs: -10, md: -50 },
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 10,
              bgcolor: 'white',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              '&:hover': {
                bgcolor: '#4285F4',
                color: 'white',
              },
            }}
          >
            <ArrowForwardIosIcon />
          </IconButton>

          <Box
            sx={{
              display: 'flex',
              transition: 'transform 0.5s ease-in-out',
              transform: `translateX(-${(serviceSlide % services.length) * (100 / 4)}%)`,
            }}
            onTransitionEnd={() => {
              // Reset position for infinite scroll
              if (serviceSlide >= services.length) {
                setServiceSlide(0);
              }
            }}
          >
            {getInfiniteServices().map((service, index) => (
              <Box
                key={index}
                sx={{
                  minWidth: { xs: '280px', md: '25%' },
                  px: 1.5,
                }}
              >
                <Card
                  onClick={() => navigate(service.redirect)}
                  sx={{
                    height: '100%',
                    p: 3,
                    borderRadius: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: '280px', // More compact height
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    background: service.gradientBg, // Off-white color
                    border: '1px solid rgba(0,0,0,0.08)', // Defined border
                    boxShadow: '0 4px 20px rgba(0,0,0,0.05)', // Soft shadow
                    '&:hover': {
                      transform: 'translateY(-8px) scale(1.02)',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
                      borderColor: service.iconColor,
                    },
                  }}
                >
                  <CardContent sx={{ textAlign: 'center', p: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
                    <Box>
                      <service.icon
                        sx={{
                          fontSize: 56, // Slightly smaller icon
                          mb: 1.5,
                          color: service.iconColor, // Dynamic color
                          transition: 'all 0.4s ease',
                          '&:hover': { transform: 'rotate(5deg) scale(1.1)' },
                        }}
                      />
                      <Typography
                        variant="h6"
                        gutterBottom
                        component="div"
                        sx={{
                          fontWeight: 700,
                          mb: 2,
                          color: '#333',
                        }}
                      >
                        {service.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ mb: 3, opacity: 0.8, lineHeight: 1.6, color: '#555' }}
                      >
                        {service.description}
                      </Typography>
                    </Box>
                    <Button
                      variant="outlined"
                      sx={{
                        mt: 2,
                        borderRadius: '8px',
                        borderColor: service.iconColor,
                        color: service.iconColor,
                        textTransform: 'none',
                        fontWeight: 700,
                        px: 3,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          bgcolor: service.iconColor,
                          color: 'white',
                          borderColor: service.iconColor,
                        },
                      }}
                    >
                      Explore Service
                    </Button>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Box>

          {/* Slider Indicators */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: 1.5,
              mt: 4,
            }}
          >
            {services.map((_, index) => (
              <Box
                key={index}
                onClick={() => setServiceSlide(index)}
                sx={{
                  width: (serviceSlide % services.length) === index ? 30 : 10,
                  height: 10,
                  borderRadius: 5,
                  bgcolor: (serviceSlide % services.length) === index ? '#4285F4' : '#ccc',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    bgcolor: '#4285F4',
                  },
                }}
              />
            ))}
          </Box>
        </Box>
      </Container>

      {/* Section Divider between Services and Success Stories */}
      <Box
        sx={{
          width: '80px',
          height: '5px',
          bgcolor: 'primary.main',
          borderRadius: '10px',
          mx: 'auto',
          mt: 4,
          mb: 6,
          boxShadow: '0 2px 10px rgba(66, 133, 244, 0.3)',
        }}
      />

      {/* Testimonials */}
      <Box sx={{ bgcolor: 'white', py: 10 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" align="center" gutterBottom sx={{ fontWeight: 700, mb: 2 }}>
            Success Stories
          </Typography>
          <Typography variant="h6" align="center" color="text.secondary" sx={{ mb: 8 }}>
            Hear from our community members
          </Typography>
          <Grid container spacing={5} direction="column">
            {/* Story 1: Image left, info right */}
            <Grid item xs={12}>
              <TestimonialCard
                name="Ananya Desai"
                role="Engineering Student • Recipient"
                content="With support from DivyangSetu, I received a lightweight laptop with accessibility tools. Now I can join online lectures, submit projects on time, and study independently without relying on my family every day."
                image="https://media.istockphoto.com/id/1319190867/photo/asian-indian-beautiful-woman-with-disability-using-wheelchair-exploring-downtown-district-in.jpg?s=612x612&w=0&k=20&c=F4APAddtdzQYzClJ4u1mOYd6ncqNdV4mVoYm9bPIbb0="
              />
            </Grid>

            {/* Story 2: Info left, image right */}
            <Grid item xs={12}>
              <TestimonialCard
                name="Rahul Menon"
                role="Young Professional • Recipient"
                content="An adaptive workstation funded through this platform helped me continue my first job after a spinal injury. The customized setup means I can focus on my work instead of struggling with basic tasks."
                image="https://thumbs.dreamstime.com/b/indian-bearded-disabled-handicapped-businessman-sitting-working-laptop-computer-wheelchair-asian-male-female-288447140.jpg"
                reverse
              />
            </Grid>

            {/* Story 3: Image left, info right */}
            <Grid item xs={12}>
              <TestimonialCard
                name="Meera Kulkarni"
                role="Home Entrepreneur • Recipient"
                content="Thanks to the assistive devices and small equipment I received, I was able to start an online craft store from home. DivyangSetu turned my idea into a real source of income for my family."
                image="https://t3.ftcdn.net/jpg/07/40/45/56/360_F_740455685_cCQubv0OcWYzPMotsfsjxTrZN3YFbae8.jpg"
              />
            </Grid>

            {/* Story 4: Info left, image right */}
            <Grid item xs={12}>
              <TestimonialCard
                name="Sahil Verma"
                role="College Graduate • Recipient"
                content="Screen‑reader software, keyboard guards, and a scholarship from DivyangSetu helped me complete my degree on time. The right tools made my campus accessible and opened the door to my first full‑time job."
                image="https://www.shutterstock.com/image-photo/new-delhi-indiasep-1-2019-260nw-2038984052.jpg"
                reverse
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Call to Action */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #28a745 0%, #1e7e34 100%)',
          py: 10,
          color: 'white',
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h3"
            align="center"
            gutterBottom
            sx={{ fontWeight: 700, mb: 2 }}
          >
            Ready to Make a Difference?
          </Typography>
          <Typography
            variant="h6"
            align="center"
            sx={{ mb: 5, opacity: 0.95 }}
          >
            Join our community today and be part of the change
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/donor/register')}
              sx={{
                borderRadius: '6px',
                px: 5,
                py: 1.5,
                background: 'linear-gradient(45deg, #42a5f5, #1e88e5)',
                color: 'white',
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '16px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'linear-gradient(45deg, #1e88e5, #1565c0)',
                  boxShadow: '0 6px 16px rgba(0,0,0,0.3)',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              Become a Donor
            </Button>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/disabled/register')}
              sx={{
                borderRadius: '6px',
                px: 5,
                py: 1.5,
                background: 'linear-gradient(45deg, #42a5f5, #1e88e5)',
                color: 'white',
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '16px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'linear-gradient(45deg, #1e88e5, #1565c0)',
                  boxShadow: '0 6px 16px rgba(0,0,0,0.3)',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              Register as Recipient
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Footer */}
      <Box component="footer" sx={{ bgcolor: 'white', py: 8, borderTop: '1px solid #e0e0e0' }}>
        <Container maxWidth="lg">
          <Grid container spacing={6}>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <img
                  src={require('./Disabled.jpg')}
                  alt="DivyangSetu Logo"
                  style={{ height: 50, width: 50, objectFit: 'contain' }}
                />
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#4285F4' }}>
                  DivyangSetu
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '14px', lineHeight: 1.7 }}>
                Bridging the gap between donors and differently-abled individuals through technology and compassion.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, mb: 2 }}>
                Quick Links
              </Typography>
              <Link href="/donor/register" color="text.secondary" display="block" sx={{ mb: 1.5, textDecoration: 'none', fontSize: '14px', '&:hover': { color: 'primary.main' } }}>
                Donate
              </Link>
              <Link href="/disabled/register" color="text.secondary" display="block" sx={{ mb: 1.5, textDecoration: 'none', fontSize: '14px', '&:hover': { color: 'primary.main' } }}>
                Get Help
              </Link>
              <Link
                onClick={() => navigate('/about')}
                color="text.secondary"
                display="block"
                sx={{
                  mb: 1.5,
                  textDecoration: 'none',
                  fontSize: '14px',
                  cursor: 'pointer',
                  '&:hover': { color: 'primary.main' }
                }}
              >
                About Us
              </Link>
              <Link
                onClick={() => navigate('/contact')}
                color="text.secondary"
                display="block"
                sx={{
                  mb: 1.5,
                  textDecoration: 'none',
                  fontSize: '14px',
                  cursor: 'pointer',
                  '&:hover': { color: 'primary.main' }
                }}
              >
                Contact Us
              </Link>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, mb: 2 }}>
                Connect With Us
              </Typography>
              <Box>
                <IconButton color="default" href="#" sx={{ '&:hover': { color: 'primary.main' } }}>
                  <LinkedInIcon />
                </IconButton>
                <IconButton color="default" href="#" sx={{ '&:hover': { color: 'primary.main' } }}>
                  <TwitterIcon />
                </IconButton>
                <IconButton color="default" href="#" sx={{ '&:hover': { color: 'primary.main' } }}>
                  <FacebookIcon />
                </IconButton>
                <IconButton color="default" href="#" sx={{ '&:hover': { color: 'primary.main' } }}>
                  <InstagramIcon />
                </IconButton>
              </Box>
            </Grid>
          </Grid>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 6, fontSize: '13px' }}>
            © {new Date().getFullYear()} DivyangSetu. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;