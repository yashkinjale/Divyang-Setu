// routes/donorRoutes.js - FIXED VERSION
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Donor = require('../models/Donor');
const auth = require('../middleware/auth');

// Register donor
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    // Check if donor already exists
    let donor = await Donor.findOne({ email });
    if (donor) {
      return res.status(400).json({ message: 'Donor already exists' });
    }

    // Create new donor
    donor = new Donor({
      name,
      email,
      password,
      phone,
      address
    });

    await donor.save();

    // CRITICAL FIX: Convert ObjectId to string explicitly
    const donorId = donor._id.toString();

    // Create token
    const token = jwt.sign(
      { id: donorId, userId: donorId, type: 'donor' },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1d' }
    );

    res.status(201).json({
      token,
      user: {
        id: donorId,  // Now a proper 24-char string
        name: donor.name,
        email: donor.email,
        type: 'donor',
      }
    });
  } catch (err) {
    console.error('Donor registration error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login donor
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if donor exists
    const donor = await Donor.findOne({ email });
    if (!donor) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await donor.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // CRITICAL FIX: Convert ObjectId to string explicitly
    const donorId = donor._id.toString();

    // Create token
    const token = jwt.sign(
      { id: donorId, userId: donorId, type: 'donor' },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1d' }
    );

    res.json({
      token,
      donor: {
        id: donorId,  // Now a proper 24-char string
        name: donor.name,
        email: donor.email,
        type: 'donor',
      }
    });
  } catch (err) {
    console.error('Donor login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get donor profile
router.get('/profile', auth, async (req, res) => {
  try {
    const donor = await Donor.findById(req.user.id).select('-password');
    res.json(donor);
  } catch (err) {
    console.error('Get donor profile error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;