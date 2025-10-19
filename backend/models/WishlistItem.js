const mongoose = require('mongoose');

const supportingDocumentSchema = new mongoose.Schema({
  fileName: {
    type: String,
    required: true
  },
  fileUrl: {
    type: String,
    required: true
  },
  fileType: {
    type: String,
    required: true
  },
  uploadDate: {
    type: Date,
    default: Date.now
  }
});

const wishlistItemSchema = new mongoose.Schema({
  itemName: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Medical', 'Education', 'Mobility', 'Technology', 'Other']
  },
  amountRequired: {
    type: Number,
    required: true,
    min: 0
  },
  amountRaised: {
    type: Number,
    default: 0,
    min: 0
  },
  // ✅ CHANGED FROM VIRTUAL TO ACTUAL FIELD
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  
  quantity: {
    type: Number,
    default: 1,
    min: 1
  },
  urgencyLevel: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  deadline: {
    type: Date
  },
  supportingDocuments: [supportingDocumentSchema],
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled'],
    default: 'active'
  },
  
  // ✅ CHANGED FROM VIRTUAL TO ACTUAL FIELD
  isCompleted: {
    type: Boolean,
    default: false
  },
  
  completedDate: {
    type: Date
  },
  
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Disabled',
    required: true
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

// Pre-save middleware to update progress automatically
wishlistItemSchema.pre('save', function(next) {
  // Always recalculate progress before saving
  if (this.amountRequired > 0) {
    this.progress = Math.min(
      Math.round((this.amountRaised / this.amountRequired) * 100),
      100
    );
  } else {
    this.progress = 0;
  }
  
  // Auto-complete if fully funded
  if (this.amountRaised >= this.amountRequired && !this.isCompleted) {
    this.isCompleted = true;
    this.status = 'completed';
    this.completedDate = new Date();
  }
  
  next();
});

// Static method to calculate and update progress
wishlistItemSchema.statics.updateProgress = async function(itemId) {
  const item = await this.findById(itemId);
  if (item) {
    if (item.amountRequired > 0) {
      item.progress = Math.min(
        Math.round((item.amountRaised / item.amountRequired) * 100),
        100
      );
    }
    
    if (item.amountRaised >= item.amountRequired && !item.isCompleted) {
      item.isCompleted = true;
      item.status = 'completed';
      item.completedDate = new Date();
    }
    
    await item.save();
  }
  return item;
};

module.exports = mongoose.model('WishlistItem', wishlistItemSchema);