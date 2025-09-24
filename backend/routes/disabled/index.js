const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');      // login/register
const profileRoutes = require('./profileRoutes'); // profile management
const uploadRoutes = require('./uploadRoutes');
const activityRoutes = require('./activityRoutes'); // user activity


router.use('/', require('./authRoutes'));
router.use('/profile', require('./profileRoutes'));
router.use('/upload', require('./uploadRoutes'));
router.use('/activity', require('./activityRoutes'));

module.exports = router;
