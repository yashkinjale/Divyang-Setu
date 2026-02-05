const express = require('express');
const router = express.Router();

// Import route modules
const authRoutes = require('./authRoutes');      // login/register
const profileRoutes = require('./profileRoutes'); // profile management
const uploadRoutes = require('./uploadRoutes');   // file uploads

// Mount auth routes directly at the root level
// This makes /api/disabled/login and /api/disabled/register work
router.use('/', authRoutes);

// Mount profile routes at /profile to match your existing profileRoutes.js structure
// This makes /api/disabled/profile work correctly
router.use('/profile', profileRoutes);

// Mount upload routes at /profile/upload or directly under /profile
router.use('/profile', uploadRoutes);

// Debug logging for route registration
console.log('✅ Disabled routes configured:');
console.log('  - Auth routes mounted at /api/disabled/');
console.log('  - Profile routes mounted at /api/disabled/profile');

module.exports = router;