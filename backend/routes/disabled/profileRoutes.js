// routes/profile.js - Profile Management Routes (Works with existing auth routes)
const express = require('express');
const router = express.Router();
const Disabled = require('../../models/Disabled');
const WishlistItem = require('../../models/WishlistItem');
const auth = require('../../middleware/auth');
const upload = require('../../middleware/upload');
const { body, validationResult } = require('express-validator');

// =============================================
// PROFILE ROUTES
// =============================================

// Get complete profile data
router.get('/', auth, async (req, res) => {
  try {
    // Handle both userId and id from your existing auth tokens
    const userId = req.user.userId || req.user.id;
    const disabled = await Disabled.findById(userId).select('-password');
    
    if (!disabled) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get wishlist items for this user
    const wishlistItems = await WishlistItem.find({ userId }).sort({ createdAt: -1 });

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

    res.json(profileData);
  } catch (err) {
    console.error('Get profile error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update profile information
router.put('/', auth, async (req, res) => {
  try {
    const { name, email, phone, location, address, disabilityType, needs, education, occupation } = req.body;
    const userId = req.user.userId || req.user.id;
    
    const disabled = await Disabled.findById(userId);
    if (!disabled) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if email is already taken by another user
    if (email && email !== disabled.email) {
      const existingUser = await Disabled.findOne({ 
        email: email, 
        _id: { $ne: disabled._id } 
      });
      if (existingUser) {
        return res.status(400).json({ message: 'Email is already taken' });
      }
    }

    // Update fields
    if (name) disabled.name = name;
    if (email) disabled.email = email;
    if (phone) disabled.phone = phone;
    if (location) disabled.location = location;
    if (address) disabled.address = address;
    if (disabilityType) disabled.disabilityType = disabilityType;
    if (needs) disabled.needs = needs;
    if (education !== undefined) disabled.education = education;
    if (occupation !== undefined) disabled.occupation = occupation;

    await disabled.save();

    // Add activity if method exists
    if (disabled.addActivity) {
      await disabled.addActivity('Updated Profile', 'Profile information was updated');
    }

    res.json({ 
      message: 'Profile updated successfully',
      profileCompletionPercentage: disabled.profileCompletionPercentage || 0
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Upload profile image
router.post('/image', [auth, upload.single('profileImage')], async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    const userId = req.user.userId || req.user.id;
    const disabled = await Disabled.findById(userId);
    
    if (!disabled) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update profile image
    disabled.profileImage = {
      url: req.file.path,
      publicId: req.file.filename
    };

    await disabled.save();

    // Add activity if method exists
    if (disabled.addActivity) {
      await disabled.addActivity('Updated Profile Picture', 'Profile picture was changed');
    }

    res.json({
      message: 'Profile image uploaded successfully',
      imageUrl: disabled.profileImage.url,
      profileCompletionPercentage: disabled.profileCompletionPercentage || 0
    });
  } catch (error) {
    console.error('Upload profile image error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete profile image
router.delete('/image', auth, async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    const disabled = await Disabled.findById(userId);
    
    if (!disabled) {
      return res.status(404).json({ message: 'User not found' });
    }

    disabled.profileImage = undefined;
    await disabled.save();

    // Add activity if method exists
    if (disabled.addActivity) {
      await disabled.addActivity('Removed Profile Picture', 'Profile picture was removed');
    }

    res.json({
      message: 'Profile image removed successfully'
    });
  } catch (error) {
    console.error('Delete profile image error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// =============================================
// DOCUMENT ROUTES
// =============================================

// Upload document
router.post('/documents', [auth, upload.single('document')], async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Document name is required' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No document file provided' });
    }

    const userId = req.user.userId || req.user.id;
    const disabled = await Disabled.findById(userId);
    
    if (!disabled) {
      return res.status(404).json({ message: 'User not found' });
    }

    const newDocument = {
      name: name.trim(),
      fileName: req.file.originalname,
      fileUrl: req.file.path,
      status: 'pending'
    };

    // Initialize documents array if it doesn't exist
    if (!disabled.documents) {
      disabled.documents = [];
    }

    disabled.documents.push(newDocument);
    await disabled.save();

    // Add activity if method exists
    if (disabled.addActivity) {
      await disabled.addActivity('Uploaded Document', `Uploaded ${name}`);
    }

    const addedDocument = disabled.documents[disabled.documents.length - 1];

    res.json({
      message: 'Document uploaded successfully',
      document: {
        _id: addedDocument._id,
        name: addedDocument.name,
        status: addedDocument.status,
        date: addedDocument.uploadDate ? addedDocument.uploadDate.toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        }) : new Date().toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        }),
        fileUrl: addedDocument.fileUrl
      }
    });
  } catch (error) {
    console.error('Upload document error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get documents
router.get('/documents', auth, async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    const disabled = await Disabled.findById(userId).select('documents');
    
    if (!disabled) {
      return res.status(404).json({ message: 'User not found' });
    }

    const documents = disabled.documents ? disabled.documents.map(doc => ({
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
    })) : [];

    res.json({
      documents
    });
  } catch (error) {
    console.error('Get documents error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete document
router.delete('/documents/:documentId', auth, async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    const { documentId } = req.params;
    
    const disabled = await Disabled.findById(userId);
    if (!disabled) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!disabled.documents) {
      return res.status(404).json({ message: 'Document not found' });
    }

    const documentIndex = disabled.documents.findIndex(doc => doc._id.toString() === documentId);
    if (documentIndex === -1) {
      return res.status(404).json({ message: 'Document not found' });
    }

    const documentName = disabled.documents[documentIndex].name;
    disabled.documents.splice(documentIndex, 1);
    await disabled.save();

    // Add activity if method exists
    if (disabled.addActivity) {
      await disabled.addActivity('Deleted Document', `Deleted ${documentName}`);
    }

    res.json({
      message: 'Document deleted successfully'
    });
  } catch (error) {
    console.error('Delete document error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// =============================================
// ACTIVITY ROUTES
// =============================================

// Get user activity
router.get('/activity', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const userId = req.user.userId || req.user.id;
    const disabled = await Disabled.findById(userId).select('recentActivity');
    
    if (!disabled) {
      return res.status(404).json({ message: 'User not found' });
    }

    const activities = disabled.recentActivity ? disabled.recentActivity
      .slice(skip, skip + limit)
      .map(activity => ({
        action: activity.action,
        description: activity.description,
        date: activity.date ? activity.date.toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        }) : '',
        timestamp: activity.date
      })) : [];

    res.json({
      activities,
      currentPage: page,
      totalActivities: disabled.recentActivity ? disabled.recentActivity.length : 0,
      hasMore: skip + limit < (disabled.recentActivity ? disabled.recentActivity.length : 0)
    });
  } catch (error) {
    console.error('Get activity error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;