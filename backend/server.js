const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const { errorHandler } = require('./utils/errorHandler');

// Routes
const donorRoutes = require('./routes/donorRoutes');
const disabledRoutes = require('./routes/disabledRoutes');
const wishlistRoutes = require('./routes/wishlist');

dotenv.config();
const app = express();

// Debug logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads', 'wishlist');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/donation-app')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
console.log('Registering routes...');

// Mount routes
app.use('/api/donors', donorRoutes);
app.use('/api/disabled', disabledRoutes);
app.use('/api/wishlist', wishlistRoutes);

console.log('Routes registered successfully');

// Handle undefined routes
app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.status = 404;
  next(error);
});

// Global error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log('Available routes:');
  console.log('- POST /api/wishlist');
  console.log('- GET /api/wishlist');
  console.log('- POST /api/wishlist/:id/documents');
  console.log('- PATCH /api/wishlist/:id');
  console.log('- DELETE /api/wishlist/:id');
});

// Handle server errors
server.on('error', (error) => {
  console.error('Server error:', error);
  process.exit(1);
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
  server.close(() => process.exit(1));
}); 