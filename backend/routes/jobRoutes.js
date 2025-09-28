const express = require('express');
const axios = require('axios');
const router = express.Router();

// JSearch API Configuration
const JSEARCH_API_URL = 'https://jsearch.p.rapidapi.com/search';
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
const CACHE_TTL_MS = parseInt(process.env.JOBS_CACHE_TTL_MS || '300000', 10); // 5 minutes
const jobsCache = new Map();

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
      num_pages = '1',
      wheelchair_accessible,
      remote_friendly,
      inclusive_hiring,
      sign_language_support,
      colorblind_friendly_ui
    } = req.query;

    console.log(`[JOB API] Request params:`, {
      query,
      location,
      filters: {
        wheelchair_accessible,
        remote_friendly,
        inclusive_hiring,
        sign_language_support,
        colorblind_friendly_ui
      }
    });

    // Build normalized filter params
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

    // Check cache first
    const cached = getFromCache(filterParams);
    if (cached) {
      console.log(`[JOB API] Returning cached results: ${cached.jobs.length} jobs`);
      return res.json(cached);
    }

    let allJobs = [];

    // Check if API key is available
    if (!getRapidApiKey()) {
      console.log(`[JOB API] No API key found, using mock data`);
      const mockJobs = getEnhancedMockJobs();
      const payload = {
        success: true,
        count: mockJobs.length,
        jobs: mockJobs,
        location,
        note: 'Using mock data (missing JSEARCH_API_KEY)'
      };
      saveToCache(filterParams, payload);
      return res.json(payload);
    }

    // Fetch jobs from API
    try {
      if (query && query !== 'disability inclusive') {
        console.log(`[JOB API] Fetching with specific query: "${query}"`);
        allJobs = await fetchJobsFromJSearch(query, location, page, num_pages);
      } else {
        console.log(`[JOB API] Using multiple search terms strategy`);
        
        // Use multiple search terms with limited concurrency
        const searchPromises = INCLUSIVE_SEARCH_TERMS.slice(0, 3).map(searchTerm =>
          fetchJobsFromJSearch(`${searchTerm} ${location}`, '', '1', '1')
            .catch(error => {
              console.error(`[JOB API] Search term "${searchTerm}" failed:`, error.message);
              return [];
            })
        );

        const jobsArrays = await Promise.all(searchPromises);
        
        // Combine all results
        jobsArrays.forEach((jobs, index) => {
          if (jobs && jobs.length > 0) {
            console.log(`[JOB API] Search term "${INCLUSIVE_SEARCH_TERMS[index]}" returned ${jobs.length} jobs`);
            allJobs = allJobs.concat(jobs);
          }
        });
      }

      console.log(`[JOB API] Total jobs before deduplication: ${allJobs.length}`);

      // Remove duplicates and prioritize
      allJobs = removeDuplicateJobs(allJobs);
      allJobs = prioritizeInclusiveJobs(allJobs);

      console.log(`[JOB API] Total unique jobs after processing: ${allJobs.length}`);

    } catch (apiError) {
      console.error(`[JOB API] API fetch failed:`, apiError.message);
      allJobs = [];
    }

    // Fallback to mock data if no results
    if (allJobs.length === 0) {
      console.log(`[JOB API] No API results, using mock data`);
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

    // Transform job data
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

    // Sort by inclusivity score
    transformedJobs.sort((a, b) => b.inclusivityScore - a.inclusivityScore);

    // Apply accessibility filters
    const filteredJobs = transformedJobs.filter((job) => {
      if (filterParams.wheelchair_accessible && !job.accessibilityFlags.wheelchairAccessible) return false;
      if (filterParams.remote_friendly && !job.accessibilityFlags.remoteFriendly) return false;
      if (filterParams.inclusive_hiring && !job.accessibilityFlags.inclusiveHiring) return false;
      if (filterParams.sign_language_support && !job.accessibilityFlags.signLanguageSupport) return false;
      if (filterParams.colorblind_friendly_ui && !job.accessibilityFlags.colorblindFriendlyUI) return false;
      return true;
    });

    const finalJobs = filteredJobs.length > 0 ? filteredJobs : transformedJobs;

    console.log(`[JOB API] Returning ${finalJobs.length} jobs after filtering`);

    const payload = {
      success: true,
      count: finalJobs.length,
      jobs: finalJobs,
      searchStrategy: query ? 'specific' : 'multiple_terms',
      location,
      filtersApplied: Object.entries(filterParams).filter(([k, v]) => v && k !== 'query' && k !== 'location' && k !== 'page' && k !== 'num_pages'),
    };

    saveToCache(filterParams, payload);
    res.json(payload);

  } catch (error) {
    console.error('[JOB API] Unexpected error:', error);
    
    // Always return mock data as fallback
    const mockJobs = getEnhancedMockJobs();
    
    res.json({
      success: true,
      count: mockJobs.length,
      jobs: mockJobs,
      location: req.query.location || 'India',
      note: 'Using mock data due to API error',
      error: error.message
    });
  }
});

/**
 * Fetch jobs from JSearch API with better error handling
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
      date_posted: 'month',
      employment_types: 'FULLTIME,PARTTIME,CONTRACTOR,INTERN'
    };

    if (location && location !== 'India') {
      params.query += ` ${location}`;
    } else {
      params.country = 'in';
    }

    console.log(`[JSEARCH] API call - Query: "${query}", Country: ${params.country || 'global'}`);

    const response = await axios.get(JSEARCH_API_URL, {
      headers,
      params,
      timeout: 8000
    });

    const jobs = response.data?.data || [];
    console.log(`[JSEARCH] Returned ${jobs.length} jobs for query: "${query}"`);
    
    return jobs;

  } catch (error) {
    console.error(`[JSEARCH] API error for query "${query}":`, {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText
    });
    
    // Don't throw, return empty array to allow other searches to continue
    return [];
  }
}

// Rest of your helper functions remain the same...
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

function prioritizeInclusiveJobs(jobs) {
  return jobs.sort((a, b) => {
    const scoreA = calculateInclusivityScore(a);
    const scoreB = calculateInclusivityScore(b);
    return scoreB - scoreA;
  });
}

function calculateInclusivityScore(job) {
  let score = 0;
  const description = (job.job_description || '').toLowerCase();
  const title = (job.job_title || '').toLowerCase();
  const company = (job.employer_name || '').toLowerCase();

  INCLUSIVE_KEYWORDS.forEach(keyword => {
    if (description.includes(keyword)) score += 3;
    if (title.includes(keyword)) score += 2;
    if (company.includes(keyword)) score += 1;
  });

  if (job.job_is_remote) score += 5;
  if (job.job_employment_type === 'PARTTIME') score += 2;

  return score;
}

function formatSalary(salary) {
  if (!salary) return 'Salary Not Specified';
  
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

  return {
    wheelchairAccessible: hasAny(ACCESSIBILITY_KEYWORDS.wheelchairAccessible) || tags.includes('Wheelchair Accessible'),
    signLanguageSupport: hasAny(ACCESSIBILITY_KEYWORDS.signLanguageSupport) || accessibility.join(' ').toLowerCase().includes('sign'),
    colorblindFriendlyUI: hasAny(ACCESSIBILITY_KEYWORDS.colorblindFriendlyUI) || description.includes('wcag'),
    inclusiveHiring: hasAny(ACCESSIBILITY_KEYWORDS.inclusiveHiring) || tags.includes('Equal Opportunity'),
    remoteFriendly: isRemote || description.includes('remote') || description.includes('work from home'),
  };
}

function generateAccessibilityTags(job) {
  const tags = [];
  const description = (job.job_description || '').toLowerCase();
  
  if (job.job_is_remote) tags.push('Remote');
  
  INCLUSIVE_KEYWORDS.forEach(keyword => {
    if (description.includes(keyword)) {
      switch(keyword) {
        case 'wheelchair':
        case 'accessible':
          if (!tags.includes('Wheelchair Accessible')) tags.push('Wheelchair Accessible');
          break;
        case 'screen reader':
          if (!tags.includes('Screen Reader Compatible')) tags.push('Screen Reader Compatible');
          break;
        case 'flexible':
          if (!tags.includes('Flexible Hours')) tags.push('Flexible Hours');
          break;
        case 'equal opportunity':
          if (!tags.includes('Equal Opportunity')) tags.push('Equal Opportunity');
          break;
        case 'accommodation':
          if (!tags.includes('Accommodations Available')) tags.push('Accommodations Available');
          break;
      }
    }
  });
  
  if (job.job_employment_type && !tags.includes(job.job_employment_type)) {
    tags.push(job.job_employment_type);
  }
  
  if (tags.length === 0) {
    tags.push('Inclusive Workplace', 'Equal Opportunity');
  }
  
  return [...new Set(tags)].slice(0, 4);
}

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
          if (!features.includes('Wheelchair Accessible Workspace')) features.push('Wheelchair Accessible Workspace');
          break;
        case 'screen reader':
          if (!features.includes('Screen Reader Compatible Tools')) features.push('Screen Reader Compatible Tools');
          break;
        case 'flexible':
          if (!features.includes('Flexible Working Hours')) features.push('Flexible Working Hours');
          break;
        case 'accommodation':
          if (!features.includes('Reasonable Accommodations')) features.push('Reasonable Accommodations');
          break;
        case 'diversity':
          if (!features.includes('Diverse and Inclusive Team')) features.push('Diverse and Inclusive Team');
          break;
      }
    }
  });
  
  if (features.length === 0) {
    features.push('Inclusive Environment', 'Equal Opportunity Employer');
  }
  
  return [...new Set(features)];
}

/**
 * Enhanced mock data with more realistic jobs
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
      description: 'Join our inclusive tech team building accessible web applications. We provide wheelchair accessible workspace, screen reader compatible development tools, and flexible working arrangements for all team members.',
      tags: ['Remote', 'Wheelchair Accessible', 'Screen Reader Compatible', 'Flexible Hours'],
      accessibility: ['Wheelchair Accessible Workspace', 'Screen Reader Compatible Tools', 'Flexible Working Hours', 'Remote Work Options'],
      applyUrl: null,
      postedDate: new Date().toISOString(),
      isRemote: true,
      inclusivityScore: 18,
      accessibilityFlags: {
        wheelchairAccessible: true,
        signLanguageSupport: false,
        colorblindFriendlyUI: true,
        inclusiveHiring: true,
        remoteFriendly: true
      }
    },
    {
      id: 'mock-2',
      title: 'Data Analyst',
      company: 'Insight Analytics Corp',
      location: 'Bengaluru, India',
      salary: '₹6-10 LPA',
      logo: '',
      type: 'Full-time',
      description: 'Data analyst position in our diverse and inclusive team. We offer assistive technology support, accessible data visualization tools, and comprehensive equal opportunity employment policies.',
      tags: ['Hybrid', 'Assistive Technology', 'Equal Opportunity', 'Accessible Tools'],
      accessibility: ['Assistive Technology Support', 'Accessible Data Tools', 'Inclusive Environment', 'Reasonable Accommodations'],
      applyUrl: null,
      postedDate: new Date().toISOString(),
      isRemote: false,
      inclusivityScore: 15,
      accessibilityFlags: {
        wheelchairAccessible: true,
        signLanguageSupport: true,
        colorblindFriendlyUI: true,
        inclusiveHiring: true,
        remoteFriendly: false
      }
    },
    {
      id: 'mock-3',
      title: 'Digital Marketing Specialist',
      company: 'Growth Marketing Inc',
      location: 'Delhi, India',
      salary: '₹5-8 LPA',
      logo: '',
      type: 'Full-time',
      description: 'Marketing role with complete remote work flexibility and accommodating schedule. We welcome candidates with disabilities and provide all necessary workplace accommodations and assistive technologies.',
      tags: ['Remote', 'Flexible Schedule', 'Diverse Team', 'Accommodations'],
      accessibility: ['Remote Work Available', 'Flexible Schedule', 'Accommodation Support', 'Inclusive Culture'],
      applyUrl: null,
      postedDate: new Date().toISOString(),
      isRemote: true,
      inclusivityScore: 16,
      accessibilityFlags: {
        wheelchairAccessible: false,
        signLanguageSupport: false,
        colorblindFriendlyUI: false,
        inclusiveHiring: true,
        remoteFriendly: true
      }
    },
    {
      id: 'mock-4',
      title: 'Customer Support Representative',
      company: 'HelpDesk Solutions',
      location: 'Pune, India',
      salary: '₹3-5 LPA',
      logo: '',
      type: 'Full-time',
      description: 'Customer support role with sign language interpretation services available and wheelchair accessible office premises. We provide comprehensive training and support for all accessibility needs.',
      tags: ['Sign Language Support', 'Wheelchair Accessible', 'Training Provided'],
      accessibility: ['Sign Language Interpreters', 'Wheelchair Accessible Office', 'Accessibility Training', 'Supportive Environment'],
      applyUrl: null,
      postedDate: new Date().toISOString(),
      isRemote: false,
      inclusivityScore: 14,
      accessibilityFlags: {
        wheelchairAccessible: true,
        signLanguageSupport: true,
        colorblindFriendlyUI: false,
        inclusiveHiring: true,
        remoteFriendly: false
      }
    },
    {
      id: 'mock-5',
      title: 'Content Writer',
      company: 'Creative Content Co',
      location: 'Hyderabad, India',
      salary: '₹4-6 LPA',
      logo: '',
      type: 'Part-time',
      description: 'Flexible content writing position with remote work options and accessible content management systems. Perfect for candidates seeking work-life balance and accommodating schedules.',
      tags: ['Remote', 'Part-time', 'Flexible', 'Accessible CMS'],
      accessibility: ['Remote Work Options', 'Flexible Scheduling', 'Accessible Content Tools', 'Inclusive Workplace'],
      applyUrl: null,
      postedDate: new Date().toISOString(),
      isRemote: true,
      inclusivityScore: 13,
      accessibilityFlags: {
        wheelchairAccessible: false,
        signLanguageSupport: false,
        colorblindFriendlyUI: true,
        inclusiveHiring: true,
        remoteFriendly: true
      }
    }
  ];
}

module.exports = router;