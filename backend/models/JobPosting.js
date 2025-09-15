const mongoose = require('mongoose');

const jobPostingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  company: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['Full-time', 'Part-time', 'Contract', 'Internship'],
    default: 'Full-time'
  },
  salary: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  requirements: {
    type: String,
    default: ''
  },
  benefits: {
    type: String,
    default: ''
  },
  accessibility: [{
    type: String,
    enum: [
      'Wheelchair Accessible',
      'Remote Friendly',
      'Inclusive Hiring',
      'Sign Language Support',
      'Colorblind Friendly UI',
      'Screen Reader Compatible',
      'Flexible Schedule',
      'Mental Health Support'
    ]
  }],
  contactEmail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  applicationDeadline: {
    type: Date,
    required: true
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Donor', // Assuming companies post jobs through donor accounts
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  logo: {
    type: String,
    default: ''
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  applicationCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for better query performance
jobPostingSchema.index({ title: 'text', company: 'text', description: 'text' });
jobPostingSchema.index({ location: 1 });
jobPostingSchema.index({ type: 1 });
jobPostingSchema.index({ isActive: 1 });
jobPostingSchema.index({ applicationDeadline: 1 });

// Virtual for checking if job is expired
jobPostingSchema.virtual('isExpired').get(function() {
  return new Date() > this.applicationDeadline;
});

// Method to increment application count
jobPostingSchema.methods.incrementApplicationCount = function() {
  this.applicationCount += 1;
  return this.save();
};

// Static method to find active jobs
jobPostingSchema.statics.findActive = function() {
  return this.find({ 
    isActive: true, 
    applicationDeadline: { $gt: new Date() } 
  });
};

// Static method to search jobs
jobPostingSchema.statics.searchJobs = function(query, filters = {}) {
  const searchQuery = {
    isActive: true,
    applicationDeadline: { $gt: new Date() },
    ...filters
  };

  if (query) {
    searchQuery.$text = { $search: query };
  }

  return this.find(searchQuery).sort({ createdAt: -1 });
};

module.exports = mongoose.model('JobPosting', jobPostingSchema);

