const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Disabled = require('../../models/Disabled');

// Register disabled person
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, address, disabilityType, needs } = req.body;

    let disabled = await Disabled.findOne({ email });
    if (disabled) {
      return res.status(400).json({ message: 'User already exists' });
    }

    disabled = new Disabled({
      name, email, password, phone, address, disabilityType, needs,
      location: address
    });

    await disabled.save();
    await disabled.addActivity('Account Created', 'Welcome to DivyangSetu! Your account has been created successfully.');

    const token = jwt.sign(
      { userId: disabled._id, id: disabled._id, type: 'disabled' },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1d' }
    );

    res.status(201).json({
      token,
      user: {
        id: disabled._id,
        name: disabled.name,
        email: disabled.email,
        type: 'disabled'
      }
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login disabled person
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const disabled = await Disabled.findOne({ email });

    if (!disabled || !(await disabled.comparePassword(password))) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    await disabled.addActivity('Logged In', 'Successfully logged into your account');

    const token = jwt.sign(
      { userId: disabled._id, id: disabled._id, type: 'disabled' },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: {
        id: disabled._id,
        name: disabled.name,
        email: disabled.email,
        type: 'disabled'
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
