const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const jsqr = require("jsqr");
const Tesseract = require("tesseract.js");

const router = express.Router();
const Disabled = require("../models/Disabled");
const auth = require("../middleware/auth");

// 📂 Create upload folder if missing
const uploadDir = path.join(__dirname, "../uploads/pwd");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("Created uploads/pwd folder");
}

// ⚙️ Setup multer for uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({
  storage,
  limits: { fileSize: 7 * 1024 * 1024 }, // 7MB limit
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "application/pdf" ||
      file.mimetype.startsWith("image/")
    ) {
      return cb(null, true);
    }
    return cb(new Error("Unsupported file type"));
  },
});


// 🔍 Extract structured data from OCR text
const extractCertificateData = (text) => {
  const textLower = text.toLowerCase();
  const extracted = {
    certificateNumber: null,
    dateOfIssue: null,
    validTill: null,
    name: null,
    fatherName: null,
    dateOfBirth: null,
    age: null,
    gender: null,
    registrationNumber: null,
    disabilityType: null,
    diagnosis: null,
    disabilityPercentage: null,
    issuingAuthority: null,
    hasGovernmentKeywords: false,
    hasDisabilityKeywords: false,
    hasCertificateKeywords: false,
    hasMedicalKeywords: false,
  };

  // Extract Certificate Number (pattern: State code + digits, e.g., MH2221320070216846)
  const certNumberMatch = text.match(/(?:certificate\s*(?:no|number|#)?[:\s]*)?([A-Z]{2}\d{10,})/i);
  if (certNumberMatch) {
    extracted.certificateNumber = certNumberMatch[1].toUpperCase();
  }

  // Extract Date of Issue (various formats: DD/MM/YYYY, DD-MM-YYYY, etc.)
  const datePatterns = [
    /(?:date\s*of\s*issue|issued?\s*on|date)[:\s]*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i,
    /(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/g,
  ];
  for (const pattern of datePatterns) {
    const match = text.match(pattern);
    if (match) {
      extracted.dateOfIssue = match[1];
      break;
    }
  }

  // Extract Valid Till date
  const validTillMatch = text.match(/(?:valid\s*(?:till|until|upto)|expir(?:y|es))[:\s]*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i);
  if (validTillMatch) {
    extracted.validTill = validTillMatch[1];
  }

  // Extract Name (look for "Name of Person with Disability" or similar)
  const namePatterns = [
    /(?:name\s*of\s*person\s*with\s*disability|name)[:\s]*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)/i,
    /(?:shri|smt|mr|mrs|ms)[.\s]+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)/i,
  ];
  for (const pattern of namePatterns) {
    const match = text.match(pattern);
    if (match && match[1].length > 3) {
      extracted.name = match[1].trim();
      break;
    }
  }

  // Extract Father's Name
  const fatherMatch = text.match(/(?:son\s*of|daughter\s*of|father|father['']s\s*name)[:\s]*(?:shri|smt|mr|mrs|ms)?[.\s]*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/i);
  if (fatherMatch) {
    extracted.fatherName = fatherMatch[1].trim();
  }

  // Extract Date of Birth
  const dobMatch = text.match(/(?:date\s*of\s*birth|dob|born\s*on)[:\s]*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i);
  if (dobMatch) {
    extracted.dateOfBirth = dobMatch[1];
  }

  // Extract Age
  const ageMatch = text.match(/(?:age)[:\s]*(\d{1,3})/i);
  if (ageMatch) {
    extracted.age = parseInt(ageMatch[1]);
  }

  // Extract Gender
  const genderMatch = text.match(/(?:gender|sex)[:\s]*(male|female|m|f|other)/i);
  if (genderMatch) {
    extracted.gender = genderMatch[1];
  }

  // Extract Registration Number
  const regMatch = text.match(/(?:registration\s*(?:no|number|#)?|reg\s*no)[:\s]*([A-Z0-9\/]+)/i);
  if (regMatch) {
    extracted.registrationNumber = regMatch[1];
  }

  // Extract Disability Type
  const disabilityTypePatterns = [
    /(?:case\s*of|type\s*of\s*disability|disability\s*type)[:\s]*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/i,
    /(specific\s*learning\s*disabilities?|locomotor|visual|hearing|intellectual|mental|autism|multiple)/i,
  ];
  for (const pattern of disabilityTypePatterns) {
    const match = text.match(pattern);
    if (match) {
      extracted.disabilityType = match[1] || match[0];
      break;
    }
  }

  // Extract Diagnosis
  const diagnosisMatch = text.match(/(?:diagnosis)[:\s]*([A-Z][A-Z\s,]+)/);
  if (diagnosisMatch) {
    extracted.diagnosis = diagnosisMatch[1].trim();
  }

  // Extract Disability Percentage
  const percentageMatch = text.match(/(?:percentage\s*of\s*disability|disability\s*percentage|percent)[:\s]*(\d{1,3})\s*%/i);
  if (percentageMatch) {
    extracted.disabilityPercentage = parseInt(percentageMatch[1]);
  }

  // Extract Issuing Authority
  const authorityPatterns = [
    /(?:issuing\s*authority|hospital|medical\s*authority)[:\s]*([A-Z][A-Za-z\s,]+(?:hospital|hospital|authority|department))/i,
    /(dr\.?\s+[A-Z][a-z]+\s+[A-Z][a-z]+\s+(?:hospital|medical|municipal|general))/i,
  ];
  for (const pattern of authorityPatterns) {
    const match = text.match(pattern);
    if (match) {
      extracted.issuingAuthority = match[1] || match[0];
      break;
    }
  }

  // Check for required keywords
  const governmentKeywords = [
    "government of india",
    "govt of india",
    "ministry",
    "department",
    "empowerment of persons with disabilities",
  ];
  extracted.hasGovernmentKeywords = governmentKeywords.some(k => textLower.includes(k));

  const disabilityKeywords = [
    "disability",
    "disabled",
    "pwd",
    "persons with disabilities",
    "empowerment of persons",
  ];
  extracted.hasDisabilityKeywords = disabilityKeywords.some(k => textLower.includes(k));

  const certificateKeywords = ["certificate", "certification", "certify"];
  extracted.hasCertificateKeywords = certificateKeywords.some(k => textLower.includes(k));

  const medicalKeywords = ["medical", "hospital", "doctor", "authority", "dr.", "physician"];
  extracted.hasMedicalKeywords = medicalKeywords.some(k => textLower.includes(k));

  return extracted;
};

// ✅ Validate extracted certificate data
const validateCertificateData = (extractedData) => {
  const errors = [];
  const warnings = [];

  // REQUIRED FIELDS - Must have these for approval
  if (!extractedData.hasGovernmentKeywords) {
    errors.push("Missing Government of India/Department keywords");
  }

  if (!extractedData.hasDisabilityKeywords) {
    errors.push("Missing disability-related keywords");
  }

  if (!extractedData.hasCertificateKeywords) {
    errors.push("Missing certificate keywords");
  }

  // Certificate number is highly important
  if (!extractedData.certificateNumber) {
    errors.push("Certificate number not found");
  } else if (!/[A-Z]{2}\d{10,}/.test(extractedData.certificateNumber)) {
    errors.push("Invalid certificate number format");
  }

  // Disability percentage is required
  if (!extractedData.disabilityPercentage) {
    errors.push("Disability percentage not found");
  } else if (extractedData.disabilityPercentage < 1 || extractedData.disabilityPercentage > 100) {
    errors.push("Invalid disability percentage");
  }

  // Name is required
  if (!extractedData.name || extractedData.name.length < 3) {
    errors.push("Name of person with disability not found");
  }

  // Date of issue is important
  if (!extractedData.dateOfIssue) {
    warnings.push("Date of issue not found");
  }

  // Medical/Authority keywords
  if (!extractedData.hasMedicalKeywords) {
    warnings.push("Medical authority keywords not found");
  }

  // Calculate validation score
  let score = 0;
  const maxScore = 8;

  if (extractedData.hasGovernmentKeywords) score++;
  if (extractedData.hasDisabilityKeywords) score++;
  if (extractedData.hasCertificateKeywords) score++;
  if (extractedData.hasMedicalKeywords) score++;
  if (extractedData.certificateNumber) score++;
  if (extractedData.disabilityPercentage) score++;
  if (extractedData.name) score++;
  if (extractedData.dateOfIssue) score++;

  const isValid = errors.length === 0 && score >= 6;

  return {
    isValid,
    score,
    maxScore,
    scorePercentage: Math.round((score / maxScore) * 100),
    errors,
    warnings,
    extractedData,
  };
};

// 🔍 Helper: Check if text contains PWD certificate keywords (legacy function)
const isPWDCertificate = (text) => {
  const extracted = extractCertificateData(text);
  const validation = validateCertificateData(extracted);
  return validation.isValid;
};

// 🔍 Helper: Perform OCR on image file with multiple attempts using Sharp
const performOCR = async (imagePath) => {
  try {
    console.log("🔍 Starting OCR processing...");
    
    // Verify file exists
    if (!fs.existsSync(imagePath)) {
      throw new Error("Image file not found");
    }

    // Get image metadata
    let metadata;
    try {
      metadata = await sharp(imagePath).metadata();
      console.log(`📸 Image info: ${metadata.width}x${metadata.height}, format: ${metadata.format}`);
    } catch (error) {
      console.error("❌ Image metadata error:", error);
      throw new Error("Unable to read image file. Please ensure it's a valid image format.");
    }
    
    // Try multiple preprocessing strategies for better results
    const strategies = [
      // Strategy 1: Standard preprocessing (greyscale + normalize)
      async () => {
        const processedPath = imagePath.replace(/\.[^.]+$/, '_processed_0.png');
        await sharp(imagePath)
          .greyscale()
          .normalise()
          .toFile(processedPath);
        return processedPath;
      },
      
      // Strategy 2: High contrast
      async () => {
        const processedPath = imagePath.replace(/\.[^.]+$/, '_processed_1.png');
        await sharp(imagePath)
          .greyscale()
          .linear(1.5, -(128 * 0.5)) // Increase contrast
          .normalise()
          .toFile(processedPath);
        return processedPath;
      },
      
      // Strategy 3: Threshold (binary) - good for clear text
      async () => {
        const processedPath = imagePath.replace(/\.[^.]+$/, '_processed_2.png');
        await sharp(imagePath)
          .greyscale()
          .normalise()
          .linear(1.2, 0)
          .toFile(processedPath);
        return processedPath;
      },
    ];
    
    let bestResult = { text: "", confidence: 0 };
    
    // Try each preprocessing strategy
    for (let i = 0; i < strategies.length; i++) {
      let processedPath = null;
      try {
        processedPath = await strategies[i]();
        console.log(`📸 Trying preprocessing strategy ${i + 1}...`);
        
        // Perform OCR with Tesseract
        const { data: { text, confidence } } = await Tesseract.recognize(
          processedPath,
          "eng",
          {
            logger: (m) => {
              if (m.status === "recognizing text" && i === 0) {
                console.log(`OCR Progress: ${Math.round(m.progress * 100)}%`);
              }
            },
          }
        );
        
        // Clean up processed image
        if (processedPath && fs.existsSync(processedPath)) {
          try {
            fs.unlinkSync(processedPath);
          } catch (err) {
            console.warn(`⚠️ Could not delete ${processedPath}:`, err.message);
          }
        }
        
        // Keep the best result
        if (confidence > bestResult.confidence && text.trim().length > bestResult.text.trim().length) {
          bestResult = { text, confidence };
          console.log(`✨ New best result from strategy ${i + 1}: confidence=${Math.round(confidence)}%, text_length=${text.length}`);
        }
      } catch (err) {
        console.warn(`⚠️ Strategy ${i + 1} failed:`, err.message);
        // Clean up on error
        if (processedPath && fs.existsSync(processedPath)) {
          try {
            fs.unlinkSync(processedPath);
          } catch {}
        }
      }
    }
    
    console.log(`✅ OCR completed. Best confidence: ${Math.round(bestResult.confidence)}%`);
    console.log(`📄 Extracted text length: ${bestResult.text.length} characters`);
    
    return bestResult;
  } catch (error) {
    console.error("❌ OCR Error:", error);
    // Don't throw - return empty result so we can fall back to manual review
    return { text: "", confidence: 0, error: error.message };
  }
};

// 🧠 POST route: Verify PWD Certificate with OCR
router.post("/verify", auth, upload.single("file"), async (req, res) => {
  let filePath = null;
  
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    filePath = req.file.path;
    const userId = req.user.userId || req.user.id;

    console.log("📤 File uploaded:", req.file.originalname);
    console.log("📁 File type:", req.file.mimetype);
    console.log("📏 File size:", (req.file.size / 1024).toFixed(2), "KB");

    // Handle PDF files - for now, reject PDFs and ask for image
    // (PDF support can be added later with pdf-poppler or similar)
    if (req.file.mimetype === "application/pdf") {
      try {
        fs.unlinkSync(filePath);
      } catch {}
      
      return res.status(400).json({
        success: false,
        message: "PDF files are not supported yet. Please upload a clear image (JPG/PNG) of your certificate.",
      });
    }

    // Perform OCR on the image
    console.log("🔍 Performing OCR analysis...");
    let ocrResult;
    try {
      ocrResult = await performOCR(filePath);
    } catch (ocrError) {
      console.warn("⚠️ OCR failed, sending for manual review:", ocrError.message);
      ocrResult = { text: "", confidence: 0, error: ocrError.message };
    }

    const { text, confidence } = ocrResult;
    const hasLowConfidence = confidence < 30;
    const hasLittleText = !text || text.trim().length < 30;

    // If OCR failed or confidence is very low, send for manual review
    if (hasLittleText || hasLowConfidence) {
      console.log("⚠️ Low OCR quality detected. Sending for manual review...");
      console.log(`   Confidence: ${Math.round(confidence)}%, Text length: ${text?.length || 0}`);
      
      // Still try basic keyword check to see if it might be a certificate
      let mightBeCertificate = false;
      if (text && text.trim().length > 0) {
        const textLower = text.toLowerCase();
        const basicKeywords = [
          "certificate", "disability", "government", "india", "ministry", 
          "pwd", "hospital", "medical", "authority"
        ];
        const foundKeywords = basicKeywords.filter(kw => textLower.includes(kw));
        mightBeCertificate = foundKeywords.length >= 2;
      }

      // Clean up uploaded file
      try {
        fs.unlinkSync(filePath);
      } catch {}

      // Update user status to pending manual review
      try {
        await Disabled.findByIdAndUpdate(
          userId,
          {
            $set: {
              verificationStatus: "pending",
              isVerified: false,
            },
            $push: {
              recentActivity: {
                $each: [
                  {
                    action: "PWD Verification",
                    description: "Certificate submitted for manual review (low image quality or unclear photo)",
                    date: new Date(),
                    metadata: {
                      ocrConfidence: Math.round(confidence),
                      textLength: text?.length || 0,
                      reason: "Low OCR quality - manual review required",
                    },
                  },
                ],
                $position: 0,
                $slice: 20,
              },
            },
          }
        );
      } catch (e) {
        console.warn("⚠️ Could not update verification status:", e.message);
      }

      return res.json({
        success: true,
        status: "pending_manual",
        message: mightBeCertificate
          ? "Your certificate has been submitted for manual review. Our team will verify it within 24-48 hours. You'll be notified once verification is complete."
          : "The image quality is low, but your document has been submitted for manual review. Our team will verify it within 24-48 hours. Please ensure you upload a clear photo next time for faster processing.",
        requiresManualReview: true,
        reason: hasLowConfidence ? "Low OCR confidence" : "Insufficient text extracted",
      });
    }

    // Extract structured data from OCR text
    console.log("📊 Extracting certificate data...");
    const extractedData = extractCertificateData(text);

    // Validate the extracted data
    console.log("✅ Validating certificate data...");
    const validation = validateCertificateData(extractedData);

    console.log("📋 Validation Results:", {
      isValid: validation.isValid,
      score: `${validation.score}/${validation.maxScore} (${validation.scorePercentage}%)`,
      errors: validation.errors,
      warnings: validation.warnings,
      extractedFields: {
        certificateNumber: extractedData.certificateNumber,
        name: extractedData.name,
        disabilityPercentage: extractedData.disabilityPercentage,
        disabilityType: extractedData.disabilityType,
      },
    });

    // Clean up uploaded file
    try {
      fs.unlinkSync(filePath);
    } catch {}

    // If validation fails but we have some certificate-like content, send for manual review
    // Only reject if it's clearly not a certificate (very low score, no keywords at all)
    if (!validation.isValid) {
      const hasSomeCertificateIndicators = 
        validation.score >= 3 || // At least 3/8 indicators
        extractedData.hasGovernmentKeywords ||
        extractedData.hasDisabilityKeywords ||
        extractedData.hasCertificateKeywords;

      if (hasSomeCertificateIndicators) {
        // Send for manual review instead of rejecting
        console.log("⚠️ Validation failed but has certificate indicators. Sending for manual review...");
        
        try {
          await Disabled.findByIdAndUpdate(
            userId,
            {
              $set: {
                verificationStatus: "pending",
                isVerified: false,
              },
              $push: {
                recentActivity: {
                  $each: [
                    {
                      action: "PWD Verification",
                      description: "Certificate submitted for manual review (validation score insufficient)",
                      date: new Date(),
                      metadata: {
                        validationScore: validation.scorePercentage,
                        errors: validation.errors,
                        certificateNumber: extractedData.certificateNumber,
                      },
                    },
                  ],
                  $position: 0,
                  $slice: 20,
                },
              },
            }
          );
        } catch (e) {
          console.warn("⚠️ Could not update verification status:", e.message);
        }

        return res.json({
          success: true,
          status: "pending_manual",
          message: "Your certificate has been submitted for manual review. Our team will verify it within 24-48 hours. You'll be notified once verification is complete.",
          requiresManualReview: true,
          reason: "Some required fields could not be automatically extracted",
          details: {
            score: `${validation.score}/${validation.maxScore}`,
            scorePercentage: validation.scorePercentage,
            extractedFields: {
              certificateNumber: extractedData.certificateNumber,
              name: extractedData.name,
              disabilityPercentage: extractedData.disabilityPercentage,
            },
          },
        });
      } else {
        // Clearly not a certificate - reject
        return res.status(400).json({
          success: false,
          status: "rejected",
          message: "The uploaded document does not appear to be a valid PWD certificate. Please upload a clear photo of your official disability certificate.",
          details: {
            score: `${validation.score}/${validation.maxScore}`,
            scorePercentage: validation.scorePercentage,
            errors: validation.errors,
          },
        });
      }
    }

    // Certificate is valid - approve and verify user
    console.log("✅ Certificate validated successfully!");
    
    try {
      await Disabled.findByIdAndUpdate(
        userId,
        {
          $set: {
            isVerified: true,
            verificationStatus: "verified",
            // Store extracted certificate data for reference
            certificateData: {
              certificateNumber: extractedData.certificateNumber,
              disabilityPercentage: extractedData.disabilityPercentage,
              disabilityType: extractedData.disabilityType,
              dateOfIssue: extractedData.dateOfIssue,
              validTill: extractedData.validTill,
              verifiedAt: new Date(),
            },
          },
          $push: {
            recentActivity: {
              $each: [
                {
                  action: "PWD Verification",
                  description: `Certificate verified successfully. Certificate No: ${extractedData.certificateNumber || "N/A"}`,
                  date: new Date(),
                  metadata: {
                    certificateNumber: extractedData.certificateNumber,
                    disabilityPercentage: extractedData.disabilityPercentage,
                    validationScore: validation.scorePercentage,
                  },
                },
              ],
              $position: 0,
              $slice: 20,
            },
          },
        },
        { new: true }
      );

      console.log("✅ User verification status updated");
    } catch (e) {
      console.warn("⚠️ Could not update verification status:", e.message);
    }

    return res.json({
      success: true,
      status: "verified",
      message: "Certificate verified successfully! Your account is now verified.",
      certificateData: {
        certificateNumber: extractedData.certificateNumber,
        name: extractedData.name,
        disabilityPercentage: extractedData.disabilityPercentage,
        disabilityType: extractedData.disabilityType,
        validationScore: validation.scorePercentage,
      },
    });
  } catch (error) {
    // Clean up file on error
    if (filePath) {
      try {
        fs.unlinkSync(filePath);
      } catch {}
    }

    console.error("❌ Verification Error:", error);
    
    // On any error, try to send for manual review instead of rejecting
    const userId = req.user?.userId || req.user?.id;
    if (userId) {
      try {
        await Disabled.findByIdAndUpdate(
          userId,
          {
            $set: {
              verificationStatus: "pending",
              isVerified: false,
            },
            $push: {
              recentActivity: {
                $each: [
                  {
                    action: "PWD Verification",
                    description: "Certificate submitted for manual review (processing error occurred)",
                    date: new Date(),
                    metadata: {
                      error: error.message,
                    },
                  },
                ],
                $position: 0,
                $slice: 20,
              },
            },
          }
        );
      } catch (e) {
        console.warn("⚠️ Could not update verification status:", e.message);
      }
    }
    
    const errorMessage = error.message || "Server error during verification";
    
    // Return success with manual review status instead of error
    return res.json({
      success: true,
      status: "pending_manual",
      message: "An error occurred during automatic verification, but your certificate has been submitted for manual review. Our team will verify it within 24-48 hours.",
      requiresManualReview: true,
      reason: "Processing error - manual review required",
    });
  }
});

module.exports = router;