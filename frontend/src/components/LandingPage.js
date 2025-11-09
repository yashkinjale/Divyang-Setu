import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  useTheme,
  Avatar,
  AppBar,
  Toolbar,
  Link,
  IconButton
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';
import WorkIcon from '@mui/icons-material/Work';
import PeopleIcon from '@mui/icons-material/People';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';

const Navbar = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    document.addEventListener("scroll", handleScroll);
    return () => {
      document.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  return (
    <AppBar
      position="sticky"
      color="default"
      elevation={0}
      sx={{
        bgcolor: scrolled ? "rgba(255, 255, 255, 0.8)" : "white",
        backdropFilter: scrolled ? "blur(10px)" : "none",
        borderBottom: "1px solid #e0e0e0",
        transition: "background-color 0.3s ease, backdrop-filter 0.3s ease",
        boxShadow: scrolled ? "0 2px 8px rgba(0,0,0,0.1)" : "none",
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          paddingLeft: { xs: 2, md: 3 },
          paddingRight: { xs: 2, md: 3 },
        }}
      >
        <Toolbar
          disableGutters
          sx={{
            padding: "8px 0 !important",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          {/* ✅ Logo + Title aligned on the left */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              cursor: 'pointer',
              marginLeft: '-42px',
              transition: 'all 0.3s ease',
            }}
            onClick={() => navigate("/")}
          >
            <img
              src={require("./Disabled.jpg")}
              alt="DivyangSetu Logo"
              style={{
                height: scrolled ? 60 : 60,
                opacity: scrolled ? 0.3 : 1,
                transition: 'all 0.3s ease',
              }}
            />
            <Typography
              variant="h5"
              component="div"
              sx={{
                color: "#4285F4",
                fontWeight: "bold",
                fontSize: scrolled ? "1.4rem" : "1.6rem",
                transition: "all 0.3s ease",
              }}
            >
              DivyangSetu
            </Typography>
          </Box>

          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 3, marginRight: '-16px' }}>
            <Button
              variant="text"
              sx={{
                color: "text.secondary",
                
                textTransform: "none",
                fontSize: "14px",
                fontWeight: 700,
                "&:hover": {
                  color: "primary.main",
                  backgroundColor: "rgba(66, 133, 244, 0.1)",
                },
              }}
              onClick={() => navigate("/job-postings")}
            >
              Job Postings
            </Button>
            <Button
              variant="text"
              sx={{
                color: "text.secondary",
                textTransform: "none",
                fontSize: "14px",
                fontWeight: 700,
                "&:hover": {
                  color: "primary.main",
                  backgroundColor: "rgba(66, 133, 244, 0.1)",
                },
              }}
              onClick={() => navigate('/about')} // ⬅️ THIS IS THE KEY LINE
            >
              About Us
            </Button>
            <Button
              variant="text"
              sx={{
                color: "text.secondary",
                textTransform: "none",
                fontSize: "14px",
                fontWeight: 700,
                 marginRight: "-114px",
                "&:hover": {
                  color: "primary.main",
                  backgroundColor: "rgba(66, 133, 244, 0.1)",
                 
                },
              }}
              onClick={() => navigate('/contact')} // If you have a contact page
            >
              Contact Us
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};


const ServiceCard = ({ icon: Icon, title, description, color }) => {
  return (
    <Card
      sx={{
        height: '100%',
        p: 3,
        borderRadius: '12px',
        backgroundColor: color,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: '280px'
      }}
    >
      <CardContent sx={{ textAlign: 'center', p: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Icon
          sx={{
            fontSize: 48,
            mb: 2,
            transition: 'transform 0.3s ease',
            '&:hover': { transform: 'rotate(12deg) scale(1.1)' },
          }}
        />
        <Typography
          variant="h6"
          gutterBottom
          component="div"
          sx={{
            fontWeight: 600,
            mb: 2,
            textAlign: 'center',
          }}
        >
          {title}
        </Typography>
        <Typography
          variant="body2"
          sx={{ mb: 3, opacity: 0.9, lineHeight: 1.6, color: '#333', textAlign: 'center' }}
        >
          {description}
        </Typography>
        <Button
          variant="contained"
          disableElevation
          sx={{
            mt: 2,
            borderRadius: '6px',
            bgcolor: color,
            color: 'white',
            textTransform: 'none',
            fontWeight: 600,
            px: 3,
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'scale(1.05)',
              boxShadow: '0 6px 16px rgba(0,0,0,0.25)',
            },
          }}
        >
          Available Now
        </Button>
      </CardContent>
    </Card>
  );
};



const TestimonialCard = ({ name, role, content, initial }) => {
  const getAvatarColor = (name) => {
    const colors = ["#4285F4", "#4caf50", "#ff6b9d", "#9c27b0", "#f9f9f9"];
    return colors[name.length % colors.length];
  };

  return (
    <Card
      sx={{
        height: "100%",
        p: 3,
        borderRadius: "12px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        border: "1px solid #f0f0f0",
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
          borderColor: "transparent",
        },
      }}
    >
      <CardContent sx={{ p: 0 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Avatar
            sx={{
              bgcolor: getAvatarColor(name),
              mr: 2,
              width: 40,
              height: 40,
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "scale(1.2)",
              },
            }}
          >
            {initial}
          </Avatar>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {role}
            </Typography>
          </Box>
        </Box>
        <Typography
          variant="body2"
          sx={{ lineHeight: 1.6, color: "text.secondary" }}
        >
          "{content}"
        </Typography>
      </CardContent>
    </Card>
  );
};

const LandingPage = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [serviceSlide, setServiceSlide] = useState(0);

  const backgroundImages = [
    'https://media.istockphoto.com/id/486895162/photo/composite-image-of-cute-disabled-pupil.jpg?s=612x612&w=0&k=20&c=Bst_86KHTmo7HY_-uo20jpnsMQ-wmaeCyISZidpXqG4=', // Person using wheelchair outdoors
    'https://wecapable.com/wp-content/uploads/2017/05/stephen-hawking-wecapable.jpg', // Person with prosthetic leg
    'https://images.unsplash.com/photo-1584515933487-779824d29309?w=1920&q=80', // Wheelchair sports
    'https://images.unsplash.com/photo-1576765608866-5b51046452be?w=1920&q=80', // Accessible workplace
    'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=1920&q=80', // Inclusive community
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4noUzqkrIfnQXoMKU8wi0m2Hjk2z1dEZThw&s', // Inclusive community
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLrsdXA6gQMrmmjkC6mjanD5yT6F0wQI6D0g&s', // Person with visual impairment
    'https://images.unsplash.com/photo-1609619385002-f40a96e737d8?w=1920&q=80'  // Wheelchair user smiling
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

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#fafafa" }}>
      <Navbar />

      {/* Hero Section */}
      <Box
        sx={{
          position: "relative",
          minHeight: "calc(100vh - 64px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {backgroundImages.map((image, index) => (
          <Box
            key={index}
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundImage: `url(${image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: currentSlide === index ? 1 : 0,
              transition: "opacity 1.5s ease-in-out",
              zIndex: 0,
            }}
          />
        ))}

        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background:
              "linear-gradient(135deg, rgba(25, 47, 89, 0.88) 0%, rgba(66, 133, 244, 0.85) 100%)",
            zIndex: 1,
          }}
        />

        {/* Content */}
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 2 }}>
          <Box textAlign="center">
            <Typography
              variant="h2"
              component="h1"
              sx={{
                color: "white",
                fontWeight: 700,
                mb: 3,
                fontSize: { xs: "2.5rem", md: "4rem" },
                textShadow: "0 2px 10px rgba(0,0,0,0.3)",
                animation: "fadeInUp 1s ease-out",
                "@keyframes fadeInUp": {
                  from: {
                    opacity: 0,
                    transform: "translateY(30px)",
                  },
                  to: {
                    opacity: 1,
                    transform: "translateY(0)",
                  },
                },
              }}
            >
              DivyangSetu
            </Typography>
            <Typography
              variant="h5"
              sx={{
                color: "white",
                opacity: 0.95,
                maxWidth: "600px",
                mx: "auto",
                fontWeight: 400,
                fontSize: { xs: "1.1rem", md: "1.3rem" },
                textShadow: "0 2px 8px rgba(0,0,0,0.3)",
                animation: "fadeInUp 1s ease-out 0.3s both",
              }}
            >
              Bridging the gap between donors and differently-abled individuals
            </Typography>
          </Box>
        </Container>

        <Box
          sx={{
            position: "absolute",
            bottom: 30,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
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
                bgcolor: "white",
                opacity: currentSlide === index ? 1 : 0.5,
                cursor: "pointer",
                transition: "all 0.3s ease",
                "&:hover": {
                  opacity: 0.8,
                },
              }}
            />
          ))}
        </Box>
      </Box>

{/* User Type Selection */}
<Container maxWidth="lg" sx={{ py: 12 }}>
  <Grid container spacing={6} justifyContent="center">
    {[
      {
        emoji: '👩‍🦽',
        title: 'I am Differently-Abled',
        desc: 'Register to connect with donors and receive the support you need',
        register: '/disabled/register',
        login: '/disabled/login',
      },
      {
        emoji: '🤲💚',
        title: 'I am a Donor',
        desc: 'Support individuals by providing aid and making a difference.',
        register: '/donor/register',
        login: '/donor/login',
      },
    ].map((user, idx) => (
      <Grid item xs={12} md={5} key={idx}>
        <Card
          sx={{
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            height: '100%',
            transition: 'all 0.3s ease',
            cursor: 'pointer',
            background: 'linear-gradient(135deg, #fdfdfd, #f5f5f5)', // off-white gradient
            '&:hover': {
              boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
              transform: 'translateY(-5px)',
              background: 'linear-gradient(135deg, #f9f9f9, #eeeeee)', // slightly darker on hover
            },
          }}
        >
          <CardContent sx={{ textAlign: 'center', p: 5 }}>
            <Box sx={{ fontSize: '72px', mb: 3 }}>{user.emoji}</Box>
            <Typography
              variant="h5"
              component="h2"
              gutterBottom
              sx={{
                fontWeight: 600,
                mb: 2,
                color: '#333',
              }}
            >
              {user.title}
            </Typography>
            <Typography paragraph sx={{ fontSize: '15px', mb: 4, lineHeight: 1.6, color: '#555' }}>
              {user.desc}
            </Typography>
            <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate(user.register)}
                sx={{
                  borderRadius: '6px',
                  px: 4,
                  py: 1.5,
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '15px',
                  boxShadow: 'none',
                  background: '#4285F4',
                  color: 'white',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                    transform: 'translateY(-2px)',
                    background: '#1976d2',
                  },
                }}
              >
                Register
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate(user.login)}
                sx={{
                  borderRadius: '6px',
                  px: 4,
                  py: 1.5,
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '15px',
                  borderWidth: '2px',
                  borderColor: '#ccc',
                  color: '#333',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderWidth: '2px',
                    backgroundColor: '#f0f0f0',
                  },
                }}
              >
                Login
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    ))}
  </Grid>
</Container>




{/* Services Section */}
<Container maxWidth="xl" sx={{ py: 10 }}>
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
  <Grid
    container
    spacing={3}
    sx={{
      display: 'flex',
      flexWrap: 'nowrap',
      overflowX: { xs: 'auto', md: 'visible' },
      '&::-webkit-scrollbar': { display: 'none' },
    }}
  >
    {[
      {
        icon: AccountBalanceIcon,
        title: "Government Schemes",
        description: "Access information and apply for various government schemes and benefits.",
        gradientBg: 'linear-gradient(135deg, #d1a3e0, #b56fc9)',
        gradientColor: 'linear-gradient(135deg, #8E24AA, #9C27B0)',
        redirect: '/disabled/login',
      },
      {
        icon: EmojiObjectsIcon,
        title: "Job Recommendation",
        description: "Get personalized job recommendations based on your skills and preferences.",
        gradientBg: 'linear-gradient(135deg, #f497b7, #ec407a)',
        gradientColor: 'linear-gradient(135deg, #EC407A, #FF4081)',
        redirect: '/disabled/login',
      },
      {
        icon: WorkIcon,
        title: "Job Postings",
        description: "Browse and apply for jobs from inclusive employers looking for diverse talent.",
        gradientBg: 'linear-gradient(135deg, #90caf9, #42a5f5)',
        gradientColor: 'linear-gradient(135deg, #1976D2, #42A5F5)',
        redirect: '/donor/login', // redirect donor for Job Postings
      },
      {
        icon: PeopleIcon,
        title: "Community Forum",
        description: "Connect with peers, share experiences, and find support in a safe space.",
        gradientBg: 'linear-gradient(135deg, #a5d6a7, #4caf50)',
        gradientColor: 'linear-gradient(135deg, #388E3C, #4CAF50)',
        redirect: '/disabled/login',
      },
    ].map((service, index) => (
      <Grid
        item
        xs={12}
        md={3}
        key={index}
        sx={{ minWidth: { xs: '280px', md: 'auto' } }}
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
            minHeight: '280px',
            transition: 'all 0.3s ease',
            cursor: 'pointer',
            background: service.gradientBg,
            '&:hover': {
              transform: 'translateY(-6px) scale(1.03)',
              boxShadow: '0 16px 24px rgba(0,0,0,0.18)',
            },
          }}
        >
          <CardContent sx={{ textAlign: 'center', p: 0 }}>
            <service.icon
              sx={{
                fontSize: 48,
                mb: 2,
                background: service.gradientColor,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                transition: 'transform 0.3s ease',
                '&:hover': { transform: 'rotate(12deg) scale(1.1)' },
              }}
            />
            <Typography
              variant="h6"
              gutterBottom
              component="div"
              sx={{
                fontWeight: 600,
                mb: 2,
                background: service.gradientColor,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {service.title}
            </Typography>
            <Typography
              variant="body2"
              sx={{ mb: 3, opacity: 0.9, lineHeight: 1.6, color: '#333' }}
            >
              {service.description}
            </Typography>
            <Button
              variant="contained"
              disableElevation
              sx={{
                mt: 2,
                borderRadius: '6px',
                background: service.gradientColor,
                color: 'white',
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
                transition: 'all 0.3s ease',
                pointerEvents: 'none', // disable button click so card handles navigation
              }}
            >
              Available Now
            </Button>
          </CardContent>
        </Card>
      </Grid>
    ))}
  </Grid>
</Container>





      {/* Testimonials */}
      <Box sx={{ bgcolor: "white", py: 10 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            align="center"
            gutterBottom
            sx={{ fontWeight: 700, mb: 2 }}
          >
            Success Stories
          </Typography>
          <Typography
            variant="h6"
            align="center"
            color="text.secondary"
            sx={{ mb: 8 }}
          >
            Hear from our community members
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} md={4}>
              <TestimonialCard
                name="Priya Sharma"
                role="Recipient"
                content="DivyangSetu helped me get the wheelchair I needed. The platform made it easy to connect with kind donors who understood my needs."
                initial="P"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TestimonialCard
                name="Rajesh Patel"
                role="Donor"
                content="I'm proud to be part of this community. The transparent and direct connection with recipients make the donation process meaningful."
                initial="R"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TestimonialCard
                name="Rudraraj Mali"
                role="Recipient"
                content="Through this platform, I received funding for my prosthetic leg, which has been life-changing. Thank you DivyangSetu!"
                initial="R"
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

 {/* Call to Action */}
<Box
  sx={{
    background: 'linear-gradient(135deg, #28a745 0%, #1e7e34 100%)', // main background gradient
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
          background: 'linear-gradient(45deg, #42a5f5, #1e88e5)', // gradient button
          color: 'white',
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '16px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          transition: 'all 0.3s ease',
          '&:hover': {
            background: 'linear-gradient(45deg, #1e88e5, #1565c0)', // hover gradient
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
          background: 'linear-gradient(45deg, #42a5f5, #1e88e5)', // gradient button
          color: 'white',
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '16px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          transition: 'all 0.3s ease',
          '&:hover': {
            background: 'linear-gradient(45deg, #1e88e5, #1565c0)', // hover gradient
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
      <Box
        component="footer"
        sx={{ bgcolor: "white", py: 8, borderTop: "1px solid #e0e0e0" }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={6}>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
  <img
    src={require('./Disabled.jpg')}
    alt="DivyangSetu Logo"
    style={{ height: 40, width: 40, objectFit: 'contain' }}
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
              <Typography
                variant="h6"
                gutterBottom
                sx={{ fontWeight: 700, mb: 2 }}
              >
                Quick Links
              </Typography>
              <Link
                href="/donor/register"
                color="text.secondary"
                display="block"
                sx={{
                  mb: 1.5,
                  textDecoration: "none",
                  fontSize: "14px",
                  "&:hover": { color: "primary.main" },
                }}
              >
                Donate
              </Link>
              <Link
                href="/disabled/register"
                color="text.secondary"
                display="block"
                sx={{
                  mb: 1.5,
                  textDecoration: "none",
                  fontSize: "14px",
                  "&:hover": { color: "primary.main" },
                }}
              >
                Get Help
              </Link>
              <Link 
              onClick={() => navigate('#about')} 
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
              <Link href="#" color="text.secondary" display="block" sx={{ textDecoration: 'none', fontSize: '14px', '&:hover': { color: 'primary.main' } }}>
                Contact
              </Link>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ fontWeight: 700, mb: 2 }}
              >
                Connect With Us
              </Typography>
              <Box>
                <IconButton
                  color="default"
                  href="#"
                  sx={{ "&:hover": { color: "primary.main" } }}
                >
                  <LinkedInIcon />
                </IconButton>
                <IconButton
                  color="default"
                  href="#"
                  sx={{ "&:hover": { color: "primary.main" } }}
                >
                  <TwitterIcon />
                </IconButton>
                <IconButton
                  color="default"
                  href="#"
                  sx={{ "&:hover": { color: "primary.main" } }}
                >
                  <FacebookIcon />
                </IconButton>
                <IconButton
                  color="default"
                  href="#"
                  sx={{ "&:hover": { color: "primary.main" } }}
                >
                  <InstagramIcon />
                </IconButton>
              </Box>
            </Grid>
          </Grid>
          <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            sx={{ mt: 6, fontSize: "13px" }}
          >
            © {new Date().getFullYear()} DivyangSetu. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;
