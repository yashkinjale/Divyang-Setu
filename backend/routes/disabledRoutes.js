const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Disabled = require('../models/Disabled');
const auth = require('../middleware/auth');

// Register disabled person
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, address, disabilityType, needs } = req.body;

    // Check if disabled person already exists
    let disabled = await Disabled.findOne({ email });
    if (disabled) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new disabled person
    disabled = new Disabled({
      name,
      email,
      password,
      phone,
      address,
      disabilityType,
      needs
    });

    await disabled.save();

    // Create token
    const token = jwt.sign(
      { id: disabled._id, type: 'disabled' },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1d' }
    );

    res.status(201).json({
      token,
      disabled: {
        id: disabled._id,
        name: disabled.name,
        email: disabled.email
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Login disabled person
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if disabled person exists
    const disabled = await Disabled.findOne({ email });
    if (!disabled) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await disabled.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create token
    const token = jwt.sign(
      { id: disabled._id, type: 'disabled' },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1d' }
    );

    res.json({
      token,
      disabled: {
        id: disabled._id,
        name: disabled.name,
        email: disabled.email
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get disabled person profile
router.get('/profile', auth, async (req, res) => {
  try {
    const disabled = await Disabled.findById(req.user.id).select('-password');
    res.json(disabled);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 