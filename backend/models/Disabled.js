// models/Disabled.js (Updated to match your existing structure)
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const documentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  fileName: String,
  fileUrl: String,
  status: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  },
  uploadDate: {
    type: Date,
    default: Date.now
  },
  verifiedDate: Date,
  rejectionReason: String
});

const activitySchema = new mongoose.Schema({
  action: {
    type: String,
    required: true
  },
  description: String,
  date: {
    type: Date,
    default: Date.now
  },
  metadata: mongoose.Schema.Types.Mixed
});

const disabledSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    trim: true
  },
  disabilityType: {
    type: String,
    required: true,
    trim: true
  },
  needs: {
    type: String,
    required: true,
    trim: true
  },
  education: {
    type: String,
    trim: true
  },
  occupation: {
    type: String,
    trim: true
  },
  profileImage: {
    url: String,
    publicId: String
  },
  documents: [documentSchema],
  recentActivity: [activitySchema],
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Password hashing middleware
disabledSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Password comparison method
disabledSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Virtual for profile completion percentage
disabledSchema.virtual('profileCompletionPercentage').get(function() {
  let completedFields = 0;
  const totalFields = 9;
  
  if (this.name) completedFields++;
  if (this.email) completedFields++;
  if (this.phone) completedFields++;
  if (this.address) completedFields++;
  if (this.disabilityType) completedFields++;
  if (this.needs) completedFields++;
  if (this.education) completedFields++;
  if (this.occupation) completedFields++;
  if (this.profileImage && this.profileImage.url) completedFields++;
  
  return Math.round((completedFields / totalFields) * 100);
});

// Method to add activity
disabledSchema.methods.addActivity = function(action, description, metadata) {
  this.recentActivity.unshift({
    action,
    description,
    metadata
  });
  
  // Keep only last 20 activities
  if (this.recentActivity.length > 20) {
    this.recentActivity = this.recentActivity.slice(0, 20);
  }
  
  return this.save();
};

module.exports = mongoose.model('Disabled', disabledSchema);