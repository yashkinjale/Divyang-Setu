const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const WishlistItem = require('../models/WishlistItem');
const multer = require('multer');
const path = require('path');
const { AppError } = require('../utils/errorHandler');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', 'uploads', 'wishlist'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new AppError('Invalid file type. Allowed types: PDF, DOC, DOCX, JPG, JPEG, PNG', 400));
    }
  }
});

// Get all wishlist items for a user
router.get('/', auth, async (req, res, next) => {
  try {
    const wishlistItems = await WishlistItem.find({ userId: req.user.id })
      .sort({ createdAt: -1 });
    res.json({
      status: 'success',
      data: wishlistItems
    });
  } catch (err) {
    next(err);
  }
});

// Create a new wishlist item
router.post('/', auth, async (req, res, next) => {
  try {
    console.log('Received wishlist request:', req.body); // Debug log
    console.log('User from auth:', req.user); // Debug log

    const { itemName, description, amountRequired, quantity, deadline, urgencyLevel, category } = req.body;

    // Validate required fields
    if (!itemName || !description || !amountRequired || !category) {
      return next(new AppError('Please provide all required fields: itemName, description, amountRequired, and category', 400));
    }

    // Validate amount and quantity
    if (isNaN(amountRequired) || amountRequired <= 0) {
      return next(new AppError('Amount must be a positive number', 400));
    }

    if (quantity && (isNaN(quantity) || quantity <= 0)) {
      return next(new AppError('Quantity must be a positive number', 400));
    }

    // Validate category
    const validCategories = ['Medical', 'Education', 'Mobility', 'Technology', 'Other'];
    if (!validCategories.includes(category)) {
      return next(new AppError(`Invalid category. Must be one of: ${validCategories.join(', ')}`, 400));
    }

    // Validate urgency level
    const validUrgencyLevels = ['Low', 'Medium', 'High'];
    if (urgencyLevel && !validUrgencyLevels.includes(urgencyLevel)) {
      return next(new AppError(`Invalid urgency level. Must be one of: ${validUrgencyLevels.join(', ')}`, 400));
    }

    const wishlistItem = new WishlistItem({
      itemName: itemName.trim(),
      description: description.trim(),
      amountRequired: parseFloat(amountRequired),
      quantity: quantity ? parseInt(quantity) : 1,
      deadline: deadline || undefined,
      urgencyLevel: urgencyLevel || 'Medium',
      category,
      userId: req.user.id
    });

    console.log('Creating wishlist item:', wishlistItem); // Debug log

    const newItem = await wishlistItem.save();
    console.log('Saved wishlist item:', newItem); // Debug log

    res.status(201).json({
      status: 'success',
      data: newItem
    });
  } catch (err) {
    console.error('Error creating wishlist item:', err); // Debug log
    next(err);
  }
});

// Upload supporting documents
router.post('/:id/documents', auth, upload.array('documents', 5), async (req, res, next) => {
  try {
    const wishlistItem = await WishlistItem.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!wishlistItem) {
      return next(new AppError('Wishlist item not found', 404));
    }

    if (!req.files || req.files.length === 0) {
      return next(new AppError('No files uploaded', 400));
    }

    const documents = req.files.map(file => ({
      fileName: file.originalname,
      fileUrl: `/uploads/wishlist/${file.filename}`,
      fileType: path.extname(file.originalname).slice(1)
    }));

    wishlistItem.supportingDocuments.push(...documents);
    await wishlistItem.save();

    res.json({
      status: 'success',
      data: wishlistItem
    });
  } catch (err) {
    next(err);
  }
});

// Update a wishlist item
router.patch('/:id', auth, async (req, res, next) => {
  try {
    const wishlistItem = await WishlistItem.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!wishlistItem) {
      return next(new AppError('Wishlist item not found', 404));
    }

    // Validate amount if provided
    if (req.body.amountRequired && req.body.amountRequired <= 0) {
      return next(new AppError('Amount must be greater than 0', 400));
    }

    // Validate quantity if provided
    if (req.body.quantity && req.body.quantity <= 0) {
      return next(new AppError('Quantity must be greater than 0', 400));
    }

    Object.assign(wishlistItem, req.body);
    const updatedItem = await wishlistItem.save();

    res.json({
      status: 'success',
      data: updatedItem
    });
  } catch (err) {
    next(err);
  }
});

// Delete a wishlist item
router.delete('/:id', auth, async (req, res, next) => {
  try {
    const wishlistItem = await WishlistItem.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!wishlistItem) {
      return next(new AppError('Wishlist item not found', 404));
    }

    await wishlistItem.deleteOne();
    res.json({
      status: 'success',
      data: null
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router; 