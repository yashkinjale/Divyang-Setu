const express = require('express');
const router = express.Router();
const JobPosting = require('../models/JobPosting');
const auth = require('../middleware/auth');

// GET /api/job-postings - Get all active job postings
router.get('/', async (req, res) => {
  try {
    const {
      search,
      location,
      type,
      accessibility,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filters = {};
    
    if (location) {
      filters.location = { $regex: location, $options: 'i' };
    }
    
    if (type) {
      filters.type = type;
    }
    
    if (accessibility) {
      const accessibilityArray = Array.isArray(accessibility) ? accessibility : [accessibility];
      filters.accessibility = { $in: accessibilityArray };
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    let query = JobPosting.findActive();
    
    if (search) {
      query = query.find({ $text: { $search: search } });
    }
    
    if (Object.keys(filters).length > 0) {
      query = query.find(filters);
    }

    const jobs = await query
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('postedBy', 'name email')
      .lean();

    const total = await JobPosting.countDocuments({
      isActive: true,
      applicationDeadline: { $gt: new Date() },
      ...(search ? { $text: { $search: search } } : {}),
      ...filters
    });

    res.json({
      success: true,
      data: jobs,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching job postings:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching job postings',
      error: error.message
    });
  }
});

// GET /api/job-postings/:id - Get single job posting
router.get('/:id', async (req, res) => {
  try {
    const job = await JobPosting.findById(req.params.id)
      .populate('postedBy', 'name email')
      .lean();

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job posting not found'
      });
    }

    res.json({
      success: true,
      data: job
    });
  } catch (error) {
    console.error('Error fetching job posting:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching job posting',
      error: error.message
    });
  }
});

// POST /api/job-postings - Create new job posting (requires authentication)
router.post('/', auth, async (req, res) => {
  try {
    const jobData = {
      ...req.body,
      postedBy: req.user.id
    };

    const job = new JobPosting(jobData);
    await job.save();

    const populatedJob = await JobPosting.findById(job._id)
      .populate('postedBy', 'name email')
      .lean();

    res.status(201).json({
      success: true,
      message: 'Job posting created successfully',
      data: populatedJob
    });
  } catch (error) {
    console.error('Error creating job posting:', error);
    res.status(400).json({
      success: false,
      message: 'Error creating job posting',
      error: error.message
    });
  }
});

// PUT /api/job-postings/:id - Update job posting (requires authentication and ownership)
router.put('/:id', auth, async (req, res) => {
  try {
    const job = await JobPosting.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job posting not found'
      });
    }

    // Check if user owns this job posting
    if (job.postedBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this job posting'
      });
    }

    const updatedJob = await JobPosting.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('postedBy', 'name email');

    res.json({
      success: true,
      message: 'Job posting updated successfully',
      data: updatedJob
    });
  } catch (error) {
    console.error('Error updating job posting:', error);
    res.status(400).json({
      success: false,
      message: 'Error updating job posting',
      error: error.message
    });
  }
});

// DELETE /api/job-postings/:id - Delete job posting (requires authentication and ownership)
router.delete('/:id', auth, async (req, res) => {
  try {
    const job = await JobPosting.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job posting not found'
      });
    }

    // Check if user owns this job posting
    if (job.postedBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this job posting'
      });
    }

    await JobPosting.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Job posting deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting job posting:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting job posting',
      error: error.message
    });
  }
});

// POST /api/job-postings/:id/apply - Apply for a job (increment application count)
router.post('/:id/apply', async (req, res) => {
  try {
    const job = await JobPosting.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job posting not found'
      });
    }

    if (!job.isActive || job.isExpired) {
      return res.status(400).json({
        success: false,
        message: 'This job posting is no longer accepting applications'
      });
    }

    await job.incrementApplicationCount();

    res.json({
      success: true,
      message: 'Application submitted successfully',
      applicationCount: job.applicationCount + 1
    });
  } catch (error) {
    console.error('Error applying for job:', error);
    res.status(500).json({
      success: false,
      message: 'Error applying for job',
      error: error.message
    });
  }
});

// GET /api/job-postings/my-jobs - Get current user's job postings (requires authentication)
router.get('/my-jobs', auth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status = 'all' // all, active, expired
    } = req.query;

    const filters = { postedBy: req.user.id };
    
    if (status === 'active') {
      filters.isActive = true;
      filters.applicationDeadline = { $gt: new Date() };
    } else if (status === 'expired') {
      filters.$or = [
        { isActive: false },
        { applicationDeadline: { $lte: new Date() } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const jobs = await JobPosting.find(filters)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('postedBy', 'name email')
      .lean();

    const total = await JobPosting.countDocuments(filters);

    res.json({
      success: true,
      data: jobs,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching user job postings:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching your job postings',
      error: error.message
    });
  }
});

module.exports = router;

