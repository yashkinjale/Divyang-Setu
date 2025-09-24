const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Disabled = require('../../models/Disabled');
const auth = require('../../middleware/auth');
const upload = require('../../middleware/upload');

// Upload profile image
router.post('/profile/image', [auth, upload.single('profileImage')], async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No image file provided' });

    const disabled = await Disabled.findById(req.user.id || req.user.userId);
    if (!disabled) return res.status(404).json({ message: 'User not found' });

    disabled.profileImage = { url: req.file.path, publicId: req.file.filename };
    await disabled.save();
    await disabled.addActivity('Updated Profile Picture', 'Profile picture was changed');

    res.json({ message: 'Profile image uploaded successfully', imageUrl: disabled.profileImage.url });
  } catch (error) {
    console.error('Upload profile image error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Upload document
router.post('/documents', [
  auth,
  upload.single('document'),
  body('name').trim().notEmpty().withMessage('Document name is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    if (!req.file) return res.status(400).json({ message: 'No document file provided' });

    const disabled = await Disabled.findById(req.user.id || req.user.userId);
    if (!disabled) return res.status(404).json({ message: 'User not found' });

    const newDocument = {
      name: req.body.name,
      fileName: req.file.originalname,
      fileUrl: req.file.path,
      status: 'pending'
    };

    disabled.documents.push(newDocument);
    await disabled.save();
    await disabled.addActivity('Uploaded Document', `Uploaded ${req.body.name}`);

    res.json({
      message: 'Document uploaded successfully',
      document: {
        _id: disabled.documents[disabled.documents.length - 1]._id,
        name: newDocument.name,
        status: newDocument.status,
        date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
      }
    });
  } catch (error) {
    console.error('Upload document error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
