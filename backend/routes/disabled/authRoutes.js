// routes/disabled/authRoutes.js - CLEAN VERSION (routes only)
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Disabled = require("../../models/Disabled");

// Register disabled person
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, phone, address, disabilityType, needs } =
      req.body;

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

    const token = jwt.sign(
      { userId: disabled._id, id: disabled._id, type: "disabled" },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "1d" }
    );

    // Send response first
    res.status(201).json({
      token,
      user: {
        id: disabled._id,
        name: disabled.name,
        email: disabled.email,
        type: "disabled",
      },
    });

  } catch (err) {
    // Enhanced error handling
    if (err.name === 'ValidationError') {
      // Mongoose validation error (e.g., password too short)
      const messages = Object.values(err.errors).map(val => val.message);
      // Log the specific validation error for debugging
      console.error("Registration validation error:", messages.join(', '));
      return res.status(400).json({ message: messages.join(', ') });
    }

    // Log generic server errors
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

    const token = jwt.sign(
      { userId: disabled._id, id: disabled._id, type: "disabled" },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "1d" }
    );

    // Send response FIRST
    res.json({
      token,
      user: {
        id: disabled._id,
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

