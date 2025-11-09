import React, { useState, useCallback, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { Container, Box, Grid, Typography, IconButton, Tooltip } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeContext } from './context/ThemeContext';
import DonorAuth from './components/auth/DonorAuth';
import DisabledAuth from './components/auth/DisabledAuth';
import PWDCertificateVerification from './components/auth/pwdVerification';
import LandingPage from './components/LandingPage';
import AboutPage from './components/AboutPage';
import ContactPage from './components/ContactUs';
import DisabledDashboard from './components/DisabledDashboard';
import GovernmentSchemesPage from './components/GovernmentSchemesPage';
import WishlistSection from './components/WishlistSection';
import SuccessStoriesPage from './components/SuccessStoriesPage';
import ProfilePage from './components/ProfilePage';
import SchemeSlider from './components/SchemeSlider';
import FundStatusCard from './components/FundStatusCard';
import JobRecommendations from './components/JobRecommendations';
import JobPostings from './components/JobPostings';
import DonorDashboard from './components/DonorDashboard';
import MessagesPage from './pages/MessagesPage';
import theme from './theme';
import highContrastTheme from './utils/highContrastTheme';
import { ScreenReaderProvider, useScreenReader } from './context/ScreenReaderContext';
import { VoiceNavProvider } from './context/VoiceNavContext';



const PrivateRoute = ({ children, userType }) => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated || user.type !== userType) {
    console.log('Auth state:', { isAuthenticated, userType, currentUserType: user?.type });
    return <Navigate to={`/${userType}/login`} replace />;
  }

  return children;
};

// Dashboard Home Component
const DisabledDashboardHome = () => {
  const schemes = [
    {
      title: "National Scholarship for Persons with Disabilities",
      description: "Full scholarship covering tuition fees, accommodation, and monthly stipend for higher education.",
      type: "Education",
      deadline: "30 April 2024",
      image: "https://blogassets.leverageedu.com/media/uploads/2022/10/27134314/scholarships-for-disabled-international-students-in-usa.jpg"
    },
    {
      title: "Assistive Technology Grant",
      description: "Up to ₹50,000 for purchasing assistive devices and technology.",
      type: "Technology",
      deadline: "15 May 2024",
      image: "https://blogassets.leverageedu.com/blog/wp-content/uploads/2020/10/22202124/Scholarships-for-Students-with-Disabilities.jpg"
    },
    {
      title: "Entrepreneurship Development Program",
      description: "Training and seed funding of up to ₹2,00,000 for starting your own business.",
      type: "Business",
      deadline: "1 June 2024",
      image: "https://www.udyami.org.in/storage/thumbnail/epa2TluwuA2dlRjzghZnXKpLN68gOypcJRZ1nuGR.png"
    }
  ];

  const funds = [
    {
      title: "Education Fund",
      current: 75000,
      target: 100000,
      icon: "AccessibilityIcon",
      color: "primary"
    },
    {
      title: "Medical Support",
      current: 45000,
      target: 80000,
      icon: "WishlistIcon",
      color: "secondary"
    },
    {
      title: "Technology Grant",
      current: 30000,
      target: 50000,
      icon: "ProgressIcon",
      color: "success"
    }
  ];

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
          Available Schemes & Scholarships
        </Typography>
        <SchemeSlider schemes={schemes} />
      </Box>

      <WishlistSection />
    </Container>
  );
};

const App = () => {
  const [isHighContrast, setIsHighContrast] = useState(() => {
    // Check localStorage or system preference
    const saved = localStorage.getItem('highContrast');
    if (saved !== null) return JSON.parse(saved);
    
    // Check system preference
    if (window.matchMedia) {
      return window.matchMedia('(prefers-contrast: more)').matches;
    }
    return false;
  });

  const toggleTheme = useCallback(() => {
    setIsHighContrast(prev => {
      const newValue = !prev;
      localStorage.setItem('highContrast', JSON.stringify(newValue));
      return newValue;
    });
  }, []);

  const currentTheme = isHighContrast ? highContrastTheme : theme;

  // Listen to system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-contrast: more)');
    const handleChange = (e) => {
      setIsHighContrast(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const themeContextValue = {
    isHighContrast,
    toggleTheme,
  };

  return (
    <ThemeProvider theme={currentTheme}>
      <CssBaseline />
      <ThemeContext.Provider value={themeContextValue}>
        <AuthProvider>
          <ScreenReaderProvider>
            <Router>
              <VoiceNavProvider>
                <RouteChangeAnnouncer />
                <Routes>
                  {/* Landing Page */}
                  <Route path="/" element={<LandingPage />} />
                  
                  {/* Job Postings - Public Route */}
                  <Route path="/job-postings" element={<JobPostings />} />

                  {/* About Page */}
                  <Route path="/about" element={<AboutPage />} />

                  {/* Contact Page */}
                  <Route path="/contact" element={<ContactPage />} />

                  {/* Donor Routes */}
                  <Route path="/donor/login" element={<DonorAuth isLogin={true} />} />
                  <Route path="/donor/register" element={<DonorAuth isLogin={false} />} />
                  <Route
                    path="/donor/dashboard"
                    element={
                      <PrivateRoute userType="donor">
                        <DonorDashboard />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/donor/dashboard/money-donation"
                    element={
                      <PrivateRoute userType="donor">
                        <DonorDashboard />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/donor/dashboard/equipment-donation"
                    element={
                      <PrivateRoute userType="donor">
                        <DonorDashboard />
                      </PrivateRoute>
                    }
                  />

                  {/* Disabled Person Routes with Nested Dashboard */}
                  <Route path="/disabled/login" element={<DisabledAuth isLogin={true} />} />
                  <Route path="/disabled/register" element={<DisabledAuth isLogin={false} />} />
                  
                  <Route
                    path="/disabled/verification"
                    element={
                      <PrivateRoute userType="disabled">
                        <PWDCertificateVerification />
                      </PrivateRoute>
                    }
                  />
                  
                  <Route
                    path="/disabled/dashboard"
                    element={
                      <PrivateRoute userType="disabled">
                        <DisabledDashboard />
                      </PrivateRoute>
                    }
                  >
                    {/* Nested routes within the dashboard */}
                    <Route index element={<DisabledDashboardHome />} />
                    <Route path="schemes" element={<GovernmentSchemesPage />} />
                    <Route path="wishlist" element={<WishlistSection />} />
                    <Route path="jobs" element={<JobRecommendations />} />
                    <Route path="community" element={<SuccessStoriesPage />} />
                    <Route path="profile" element={<ProfilePage />} />
                    <Route path="messages" element={<MessagesPage />} />
                  </Route>
                </Routes>
              </VoiceNavProvider>
            </Router>
          </ScreenReaderProvider>
        </AuthProvider>
      </ThemeContext.Provider>
    </ThemeProvider>
  );
};

export default App;

// Announces route changes to the screen reader
const RouteChangeAnnouncer = () => {
  const { announce, enabled } = useScreenReader();
  const location = React.useMemo(() => window.location.pathname + window.location.search, [window.location.pathname, window.location.search]);
  React.useEffect(() => {
    if (!enabled) return;
    const title = document.title || 'Page changed';
    announce(title);
  }, [location, enabled, announce]);
  return null;
};
