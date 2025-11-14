// routes/disabled/authRoutes.js - FIXED VERSION
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Disabled = require("../../models/Disabled");

// Register disabled person
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, phone, address, disabilityType, needs } = req.body;

    let disabled = await Disabled.findOne({ email });
    if (disabled) {
      return res.status(400).json({ message: "User already exists" });
    }

    disabled = new Disabled({
      name,
      email,
      password,
      phone,
      address,
      disabilityType,
      needs,
      location: address,
    });

    await disabled.save();

    // CRITICAL FIX: Convert ObjectId to string explicitly
    const userId = disabled._id.toString();

    const token = jwt.sign(
      { userId: userId, id: userId, type: "disabled" },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "1d" }
    );

    // CRITICAL FIX: Ensure ID is a clean string
    res.status(201).json({
      token,
      user: {
        id: userId,  // Now a proper 24-char string
        name: disabled.name,
        email: disabled.email,
        type: "disabled",
      },
    });

  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      console.error("Registration validation error:", messages.join(', '));
      return res.status(400).json({ message: messages.join(', ') });
    }

    console.error("Registration error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Login disabled person
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const disabled = await Disabled.findOne({ email });

    if (!disabled || !(await disabled.comparePassword(password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // CRITICAL FIX: Convert ObjectId to string explicitly
    const userId = disabled._id.toString();

    const token = jwt.sign(
      { userId: userId, id: userId, type: "disabled" },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "1d" }
    );

    // CRITICAL FIX: Ensure ID is a clean string
    res.json({
      token,
      user: {
        id: userId,  // Now a proper 24-char string
        name: disabled.name,
        email: disabled.email,
        type: "disabled",
      },
    });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;