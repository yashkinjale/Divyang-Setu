// routes/disabled/profileRoutes.js - Debug version with enhanced logging
const express = require('express');
const router = express.Router();
const Disabled = require('../../models/Disabled');
const WishlistItem = require('../../models/WishlistItem');
const auth = require('../../middleware/auth');
const upload = require('../../middleware/upload');

// =============================================
// PROFILE ROUTES - DEBUG VERSION
// =============================================

// Get complete profile data with enhanced debugging
router.get('/', auth, async (req, res) => {
  try {
    console.log('=== PROFILE GET DEBUG ===');
    console.log('1. Auth middleware passed');
    console.log('2. req.user:', JSON.stringify(req.user, null, 2));
    
    // Handle both userId and id from your existing auth tokens
    const userId = req.user.userId || req.user.id;
    console.log('3. Extracted userId:', userId);
    
    if (!userId) {
      console.log('❌ No userId found in token');
      return res.status(400).json({ 
        message: 'No user ID found in token',
        debug: {
          tokenPayload: req.user
        }
      });
    }

    console.log('4. Searching for user with ID:', userId);
    const disabled = await Disabled.findById(userId).select('-password');
    
    console.log('5. Database query result:', disabled ? 'User found' : 'User not found');
    
    if (!disabled) {
      console.log('❌ User not found in database');
      console.log('Available users in database:');
      
      // Let's see what users exist (limit to 5 for safety)
      const allUsers = await Disabled.find({}).limit(5).select('_id name email');
      console.log('Sample users:', allUsers.map(u => ({ id: u._id, name: u.name, email: u.email })));
      
      return res.status(404).json({ 
        message: 'User not found',
        debug: {
          searchedUserId: userId,
          tokenPayload: req.user,
          sampleUserIds: allUsers.map(u => u._id.toString())
        }
      });
    }

    console.log('✅ User found:', disabled.name);

    // Get wishlist items for this user
    console.log('6. Fetching wishlist items...');
    const wishlistItems = await WishlistItem.find({ userId }).sort({ createdAt: -1 });
    console.log(`Found ${wishlistItems.length} wishlist items`);

    // Calculate statistics
    const totalWishlistItems = wishlistItems.length;
    const completedItems = wishlistItems.filter(item => item.isCompleted).length;
    const totalAmountNeeded = wishlistItems.reduce((sum, item) => sum + item.amountRequired, 0);
    const totalAmountRaised = wishlistItems.reduce((sum, item) => sum + item.amountRaised, 0);
    const verifiedDocuments = disabled.documents ? disabled.documents.filter(doc => doc.status === 'verified').length : 0;

    // Format the response to match your existing frontend expectations
    const profileData = {
      // Basic Information
      id: disabled._id,
      name: disabled.name,
      email: disabled.email,
      phone: disabled.phone,
      location: disabled.location || disabled.address,
      address: disabled.address,
      disabilityType: disabled.disabilityType,
      needs: disabled.needs,
      education: disabled.education || '',
      occupation: disabled.occupation || '',
      
      // Profile Image
      profileImage: disabled.profileImage ? {
        url: disabled.profileImage.url,
        publicId: disabled.profileImage.publicId
      } : null,
      
      // Verification Status
      isVerified: disabled.isVerified || false,
      verificationStatus: disabled.verificationStatus || 'pending',
      profileCompletionPercentage: disabled.profileCompletionPercentage || 0,
      
      // Documents
      documents: disabled.documents ? disabled.documents.map(doc => ({
        _id: doc._id,
        name: doc.name,
        fileName: doc.fileName,
        fileUrl: doc.fileUrl,
        status: doc.status,
        uploadDate: doc.uploadDate,
        verifiedDate: doc.verifiedDate,
        rejectionReason: doc.rejectionReason,
        date: doc.uploadDate ? doc.uploadDate.toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        }) : ''
      })) : [],
      
      // Wishlist
      wishlist: wishlistItems.map(item => ({
        _id: item._id,
        item: item.itemName,
        itemName: item.itemName,
        description: item.description,
        category: item.category,
        progress: item.progress,
        priority: item.urgencyLevel ? item.urgencyLevel.toLowerCase() : 'medium',
        urgencyLevel: item.urgencyLevel || 'Medium',
        estimatedCost: item.amountRequired,
        amountRequired: item.amountRequired,
        currentAmount: item.amountRaised,
        amountRaised: item.amountRaised,
        targetAmount: item.amountRequired,
        isCompleted: item.isCompleted,
        status: item.status,
        quantity: item.quantity,
        deadline: item.deadline,
        supportingDocuments: item.supportingDocuments || [],
        createdAt: item.createdAt,
        updatedAt: item.updatedAt
      })),
      
      // Recent Activity
      recentActivity: disabled.recentActivity ? disabled.recentActivity.slice(0, 10).map(activity => ({
        action: activity.action,
        description: activity.description,
        date: activity.date ? activity.date.toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        }) : '',
        timestamp: activity.date
      })) : [],
      
      // Statistics
      statistics: {
        totalWishlistItems,
        completedItems,
        pendingItems: totalWishlistItems - completedItems,
        totalAmountNeeded,
        totalAmountRaised,
        verifiedDocuments,
        totalDocuments: disabled.documents ? disabled.documents.length : 0,
        memberSince: disabled.createdAt ? disabled.createdAt.toLocaleDateString('en-IN', {
          month: 'long',
          year: 'numeric'
        }) : ''
      },
      
      // Timestamps
      createdAt: disabled.createdAt,
      updatedAt: disabled.updatedAt
    };

    console.log('7. Sending profile data successfully');
    console.log('=== END PROFILE DEBUG ===');
    res.json(profileData);
  } catch (err) {
    console.error('❌ Get profile error:', err);
    console.error('Error stack:', err.stack);
    res.status(500).json({ 
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
  }
});

// Test endpoint to check what's in the token
router.get('/debug-token', auth, (req, res) => {
  res.json({
    message: 'Token debug info',
    user: req.user,
    userId: req.user.userId || req.user.id,
    fullToken: req.user
  });
});

// Test endpoint to check database connection
router.get('/debug-db', auth, async (req, res) => {
  try {
    const userCount = await Disabled.countDocuments();
    const sampleUsers = await Disabled.find({}).limit(3).select('_id name email');
    
    res.json({
      message: 'Database debug info',
      totalUsers: userCount,
      sampleUsers: sampleUsers.map(u => ({
        id: u._id.toString(),
        name: u.name,
        email: u.email
      }))
    });
  } catch (error) {
    res.status(500).json({
      message: 'Database error',
      error: error.message
    });
  }
});

// Rest of your routes remain the same...
// Update profile information (atomic update to avoid VersionError)
router.put('/', auth, async (req, res) => {
  try {
    const { name, email, phone, location, address, disabilityType, needs, education, occupation } = req.body;
    const userId = req.user.userId || req.user.id;

    // Check if email is already taken by another user
    if (email) {
      const existingUser = await Disabled.findOne({ 
        email: email, 
        _id: { $ne: userId } 
      });
      if (existingUser) {
        return res.status(400).json({ message: 'Email is already taken' });
      }
    }

    // Build update object dynamically
    const updateFields = {};
    if (name) updateFields.name = name;
    if (email) updateFields.email = email;
    if (phone) updateFields.phone = phone;
    if (location) updateFields.location = location;
    if (address) updateFields.address = address;
    if (disabilityType) updateFields.disabilityType = disabilityType;
    if (needs) updateFields.needs = needs;
    if (education !== undefined) updateFields.education = education;
    if (occupation !== undefined) updateFields.occupation = occupation;

    // Perform atomic update
    const disabled = await Disabled.findByIdAndUpdate(
      userId,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!disabled) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Add activity atomically
    await Disabled.findByIdAndUpdate(
      userId,
      { $push: { recentActivity: { $each: [{ action: 'Updated Profile', description: 'Profile information was updated', date: new Date() }], $position: 0, $slice: 20 } } }
    );

    res.json({
      message: 'Profile updated successfully',
      profileCompletionPercentage: disabled.profileCompletionPercentage || 0
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;