const express = require('express');
const axios = require('axios');
const router = express.Router();

// JSearch API Configuration
const JSEARCH_API_URL = 'https://jsearch.p.rapidapi.com/search';
// Read the key at runtime to reflect env changes without process restart or import order issues
const getRapidApiKey = () => process.env.JSEARCH_API_KEY;

// Broader search terms that are more likely to return results
const INCLUSIVE_SEARCH_TERMS = [
  'software developer',
  'data analyst', 
  'customer service',
  'content writer',
  'digital marketing',
  'accountant',
  'human resources',
  'project manager',
  'graphic designer',
  'sales representative'
];

// Keywords to identify potentially inclusive jobs
const INCLUSIVE_KEYWORDS = [
  'equal opportunity', 'diversity', 'inclusion', 'accessible', 'accommodation',
  'flexible', 'remote', 'work from home', 'inclusive', 'disability friendly',
  'reasonable accommodation', 'ada compliant', 'barrier free'
];

// Accessibility-specific keyword groups for feature detection
const ACCESSIBILITY_KEYWORDS = {
  wheelchairAccessible: ['wheelchair', 'wheel chair', 'barrier-free', 'barrier free', 'accessible workplace', 'ramp access', 'ada compliant', 'lift access'],
  signLanguageSupport: ['sign language', 'asl', 'isl', 'interpreters', 'interpreter available', 'indian sign language'],
  colorblindFriendlyUI: ['colorblind', 'color blind', 'high contrast', 'accessible color', 'wcag', 'contrast ratio'],
  inclusiveHiring: ['inclusive hiring', 'equal opportunity', 'eo employer', 'diversity hiring', 'diversity & inclusion', 'inclusive culture'],
};

// Simple in-memory cache to reduce upstream calls
const CACHE_TTL_MS = parseInt(process.env.JOBS_CACHE_TTL_MS || '180000', 10); // 3 minutes
const jobsCache = new Map(); // key -> { expiry, payload }

function buildCacheKey(params) {
  return JSON.stringify(params);
}

function getFromCache(params) {
  const key = buildCacheKey(params);
  const cached = jobsCache.get(key);
  if (!cached) return null;
  if (Date.now() > cached.expiry) {
    jobsCache.delete(key);
    return null;
  }
  return cached.payload;
}

function saveToCache(params, payload) {
  const key = buildCacheKey(params);
  jobsCache.set(key, { expiry: Date.now() + CACHE_TTL_MS, payload });
}

function parseBoolean(value) {
  if (value === undefined || value === null) return false;
  const str = String(value).toLowerCase();
  return str === 'true' || str === '1' || str === 'yes' || str === 'on';
}

/**
 * GET /api/jobs
 * Fetch job listings from JSearch API with broader search strategy
 */
router.get('/', async (req, res) => {
  try {
    const {
      query,
      location = 'India',
      page = '1',
      // Keep backend fast; fewer pages by default
      num_pages = '1',
      wheelchair_accessible,
      remote_friendly,
      inclusive_hiring,
      sign_language_support,
      colorblind_friendly_ui
    } = req.query;

    console.log(`Fetching jobs for location: "${location}"`);

    // Fast path: if no API key configured, return mock data immediately
    if (!getRapidApiKey()) {
      const mockJobs = getEnhancedMockJobs();
      return res.json({
        success: true,
        count: mockJobs.length,
        jobs: mockJobs,
        location,
        note: 'Using mock data (missing JSEARCH_API_KEY)'
      });
    }

    // Build normalized filter params (also used as cache key)
    const filterParams = {
      query: query || '',
      location,
      page,
      num_pages,
      wheelchair_accessible: parseBoolean(wheelchair_accessible),
      remote_friendly: parseBoolean(remote_friendly),
      inclusive_hiring: parseBoolean(inclusive_hiring),
      sign_language_support: parseBoolean(sign_language_support),
      colorblind_friendly_ui: parseBoolean(colorblind_friendly_ui)
    };

    // Cache lookup
    const cached = getFromCache(filterParams);
    if (cached) {
      return res.json(cached);
    }

    let allJobs = [];

    // If specific query provided, use it
    if (query && query !== 'disability inclusive') {
      const jobs = await fetchJobsFromJSearch(query, location, page, num_pages);
      allJobs = jobs;
    } else {
      // Use multiple broader search terms to get more results
      console.log('Using multiple search terms to get more inclusive jobs...');
      
      // Fetch jobs using different search terms (limit concurrency for responsiveness)
      const searchPromises = INCLUSIVE_SEARCH_TERMS.slice(0, 3).map(searchTerm =>
        fetchJobsFromJSearch(`${searchTerm} ${location}`, '', '1', '1')
      );

      const jobsArrays = await Promise.allSettled(searchPromises);
      
      // Combine all successful results
      jobsArrays.forEach((result, index) => {
        if (result.status === 'fulfilled' && result.value) {
          console.log(`Search term "${INCLUSIVE_SEARCH_TERMS[index]}" returned ${result.value.length} jobs`);
          allJobs = allJobs.concat(result.value);
        }
      });

      // Remove duplicates based on job_id
      allJobs = removeDuplicateJobs(allJobs);
      
      // Prioritize jobs with inclusive keywords
      allJobs = prioritizeInclusiveJobs(allJobs);
    }

    console.log(`Total unique jobs fetched: ${allJobs.length}`);

    // If upstream returned nothing, fall back to mock jobs to avoid empty UI
    if (!allJobs.length) {
      const mockJobs = getEnhancedMockJobs();
      const payload = {
        success: true,
        count: mockJobs.length,
        jobs: mockJobs,
        location,
        note: 'Using mock data due to no results from upstream'
      };
      saveToCache(filterParams, payload);
      return res.json(payload);
    }

    // Transform job data and compute accessibility flags
    const transformedJobs = allJobs.slice(0, 50).map((job, index) => {
      const base = {
        id: job.job_id || `job-${Date.now()}-${index}`,
        title: job.job_title || 'Job Title Not Available',
        company: job.employer_name || 'Company Not Available',
        location: job.job_city ? `${job.job_city}, ${job.job_country || 'India'}` : (job.job_country || 'India'),
        salary: formatSalary(job.job_salary),
        logo: job.employer_logo || '',
        type: job.job_employment_type || 'Full-time',
        description: job.job_description || 'No description available',
        applyUrl: job.job_apply_link || null,
        postedDate: job.job_posted_at_datetime_utc || null,
        isRemote: Boolean(job.job_is_remote),
      };

      const tags = generateAccessibilityTags(job);
      const accessibility = generateAccessibilityFeatures(job);
      const flags = detectAccessibilityFlags(job, tags, accessibility, base.isRemote);

      return {
        ...base,
        tags,
        accessibility,
        inclusivityScore: calculateInclusivityScore(job) + flagsScoreBonus(flags),
        accessibilityFlags: flags,
      };
    });

    // Sort by inclusivity score (higher first)
    transformedJobs.sort((a, b) => b.inclusivityScore - a.inclusivityScore);

    // Apply accessibility filters
    const filteredJobs = transformedJobs.filter((job) => {
      if (parseBoolean(wheelchair_accessible) && !job.accessibilityFlags.wheelchairAccessible) return false;
      if (parseBoolean(remote_friendly) && !job.accessibilityFlags.remoteFriendly) return false;
      if (parseBoolean(inclusive_hiring) && !job.accessibilityFlags.inclusiveHiring) return false;
      if (parseBoolean(sign_language_support) && !job.accessibilityFlags.signLanguageSupport) return false;
      if (parseBoolean(colorblind_friendly_ui) && !job.accessibilityFlags.colorblindFriendlyUI) return false;
      return true;
    });

    const outgoingJobs = filteredJobs.length > 0 ? filteredJobs : transformedJobs;

    const payload = {
      success: true,
      count: outgoingJobs.length,
      jobs: outgoingJobs,
      searchStrategy: query ? 'specific' : 'multiple_terms',
      location
    };

    saveToCache(filterParams, payload);
    res.json(payload);

  } catch (error) {
    console.error('Error in jobs route:', error.message);
    
    // Return enhanced mock data
    const mockJobs = getEnhancedMockJobs();
    
    res.json({
      success: true,
      count: mockJobs.length,
      jobs: mockJobs,
      location,
      note: 'Using mock data due to API issues'
    });
  }
});

/**
 * Fetch jobs from JSearch API
 */
async function fetchJobsFromJSearch(query, location, page = '1', num_pages = '1') {
  try {
    const headers = {
      'X-RapidAPI-Key': getRapidApiKey(),
      'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
    };

    const params = {
      query: query,
      page: page,
      num_pages: num_pages,
      date_posted: 'month', // Get jobs from last month
      employment_types: 'FULLTIME,PARTTIME,CONTRACTOR,INTERN'
    };

    // Add location if provided
    if (location) {
      params.country = 'in'; // India
    }

    console.log(`JSearch API call - Query: "${query}", Pages: ${num_pages}`);

    const response = await axios.get(JSEARCH_API_URL, {
      headers,
      params,
      // Keep each upstream call tight so the whole endpoint returns promptly
      timeout: 6000
    });

    const jobs = response.data.data || [];
    console.log(`JSearch returned ${jobs.length} jobs for query: "${query}"`);
    
    return jobs;

  } catch (error) {
    console.error(`JSearch API error for query "${query}":`, error.message);
    return [];
  }
}

/**
 * Remove duplicate jobs based on job_id and similar titles
 */
function removeDuplicateJobs(jobs) {
  const seen = new Set();
  const unique = [];

  jobs.forEach(job => {
    const key = job.job_id || `${job.job_title}-${job.employer_name}`.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(job);
    }
  });

  return unique;
}

/**
 * Prioritize jobs with inclusive keywords
 */
function prioritizeInclusiveJobs(jobs) {
  return jobs.sort((a, b) => {
    const scoreA = calculateInclusivityScore(a);
    const scoreB = calculateInclusivityScore(b);
    return scoreB - scoreA;
  });
}

/**
 * Calculate inclusivity score based on job description
 */
function calculateInclusivityScore(job) {
  let score = 0;
  const description = (job.job_description || '').toLowerCase();
  const title = (job.job_title || '').toLowerCase();
  const company = (job.employer_name || '').toLowerCase();

  // Check for inclusive keywords
  INCLUSIVE_KEYWORDS.forEach(keyword => {
    if (description.includes(keyword)) score += 3;
    if (title.includes(keyword)) score += 2;
    if (company.includes(keyword)) score += 1;
  });

  // Bonus for remote jobs (more accessible)
  if (job.job_is_remote) score += 5;

  // Bonus for part-time/flexible roles
  if (job.job_employment_type === 'PARTTIME') score += 2;

  return score;
}

/**
 * Format salary information
 */
function formatSalary(salary) {
  if (!salary) return 'Salary Not Specified';
  
  // Convert USD to INR if needed (rough conversion)
  if (typeof salary === 'string' && salary.includes('$')) {
    return salary.replace('$', '₹').replace(/(\d+)/g, (match) => {
      return (parseInt(match) * 80).toLocaleString();
    });
  }
  
  return salary;
}

function flagsScoreBonus(flags) {
  let bonus = 0;
  if (flags.remoteFriendly) bonus += 2;
  if (flags.wheelchairAccessible) bonus += 3;
  if (flags.signLanguageSupport) bonus += 2;
  if (flags.colorblindFriendlyUI) bonus += 1;
  if (flags.inclusiveHiring) bonus += 2;
  return bonus;
}

function detectAccessibilityFlags(job, tags = [], accessibility = [], isRemote = false) {
  const description = (job.job_description || '').toLowerCase();
  const title = (job.job_title || '').toLowerCase();
  const company = (job.employer_name || '').toLowerCase();

  const hasAny = (list) => list.some((k) => description.includes(k) || title.includes(k) || company.includes(k));

  const wheelchairAccessible = hasAny(ACCESSIBILITY_KEYWORDS.wheelchairAccessible) || tags.includes('Wheelchair Accessible') || accessibility.join(' ').toLowerCase().includes('wheelchair');
  const signLanguageSupport = hasAny(ACCESSIBILITY_KEYWORDS.signLanguageSupport) || accessibility.join(' ').toLowerCase().includes('sign');
  const colorblindFriendlyUI = hasAny(ACCESSIBILITY_KEYWORDS.colorblindFriendlyUI) || description.includes('wcag');
  const inclusiveHiring = hasAny(ACCESSIBILITY_KEYWORDS.inclusiveHiring) || tags.includes('Equal Opportunity');
  const remoteFriendly = isRemote || description.includes('remote') || description.includes('work from home');

  return {
    wheelchairAccessible,
    signLanguageSupport,
    colorblindFriendlyUI,
    inclusiveHiring,
    remoteFriendly,
  };
}

/**
 * Enhanced mock data with more jobs
 */
function getEnhancedMockJobs() {
  return [
    {
      id: 'mock-1',
      title: 'Frontend Developer',
      company: 'TechSoft Solutions',
      location: 'Mumbai, India',
      salary: '₹8-12 LPA',
      logo: '',
      type: 'Full-time',
      description: 'Join our inclusive tech team. We provide wheelchair accessible workspace, screen reader compatible tools, and flexible working arrangements.',
      tags: ['Remote', 'Wheelchair Accessible', 'Screen Reader Compatible', 'Flexible Hours'],
      accessibility: ['Wheelchair Accessible Workspace', 'Screen Reader Compatible Tools', 'Flexible Working Hours', 'Remote Work Options'],
      applyUrl: null,
      postedDate: new Date().toISOString(),
      isRemote: true,
      inclusivityScore: 15
    },
    {
      id: 'mock-2',
      title: 'Data Analyst',
      company: 'Insight Corp',
      location: 'Bengaluru, India',
      salary: '₹6-10 LPA',
      logo: '',
      type: 'Full-time',
      description: 'Seeking a data analyst for our diverse team. We offer assistive technology support, accessible tools, and equal opportunity employment.',
      tags: ['Hybrid', 'Assistive Technology', 'Equal Opportunity', 'Accessible Tools'],
      accessibility: ['Assistive Technology Support', 'Accessible Data Tools', 'Inclusive Environment', 'Reasonable Accommodations'],
      applyUrl: null,
      postedDate: new Date().toISOString(),
      isRemote: false,
      inclusivityScore: 12
    },
    // Add 8 more diverse mock jobs...
    {
      id: 'mock-3',
      title: 'Digital Marketing Specialist',
      company: 'Growth Marketing Inc',
      location: 'Delhi, India',
      salary: '₹5-8 LPA',
      logo: '',
      type: 'Full-time',
      description: 'Digital marketing role with flexible schedule and remote work options. We welcome diverse candidates and provide necessary accommodations.',
      tags: ['Remote', 'Flexible Schedule', 'Diverse Team', 'Accommodations'],
      accessibility: ['Remote Work', 'Flexible Schedule', 'Accommodation Support', 'Inclusive Culture'],
      applyUrl: null,
      postedDate: new Date().toISOString(),
      isRemote: true,
      inclusivityScore: 14
    }
    // Add more mock jobs as needed...
  ];
}

// Keep your existing helper functions for generateAccessibilityTags and generateAccessibilityFeatures

/**
 * Generate accessibility-related tags based on job data
 */
function generateAccessibilityTags(job) {
  const tags = [];
  const description = (job.job_description || '').toLowerCase();
  
  if (job.job_is_remote) tags.push('Remote');
  
  INCLUSIVE_KEYWORDS.forEach(keyword => {
    if (description.includes(keyword)) {
      switch(keyword) {
        case 'wheelchair':
        case 'accessible':
          tags.push('Wheelchair Accessible');
          break;
        case 'screen reader':
          tags.push('Screen Reader Compatible');
          break;
        case 'flexible':
          tags.push('Flexible Hours');
          break;
        case 'equal opportunity':
          tags.push('Equal Opportunity');
          break;
        case 'accommodation':
          tags.push('Accommodations Available');
          break;
      }
    }
  });
  
  if (job.job_employment_type) {
    tags.push(job.job_employment_type);
  }
  
  if (tags.length === 0) {
    tags.push('Inclusive Workplace', 'Equal Opportunity');
  }
  
  return [...new Set(tags)].slice(0, 4);
}

/**
 * Generate accessibility features based on job data
 */
function generateAccessibilityFeatures(job) {
  const features = [];
  const description = (job.job_description || '').toLowerCase();
  
  if (job.job_is_remote) {
    features.push('Remote Work Available');
  }
  
  INCLUSIVE_KEYWORDS.forEach(keyword => {
    if (description.includes(keyword)) {
      switch(keyword) {
        case 'wheelchair':
          features.push('Wheelchair Accessible Workspace');
          break;
        case 'screen reader':
          features.push('Screen Reader Compatible Tools');
          break;
        case 'flexible':
          features.push('Flexible Working Hours');
          break;
        case 'accommodation':
          features.push('Reasonable Accommodations');
          break;
        case 'diversity':
          features.push('Diverse and Inclusive Team');
          break;
      }
    }
  });
  
  if (features.length === 0) {
    features.push('Inclusive Environment', 'Equal Opportunity Employer');
  }
  
  return [...new Set(features)];
}

module.exports = router;