const jwt = require('jsonwebtoken');
const { AppError } = require('../utils/errorHandler');

const auth = (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    console.log('Auth header:', authHeader); // Debug log

    if (!authHeader) {
      return next(new AppError('No authentication token provided', 401));
    }

    const token = authHeader.replace('Bearer ', '');
    console.log('Token:', token); // Debug log

    if (!token) {
      return next(new AppError('Invalid token format', 401));
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    console.log('Verified user:', verified); // Debug log

    if (!verified || !verified.id) {
      return next(new AppError('Invalid token payload', 401));
    }

    req.user = verified;
    next();
  } catch (err) {
    console.error('Auth middleware error:', err); // Debug log
    if (err.name === 'JsonWebTokenError') {
      return next(new AppError('Invalid token', 401));
    }
    if (err.name === 'TokenExpiredError') {
      return next(new AppError('Token expired', 401));
    }
    return next(new AppError('Authentication failed', 401));
  }
};

module.exports = auth; 