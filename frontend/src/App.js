import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { AuthProvider, useAuth } from './context/AuthContext';
import DonorAuth from './components/DonorAuth';
import DisabledAuth from './components/DisabledAuth';
import LandingPage from './components/LandingPage';
import DisabledDashboard from './components/DisabledDashboard';
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

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            {/* Landing Page */}
            <Route path="/" element={<LandingPage />} />

            {/* Donor Routes */}
            <Route path="/donor/login" element={<DonorAuth isLogin={true} />} />
            <Route path="/donor/register" element={<DonorAuth isLogin={false} />} />
            <Route
              path="/donor/dashboard"
              element={
                <PrivateRoute userType="donor">
                  <div>Donor Dashboard</div>
                </PrivateRoute>
              }
            />

            {/* Disabled Person Routes */}
            <Route path="/disabled/login" element={<DisabledAuth isLogin={true} />} />
            <Route path="/disabled/register" element={<DisabledAuth isLogin={false} />} />
            <Route
              path="/disabled/dashboard"
              element={
                <PrivateRoute userType="disabled">
                  <DisabledDashboard />
                </PrivateRoute>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
