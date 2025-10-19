const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const WishlistItem = require('../models/WishlistItem');
const Disabled = require('../models/Disabled');
const Donor = require('../models/Donor');
const Donation = require('../models/Donation'); // Use your existing Donation model
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

// Get all public wishlist items (for donors to browse)
router.get('/public/browse', async (req, res, next) => {
  try {
    const { category, urgency, search } = req.query;
    
    let query = { isCompleted: false, status: { $ne: 'rejected' } };
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (urgency && urgency !== 'all') {
      query.urgencyLevel = urgency;
    }
    
    if (search) {
      query.$or = [
        { itemName: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    const wishlistItems = await WishlistItem.find(query)
      .populate('userId', 'name location disabilityType profileImage')
      .sort({ urgencyLevel: -1, createdAt: -1 })
      .limit(50);
    
    res.json({
      status: 'success',
      count: wishlistItems.length,
      data: wishlistItems
    });
  } catch (err) {
    next(err);
  }
});

// Create a new wishlist item
router.post('/', auth, async (req, res, next) => {
  try {
    console.log('Received wishlist request:', req.body);
    console.log('User from auth:', req.user);

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
      userId: req.user.id,
      amountRaised: 0,
      progress: 0,
      isCompleted: false,
      status: 'active'
    });

    console.log('Creating wishlist item:', wishlistItem);

    const newItem = await wishlistItem.save();
    console.log('Saved wishlist item:', newItem);

    // Add activity to disabled person's profile
    await Disabled.findByIdAndUpdate(req.user.id, {
      $push: {
        recentActivity: {
          $each: [{
            action: 'Created Wishlist Item',
            description: `Added "${itemName}" to wishlist`,
            date: new Date()
          }],
          $position: 0,
          $slice: 20
        }
      }
    });

    res.status(201).json({
      status: 'success',
      data: newItem
    });
  } catch (err) {
    console.error('Error creating wishlist item:', err);
    next(err);
  }
});

// NEW: Allocate donation to wishlist items
// This endpoint is called when a donation is successfully processed
router.post('/:id/allocate-donation', auth, async (req, res, next) => {
  try {
    const { donationId, amount } = req.body;
    const wishlistItemId = req.params.id;

    console.log('=== ALLOCATING DONATION TO WISHLIST ===');
    console.log('Wishlist Item ID:', wishlistItemId);
    console.log('Donation ID:', donationId);
    console.log('Amount:', amount);

    // Find the wishlist item
    const wishlistItem = await WishlistItem.findById(wishlistItemId);
    if (!wishlistItem) {
      return next(new AppError('Wishlist item not found', 404));
    }

    // Verify ownership
    if (wishlistItem.userId.toString() !== req.user.id) {
      return next(new AppError('You do not have permission to modify this wishlist item', 403));
    }

    // Check if already completed
    if (wishlistItem.isCompleted) {
      return next(new AppError('This item is already completed', 400));
    }

    // Calculate remaining amount needed
    const remainingAmount = wishlistItem.amountRequired - wishlistItem.amountRaised;
    
    // Cap allocation to remaining amount
    const actualAllocationAmount = Math.min(parseFloat(amount), remainingAmount);
    
    if (actualAllocationAmount <= 0) {
      return next(new AppError('This item is already fully funded', 400));
    }

    console.log('Remaining Amount:', remainingAmount);
    console.log('Actual Allocation Amount:', actualAllocationAmount);

    // Update wishlist item
    wishlistItem.amountRaised += actualAllocationAmount;
    wishlistItem.progress = Math.round((wishlistItem.amountRaised / wishlistItem.amountRequired) * 100);
    
    console.log('New Amount Raised:', wishlistItem.amountRaised);
    console.log('Progress:', wishlistItem.progress);

    // Check if item is now completed
    if (wishlistItem.amountRaised >= wishlistItem.amountRequired) {
      wishlistItem.isCompleted = true;
      wishlistItem.status = 'completed';
      wishlistItem.completedDate = new Date();
      console.log('Item marked as COMPLETED');
    }

    await wishlistItem.save();
    console.log('Wishlist item updated');

    // Update the donation record with allocation info
    const donation = await Donation.findById(donationId);
    if (donation) {
      donation.allocatedToWishlist.push({
        wishlistItemId: wishlistItem._id,
        amountAllocated: actualAllocationAmount
      });
      await donation.save();
      console.log('Donation updated with allocation');
    }

    // Add activity to disabled person's profile
    const donation_record = await Donation.findById(donationId).populate('donorId');
    const donorName = donation_record?.donorName || donation_record?.donorId?.name || 'Anonymous Donor';

    await Disabled.findByIdAndUpdate(wishlistItem.userId, {
      $push: {
        recentActivity: {
          $each: [{
            action: 'New Donation Received',
            description: `${donorName} donated ₹${actualAllocationAmount} towards ${wishlistItem.itemName}`,
            date: new Date()
          }],
          $position: 0,
          $slice: 20
        }
      }
    });

    console.log('Activity added to disabled person');
    console.log('=== ALLOCATION COMPLETED SUCCESSFULLY ===');

    res.status(200).json({
      status: 'success',
      message: 'Donation allocated successfully!',
      updatedItem: {
        id: wishlistItem._id,
        amountRaised: wishlistItem.amountRaised,
        progress: wishlistItem.progress,
        isCompleted: wishlistItem.isCompleted,
        remainingAmount: Math.max(0, wishlistItem.amountRequired - wishlistItem.amountRaised)
      }
    });

  } catch (error) {
    console.error('Allocation error:', error);
    next(error);
  }
});

// Get donation history for a wishlist item
router.get('/:id/donations', async (req, res, next) => {
  try {
    const donations = await Donation.find({ 
      'allocatedToWishlist.wishlistItemId': req.params.id,
      status: 'success'
    })
    .populate('donorId', 'name email')
    .sort({ createdAt: -1 })
    .limit(20);

    // Calculate total donations for this item
    let totalDonated = 0;
    donations.forEach(donation => {
      const allocation = donation.allocatedToWishlist.find(
        a => a.wishlistItemId.toString() === req.params.id
      );
      if (allocation) {
        totalDonated += allocation.amountAllocated;
      }
    });

    res.json({
      status: 'success',
      count: donations.length,
      totalDonated: totalDonated,
      data: donations.map(donation => ({
        id: donation._id,
        donorName: donation.donorName || donation.donorId?.name || 'Anonymous',
        amount: donation.allocatedToWishlist.find(a => a.wishlistItemId.toString() === req.params.id)?.amountAllocated,
        note: donation.note,
        date: donation.createdAt,
        formattedDate: donation.formattedDate
      }))
    });
  } catch (err) {
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