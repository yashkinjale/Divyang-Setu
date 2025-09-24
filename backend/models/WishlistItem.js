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

// Virtual for progress percentage
wishlistItemSchema.virtual('progress').get(function() {
  if (this.amountRequired === 0) return 0;
  return Math.min(Math.round((this.amountRaised / this.amountRequired) * 100), 100);
});

// Virtual for completion status
wishlistItemSchema.virtual('isCompleted').get(function() {
  return this.amountRaised >= this.amountRequired || this.status === 'completed';
});

module.exports = mongoose.model('WishlistItem', wishlistItemSchema);