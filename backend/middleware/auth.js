const jwt = require('jsonwebtoken');
const { AppError } = require('../utils/errorHandler');

const auth = (req, res, next) => {
  try {
    console.log('=== AUTH MIDDLEWARE DEBUG ===');
    
    const authHeader = req.header('Authorization');
    console.log('1. Auth header:', authHeader);

    if (!authHeader) {
      console.log('❌ No auth header provided');
      return next(new AppError('No authentication token provided', 401));
    }

    const token = authHeader.replace('Bearer ', '');
    console.log('2. Extracted token (first 20 chars):', token.substring(0, 20) + '...');

    if (!token) {
      console.log('❌ Invalid token format');
      return next(new AppError('Invalid token format', 401));
    }

    const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
    console.log('3. JWT Secret exists:', !!jwtSecret);
    console.log('4. JWT Secret (first 10 chars):', jwtSecret.substring(0, 10) + '...');

    const verified = jwt.verify(token, jwtSecret);
    console.log('5. Token verified successfully');
    console.log('6. Decoded payload:', JSON.stringify(verified, null, 2));

    if (!verified) {
      console.log('❌ Token verification failed - no payload');
      return next(new AppError('Invalid token payload', 401));
    }

    // Check for user ID in different possible fields
    const userId = verified.id || verified.userId || verified._id;
    console.log('7. User ID found:', userId);

    if (!userId) {
      console.log('❌ No user ID in token payload');
      console.log('Available fields in token:', Object.keys(verified));
      return next(new AppError('Invalid token payload - no user ID', 401));
    }

    req.user = verified;
    console.log('8. Auth successful, user attached to request');
    console.log('=== END AUTH DEBUG ===');
    next();
  } catch (err) {
    console.error('❌ Auth middleware error:', err.message);
    console.error('Error type:', err.name);
    
    if (err.name === 'JsonWebTokenError') {
      console.log('Token verification failed - invalid signature or format');
      return next(new AppError('Invalid token', 401));
    }
    if (err.name === 'TokenExpiredError') {
      console.log('Token has expired');
      return next(new AppError('Token expired', 401));
    }
    return next(new AppError('Authentication failed', 401));
  }
};

module.exports = auth;