const express = require('express');
const router = express.Router();

// Mock data for government schemes (expanded)
const schemes = [
  {
    id: 1,
    name: "Disability Support Grant",
    description: "Financial assistance for individuals with disabilities to cover daily living expenses and support services.",
    type: "Financial Aid",
    disabilityType: "All Disabilities",
    location: "All India",
    ageGroup: "18-60 years",
    benefits: "₹25,000 - ₹50,000 annually",
    deadline: "30 April 2025",
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop",
    eligibility: "Income below ₹3 lakhs annually, valid disability certificate",
    documents: ["Disability certificate", "Income certificate", "Aadhaar card", "Bank passbook"],
    contact: {
      phone: "1800-XXX-XXXX",
      email: "disability.support@gov.in",
      website: "https://disability.gov.in"
    },
    isRecommended: true,
    rating: 4.5,
    applications: 1250
  },
  {
    id: 2,
    name: "Accessible Education Program",
    description: "Scholarships and resources to support students with disabilities in pursuing higher education.",
    type: "Education",
    disabilityType: "All Disabilities",
    location: "All India",
    ageGroup: "16-25 years",
    benefits: "Full tuition fee waiver + monthly stipend",
    deadline: "15 May 2025",
    image: "https://images.unsplash.com/photo-1523240794108-5c1e0c0c8e6f?w=400&h=300&fit=crop",
    eligibility: "Enrolled in recognized institution, disability certificate",
    documents: ["Disability certificate", "Admission letter", "Income certificate", "Marksheets"],
    contact: {
      phone: "1800-XXX-XXXX",
      email: "education.scholarship@gov.in",
      website: "https://education.gov.in"
    },
    isRecommended: true,
    rating: 4.8,
    applications: 890
  },
  {
    id: 3,
    name: "Vocational Training for Disabled",
    description: "Skills development programs to enhance employability and job placement support for individuals with disabilities.",
    type: "Employment",
    disabilityType: "All Disabilities",
    location: "All India",
    ageGroup: "18-45 years",
    benefits: "Free training + placement assistance + ₹10,000 stipend",
    deadline: "1 June 2025",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop",
    eligibility: "Age 18-45, disability certificate, basic education",
    documents: ["Disability certificate", "Educational certificates", "Aadhaar card", "Passport photos"],
    contact: {
      phone: "1800-XXX-XXXX",
      email: "vocational.training@gov.in",
      website: "https://vocational.gov.in"
    },
    isRecommended: true,
    rating: 4.3,
    applications: 650
  },
  {
    id: 4,
    name: "Assistive Technology Grant",
    description: "Financial support for purchasing assistive devices and technology to improve daily living.",
    type: "Technology",
    disabilityType: "Physical Disabilities",
    location: "All India",
    ageGroup: "All ages",
    benefits: "Up to ₹50,000 for devices",
    deadline: "20 May 2025",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop",
    eligibility: "Valid disability certificate, income below ₹5 lakhs",
    documents: ["Disability certificate", "Income certificate", "Device prescription", "Quotations"],
    contact: {
      phone: "1800-XXX-XXXX",
      email: "assistive.tech@gov.in",
      website: "https://assistive.gov.in"
    },
    isRecommended: false,
    rating: 4.6,
    applications: 420
  },
  {
    id: 5,
    name: "Healthcare Support Scheme",
    description: "Comprehensive healthcare coverage and medical assistance for persons with disabilities.",
    type: "Healthcare",
    disabilityType: "All Disabilities",
    location: "All India",
    ageGroup: "All ages",
    benefits: "Free medical treatment + medicines + rehabilitation",
    deadline: "Ongoing",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop",
    eligibility: "Valid disability certificate, BPL status",
    documents: ["Disability certificate", "BPL card", "Aadhaar card", "Medical reports"],
    contact: {
      phone: "1800-XXX-XXXX",
      email: "healthcare.disabled@gov.in",
      website: "https://healthcare.gov.in"
    },
    isRecommended: false,
    rating: 4.4,
    applications: 2100
  },
  {
    id: 6,
    name: "Entrepreneurship Development Program",
    description: "Training and seed funding for disabled individuals to start their own businesses.",
    type: "Business",
    disabilityType: "All Disabilities",
    location: "All India",
    ageGroup: "21-50 years",
    benefits: "₹2,00,000 seed funding + training + mentorship",
    deadline: "10 June 2025",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop",
    eligibility: "Age 21-50, disability certificate, business plan",
    documents: ["Disability certificate", "Business plan", "Educational certificates", "Bank statements"],
    contact: {
      phone: "1800-XXX-XXXX",
      email: "entrepreneurship@gov.in",
      website: "https://entrepreneurship.gov.in"
    },
    isRecommended: false,
    rating: 4.7,
    applications: 320
  },
  {
    id: 7,
    name: "State Disability Pension (Maharashtra)",
    description: "Monthly pension for persons with benchmark disabilities residing in Maharashtra.",
    type: "Financial Aid",
    disabilityType: "All Disabilities",
    location: "Maharashtra",
    ageGroup: "18+ years",
    benefits: "₹1,500 per month",
    deadline: "Ongoing",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&h=300&fit=crop",
    eligibility: "Resident of Maharashtra, disability 40%+, income below state threshold",
    documents: ["Disability certificate", "Residence proof", "Income certificate", "Bank details"],
    contact: { phone: "1800-120-8040", email: "sdp@maharashtra.gov.in", website: "https://maha.gov.in" },
    isRecommended: true,
    rating: 4.2,
    applications: 5400
  },
  {
    id: 8,
    name: "Kerala Barrier-Free Housing Aid",
    description: "Support to retrofit houses with ramps, handrails, and accessible bathrooms.",
    type: "Housing",
    disabilityType: "Physical Disabilities",
    location: "Kerala",
    ageGroup: "All ages",
    benefits: "Up to ₹80,000 for retrofitting",
    deadline: "30 September 2025",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&h=300&fit=crop",
    eligibility: "Kerala resident, certified disability, own/rent house with NOC",
    documents: ["Disability certificate", "Residence proof", "House ownership/rent agreement", "Estimate"],
    contact: { phone: "1800-425-4747", email: "housing.access@kerala.gov.in", website: "https://kerala.gov.in" },
    isRecommended: false,
    rating: 4.1,
    applications: 980
  },
  {
    id: 9,
    name: "Gujarat Accessible Transport Pass",
    description: "Free/discounted public transport passes for persons with disabilities.",
    type: "Transport",
    disabilityType: "All Disabilities",
    location: "Gujarat",
    ageGroup: "All ages",
    benefits: "100% fare waiver on state buses for 40%+ disability",
    deadline: "Ongoing",
    image: "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=400&h=300&fit=crop",
    eligibility: "Disability 40%+, domicile of Gujarat",
    documents: ["Disability certificate", "Domicile certificate", "Photo", "ID proof"],
    contact: { phone: "1800-233-6666", email: "transport.pwd@gujarat.gov.in", website: "https://gsrtc.in" },
    isRecommended: true,
    rating: 4.6,
    applications: 7200
  },
  {
    id: 10,
    name: "Delhi Sign Language Scholarship",
    description: "Scholarship for students with hearing impairment pursuing higher education in Delhi.",
    type: "Education",
    disabilityType: "Hearing Impairment",
    location: "Delhi",
    ageGroup: "17-28 years",
    benefits: "₹60,000 per year + device support",
    deadline: "31 July 2025",
    image: "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?w=400&h=300&fit=crop",
    eligibility: "Enrolled in Delhi institution, hearing impairment 40%+",
    documents: ["Disability certificate", "Admission proof", "Marksheets", "Bank details"],
    contact: { phone: "1800-11-1234", email: "scholarships@delhi.gov.in", website: "https://edudel.nic.in" },
    isRecommended: false,
    rating: 4.5,
    applications: 1250
  },
  {
    id: 11,
    name: "Tamil Nadu Low Vision Assistive Kit",
    description: "Provision of low-vision aids and training for visually impaired persons.",
    type: "Technology",
    disabilityType: "Visual Impairment",
    location: "Tamil Nadu",
    ageGroup: "All ages",
    benefits: "Assistive kit worth up to ₹40,000",
    deadline: "15 August 2025",
    image: "https://images.unsplash.com/photo-1516387938699-a93567ec168e?w=400&h=300&fit=crop",
    eligibility: "Certified visual impairment, domiciled in Tamil Nadu",
    documents: ["Disability certificate", "Domicile", "Doctor prescription", "ID proof"],
    contact: { phone: "1800-425-0111", email: "assistive@tn.gov.in", website: "https://tn.gov.in" },
    isRecommended: true,
    rating: 4.7,
    applications: 1600
  },
  {
    id: 12,
    name: "Uttar Pradesh Inclusive Sports Grant",
    description: "Funding for athletes with disabilities to participate in national events.",
    type: "Sports",
    disabilityType: "All Disabilities",
    location: "Uttar Pradesh",
    ageGroup: "12-35 years",
    benefits: "₹1,00,000 travel + coaching + equipment",
    deadline: "30 June 2025",
    image: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400&h=300&fit=crop",
    eligibility: "State resident, selection proof from sports association",
    documents: ["Residence proof", "Disability certificate", "Selection letter", "Bank details"],
    contact: { phone: "1800-180-5145", email: "sports.pwd@up.gov.in", website: "https://upsports.gov.in" },
    isRecommended: false,
    rating: 4.2,
    applications: 430
  },
  {
    id: 13,
    name: "West Bengal Mental Health Support",
    description: "Free counseling and subsidized medication for persons with mental health conditions.",
    type: "Healthcare",
    disabilityType: "Mental Health Conditions",
    location: "West Bengal",
    ageGroup: "All ages",
    benefits: "Free therapy sessions + 50% medicine subsidy",
    deadline: "Ongoing",
    image: "https://images.unsplash.com/photo-1518131678677-a1ab6220c5a1?w=400&h=300&fit=crop",
    eligibility: "Psychiatric evaluation report, residence proof",
    documents: ["Medical reports", "Residence proof", "ID proof"],
    contact: { phone: "1800-345-0012", email: "mhcare@wb.gov.in", website: "https://wbhealth.gov.in" },
    isRecommended: true,
    rating: 4.4,
    applications: 3100
  },
  {
    id: 14,
    name: "Rajasthan Inclusive Employment Subsidy",
    description: "Wage subsidy to employers hiring persons with disabilities.",
    type: "Employment",
    disabilityType: "All Disabilities",
    location: "Rajasthan",
    ageGroup: "18-50 years",
    benefits: "Up to ₹7,500/month per hire for 12 months",
    deadline: "31 December 2025",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=300&fit=crop",
    eligibility: "Registered firm in Rajasthan, min 1-year contract",
    documents: ["Company registration", "Employee disability certificate", "ESI/EPF records"],
    contact: { phone: "1800-180-6127", email: "employment.pwd@rajasthan.gov.in", website: "https://rajasthan.gov.in" },
    isRecommended: false,
    rating: 4.1,
    applications: 240
  },
  {
    id: 15,
    name: "Telangana Accessible Start-up Seed Fund",
    description: "Seed funding and incubation for founders with disabilities.",
    type: "Business",
    disabilityType: "All Disabilities",
    location: "Telangana",
    ageGroup: "18-45 years",
    benefits: "Seed funding up to ₹5,00,000 + incubation",
    deadline: "15 October 2025",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=300&fit=crop",
    eligibility: "Founder with disability, viable business plan",
    documents: ["Disability certificate", "Pitch deck", "KYC", "Bank details"],
    contact: { phone: "1800-599-0011", email: "startup.pwd@telangana.gov.in", website: "https://ts.gov.in" },
    isRecommended: true,
    rating: 4.8,
    applications: 180
  },
  {
    id: 16,
    name: "Punjab Cochlear Implant Support",
    description: "Financial support for cochlear implant surgery for children.",
    type: "Healthcare",
    disabilityType: "Hearing Impairment",
    location: "Punjab",
    ageGroup: "0-6 years",
    benefits: "Up to ₹6,00,000 towards surgery",
    deadline: "Rolling",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop",
    eligibility: "Child resident of Punjab, medical recommendation",
    documents: ["Birth certificate", "Medical recommendation", "Residence proof", "BPL card (if any)"],
    contact: { phone: "1800-120-2626", email: "health.hearing@punjab.gov.in", website: "https://punjab.gov.in" },
    isRecommended: true,
    rating: 4.9,
    applications: 95
  },
  {
    id: 17,
    name: "Odisha Disability Insurance Premium Aid",
    description: "Government-paid premiums for basic disability insurance plans.",
    type: "Insurance",
    disabilityType: "All Disabilities",
    location: "Odisha",
    ageGroup: "18-60 years",
    benefits: "100% premium paid for approved plans",
    deadline: "30 November 2025",
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=300&fit=crop",
    eligibility: "Resident of Odisha, income threshold",
    documents: ["Disability certificate", "Income certificate", "Residence proof", "KYC"],
    contact: { phone: "1800-345-7158", email: "insurance.pwd@odisha.gov.in", website: "https://odisha.gov.in" },
    isRecommended: false,
    rating: 4.0,
    applications: 870
  },
  {
    id: 18,
    name: "Karnataka Inclusive Higher Education Hostel",
    description: "Accessible hostels and meal stipends for students with disabilities in higher education.",
    type: "Education",
    disabilityType: "All Disabilities",
    location: "Karnataka",
    ageGroup: "17-30 years",
    benefits: "Free accommodation + ₹3,000 monthly stipend",
    deadline: "31 August 2025",
    image: "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?w=400&h=300&fit=crop",
    eligibility: "Enrolled in Karnataka college/university, disability 40%+",
    documents: ["Admission letter", "Disability certificate", "Residence proof", "Bank details"],
    contact: { phone: "1800-425-9000", email: "he.pwd@kar.gov.in", website: "https://karnataka.gov.in" },
    isRecommended: false,
    rating: 4.3,
    applications: 560
  }
];

// GET /api/schemes - Get all schemes
router.get('/', (req, res) => {
  try {
    res.json({
      success: true,
      data: schemes,
      count: schemes.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching schemes',
      error: error.message
    });
  }
});

// GET /api/schemes/filtered - Get filtered schemes
router.get('/filtered', (req, res) => {
  try {
    const { 
      search, 
      disabilityType, 
      location, 
      ageGroup, 
      type,
      page = 1,
      limit = 6
    } = req.query;

    let filteredSchemes = [...schemes];

    if (search) {
      const searchLower = search.toLowerCase();
      filteredSchemes = filteredSchemes.filter(scheme =>
        scheme.name.toLowerCase().includes(searchLower) ||
        scheme.description.toLowerCase().includes(searchLower) ||
        scheme.type.toLowerCase().includes(searchLower)
      );
    }

    if (disabilityType && disabilityType !== 'All Disabilities') {
      filteredSchemes = filteredSchemes.filter(scheme =>
        scheme.disabilityType === disabilityType
      );
    }

    if (location && location !== 'All India') {
      filteredSchemes = filteredSchemes.filter(scheme =>
        scheme.location === location
      );
    }

    if (ageGroup && ageGroup !== 'All Ages') {
      filteredSchemes = filteredSchemes.filter(scheme =>
        scheme.ageGroup === ageGroup
      );
    }

    if (type) {
      filteredSchemes = filteredSchemes.filter(scheme =>
        scheme.type === type
      );
    }

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedSchemes = filteredSchemes.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: paginatedSchemes,
      count: filteredSchemes.length,
      totalPages: Math.ceil(filteredSchemes.length / limit),
      currentPage: parseInt(page)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error filtering schemes',
      error: error.message
    });
  }
});

// GET /api/schemes/recommended - Get recommended schemes
router.get('/recommended', (req, res) => {
  try {
    const recommendedSchemes = schemes.filter(scheme => scheme.isRecommended);
    
    res.json({
      success: true,
      data: recommendedSchemes,
      count: recommendedSchemes.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching recommended schemes',
      error: error.message
    });
  }
});

// GET /api/schemes/:id - Get scheme by ID
router.get('/:id', (req, res) => {
  try {
    const scheme = schemes.find(s => s.id === parseInt(req.params.id));
    
    if (!scheme) {
      return res.status(404).json({
        success: false,
        message: 'Scheme not found'
      });
    }

    res.json({
      success: true,
      data: scheme
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching scheme',
      error: error.message
    });
  }
});

module.exports = router; 