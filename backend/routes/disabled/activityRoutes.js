const express = require('express');
const router = express.Router();
const Disabled = require('../../models/Disabled');
const auth = require('../../middleware/auth');

// Get user activity
router.get('/', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const disabled = await Disabled.findById(req.user.id || req.user.userId).select('recentActivity');
    if (!disabled) return res.status(404).json({ message: 'User not found' });

    const activities = disabled.recentActivity
      .slice(skip, skip + limit)
      .map(a => ({
        action: a.action,
        description: a.description,
        date: a.date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        timestamp: a.date
      }));

    res.json({
      activities,
      currentPage: page,
      totalActivities: disabled.recentActivity.length,
      hasMore: skip + limit < disabled.recentActivity.length
    });
  } catch (error) {
    console.error('Get activity error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
