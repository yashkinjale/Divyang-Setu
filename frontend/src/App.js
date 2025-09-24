import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { Container, Box, Grid, Typography } from '@mui/material';
import { AuthProvider, useAuth } from './context/AuthContext';
import DonorAuth from './components/auth/DonorAuth';
import DisabledAuth from './components/auth/DisabledAuth';
import LandingPage from './components/LandingPage';
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
import theme from './theme';

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

// Dashboard Home Component (extracted from DisabledDashboard)
const DisabledDashboardHome = () => {
  // Sample data for schemes
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
      image: "https://www.wemakescholars.com/uploads/blog/Scholarship-_-Grants-for-Physically-Disabled-students.webp"
    }
  ];

  // Sample fund data
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
      {/* Government Schemes Slider */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
          Available Schemes & Scholarships
        </Typography>
        <SchemeSlider schemes={schemes} />
      </Box>

      {/* Fund Status Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
          Your Fund Status
        </Typography>
        <Grid container spacing={3}>
          {funds.map((fund, index) => (
            <Grid item xs={12} md={4} key={index}>
              <FundStatusCard {...fund} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            {/* Landing Page */}
            <Route path="/" element={<LandingPage />} />
            
            {/* Job Postings - Public Route */}
            <Route path="/job-postings" element={<JobPostings />} />

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
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
