// routes/disabled/profileRoutes.js - Debug version with enhanced logging
const express = require("express");
const router = express.Router();
const Disabled = require("../../models/Disabled");
const WishlistItem = require("../../models/WishlistItem");
const auth = require("../../middleware/auth");
const upload = require("../../middleware/upload");
const { body, validationResult } = require("express-validator");

// =============================================
// PROFILE ROUTES - DEBUG VERSION
// =============================================

// NEW: Get all profiles for donor dashboard (public route - no auth required)
router.get("/public", async (req, res) => {
  try {
    console.log("=== PUBLIC PROFILES REQUEST ===");

    // Get query parameters for filtering
    const { search, category, location } = req.query;

    // Build query
    // Show verified profiles by default; also include those marked verified via verificationStatus
    let query = { $or: [ { isVerified: true }, { verificationStatus: "verified" } ] };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { disabilityType: { $regex: search, $options: "i" } },
        { needs: { $regex: search, $options: "i" } },
      ];
    }

    if (location && location !== "all") {
      query.location = { $regex: location, $options: "i" };
    }

    console.log("Query:", query);

    // Fetch disabled users with basic info
    let disabledUsers = await Disabled.find(query)
      .select(
        "name email phone location address disabilityType needs profileImage createdAt"
      )
      .limit(50)
      .sort({ createdAt: -1 });

    // If no results, gracefully fall back to most recent 10 profiles (public preview)
    if (disabledUsers.length === 0) {
      disabledUsers = await Disabled.find({})
        .select(
          "name email phone location address disabilityType needs profileImage createdAt"
        )
        .limit(10)
        .sort({ createdAt: -1 });
    }

    console.log(`Found ${disabledUsers.length} profiles`);

    // Get wishlist items for all users
    const userIds = disabledUsers.map((user) => user._id);
    const wishlistItems = await WishlistItem.find({
      userId: { $in: userIds },
      status: { $ne: "completed" }, // Don't show completed items
    }).sort({ urgencyLevel: -1, createdAt: -1 });

    // Group wishlist items by user
    const wishlistByUser = {};
    wishlistItems.forEach((item) => {
      const userId = item.userId.toString();
      if (!wishlistByUser[userId]) {
        wishlistByUser[userId] = [];
      }
      wishlistByUser[userId].push(item);
    });

    // Format profiles for donor dashboard
    const profiles = disabledUsers.map((user) => {
      const userWishlist = wishlistByUser[user._id.toString()] || [];

      // Calculate totals
      const totalAmountNeeded = userWishlist.reduce(
        (sum, item) => sum + (item.amountRequired || 0),
        0
      );
      const totalAmountRaised = userWishlist.reduce(
        (sum, item) => sum + (item.amountRaised || 0),
        0
      );

      // Determine urgency based on wishlist items
      let urgency = "low";
      if (userWishlist.some((item) => item.urgencyLevel === "High")) {
        urgency = "high";
      } else if (userWishlist.some((item) => item.urgencyLevel === "Medium")) {
        urgency = "medium";
      }

      // Determine category from wishlist items
      let category = "general";
      if (userWishlist.length > 0) {
        const categories = userWishlist.map((item) =>
          item.category?.toLowerCase()
        );
        if (
          categories.includes("technology") ||
          categories.includes("assistive technology")
        ) {
          category = "technology";
        } else if (
          categories.includes("mobility") ||
          categories.includes("wheelchair")
        ) {
          category = "mobility";
        } else if (
          categories.includes("education") ||
          categories.includes("educational")
        ) {
          category = "education";
        }
      }

      return {
        id: user._id,
        name: user.name,
        age: calculateAge(user.createdAt), // Rough estimate
        location: user.location || user.address || "Location not specified",
        disability: user.disabilityType || "Not specified",
        bio: user.bio || "", // <-- NEW FIELD
        needs: Array.isArray(user.needs)
          ? user.needs
          : [user.needs].filter(Boolean),
        story: `I am a person with ${
          user.disabilityType || "disability"
        } seeking support for essential items and services.`,
        goalAmount: totalAmountNeeded || 50000,
        raisedAmount: totalAmountRaised || 0,
        image:
          user.profileImage?.url ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(
            user.name
          )}&background=random`,
        urgency,
        category,
        wishlistItems: userWishlist.map((item) => ({
          id: item._id,
          itemName: item.itemName,
          description: item.description,
          amountRequired: item.amountRequired,
          amountRaised: item.amountRaised,
          urgencyLevel: item.urgencyLevel,
          category: item.category,
        })),
      };
    });

    // Apply category filter if provided
    let filteredProfiles = profiles;
    if (category && category !== "all") {
      filteredProfiles = profiles.filter((p) => p.category === category);
    }

    console.log(`Returning ${filteredProfiles.length} profiles`);
    console.log("=== END PUBLIC PROFILES REQUEST ===");

    res.json({
      success: true,
      count: filteredProfiles.length,
      profiles: filteredProfiles,
    });
  } catch (error) {
    console.error("Error fetching public profiles:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching profiles",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
});

// Helper function to calculate approximate age
function calculateAge(createdDate) {
  // This is a rough estimate - you might want to add a birthDate field to your model
  const monthsSinceCreated = Math.floor(
    (Date.now() - new Date(createdDate).getTime()) / (1000 * 60 * 60 * 24 * 30)
  );
  return 25 + Math.floor(monthsSinceCreated / 12); // Rough estimate starting at 25
}

// Get complete profile data with enhanced debugging
router.get("/", auth, async (req, res) => {
  try {
    console.log("=== PROFILE GET DEBUG ===");
    console.log("1. Auth middleware passed");
    console.log("2. req.user:", JSON.stringify(req.user, null, 2));

    // Handle both userId and id from your existing auth tokens
    const userId = req.user.userId || req.user.id;
    console.log("3. Extracted userId:", userId);

    if (!userId) {
      console.log("❌ No userId found in token");
      return res.status(400).json({
        message: "No user ID found in token",
        debug: {
          tokenPayload: req.user,
        },
      });
    }

    console.log("4. Searching for user with ID:", userId);
    const disabled = await Disabled.findById(userId).select("-password");

    console.log(
      "5. Database query result:",
      disabled ? "User found" : "User not found"
    );

    if (!disabled) {
      console.log("❌ User not found in database");
      console.log("Available users in database:");

      // Let's see what users exist (limit to 5 for safety)
      const allUsers = await Disabled.find({})
        .limit(5)
        .select("_id name email");
      console.log(
        "Sample users:",
        allUsers.map((u) => ({ id: u._id, name: u.name, email: u.email }))
      );

      return res.status(404).json({
        message: "User not found",
        debug: {
          searchedUserId: userId,
          tokenPayload: req.user,
          sampleUserIds: allUsers.map((u) => u._id.toString()),
        },
      });
    }

    console.log("✅ User found:", disabled.name);

    // Get wishlist items for this user
    console.log("6. Fetching wishlist items...");
    const wishlistItems = await WishlistItem.find({ userId }).sort({
      createdAt: -1,
    });
    console.log(`Found ${wishlistItems.length} wishlist items`);

    // Calculate statistics
    const totalWishlistItems = wishlistItems.length;
    const completedItems = wishlistItems.filter(
      (item) => item.isCompleted
    ).length;
    const totalAmountNeeded = wishlistItems.reduce(
      (sum, item) => sum + item.amountRequired,
      0
    );
    const totalAmountRaised = wishlistItems.reduce(
      (sum, item) => sum + item.amountRaised,
      0
    );
    const verifiedDocuments = disabled.documents
      ? disabled.documents.filter((doc) => doc.status === "verified").length
      : 0;

    // Format the response to match your existing frontend expectations
    const profileData = {
      // Basic Information
      id: disabled._id,
      name: disabled.name,
      email: disabled.email,
      phone: disabled.phone,
      location: disabled.location || disabled.address,
      address: disabled.address,
      disabilityType: disabled.disabilityType,
      needs: disabled.needs,
      education: disabled.education || "",
      occupation: disabled.occupation || "",
      bio: disabled.bio || "", // <-- ADD THIS

      // Profile Image
      profileImage: disabled.profileImage
        ? {
            url: disabled.profileImage.url,
            publicId: disabled.profileImage.publicId,
          }
        : null,

      // Verification Status
      isVerified: disabled.isVerified || false,
      verificationStatus: disabled.verificationStatus || "pending",
      profileCompletionPercentage: disabled.profileCompletionPercentage || 0,

      // Documents
      documents: disabled.documents
        ? disabled.documents.map((doc) => ({
            _id: doc._id,
            name: doc.name,
            fileName: doc.fileName,
            fileUrl: doc.fileUrl,
            status: doc.status,
            uploadDate: doc.uploadDate,
            verifiedDate: doc.verifiedDate,
            rejectionReason: doc.rejectionReason,
            date: doc.uploadDate
              ? doc.uploadDate.toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })
              : "",
          }))
        : [],

      // Wishlist
      wishlist: wishlistItems.map((item) => ({
        _id: item._id,
        item: item.itemName,
        itemName: item.itemName,
        description: item.description,
        category: item.category,
        progress: item.progress,
        priority: item.urgencyLevel
          ? item.urgencyLevel.toLowerCase()
          : "medium",
        urgencyLevel: item.urgencyLevel || "Medium",
        estimatedCost: item.amountRequired,
        amountRequired: item.amountRequired,
        currentAmount: item.amountRaised,
        amountRaised: item.amountRaised,
        targetAmount: item.amountRequired,
        isCompleted: item.isCompleted,
        status: item.status,
        quantity: item.quantity,
        deadline: item.deadline,
        supportingDocuments: item.supportingDocuments || [],
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      })),

      // Recent Activity
      recentActivity: disabled.recentActivity
        ? disabled.recentActivity.slice(0, 10).map((activity) => ({
            action: activity.action,
            description: activity.description,
            date: activity.date
              ? activity.date.toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })
              : "",
            timestamp: activity.date,
          }))
        : [],

      // Statistics
      statistics: {
        totalWishlistItems,
        completedItems,
        pendingItems: totalWishlistItems - completedItems,
        totalAmountNeeded,
        totalAmountRaised,
        verifiedDocuments,
        totalDocuments: disabled.documents ? disabled.documents.length : 0,
        memberSince: disabled.createdAt
          ? disabled.createdAt.toLocaleDateString("en-IN", {
              month: "long",
              year: "numeric",
            })
          : "",
      },

      // Timestamps
      createdAt: disabled.createdAt,
      updatedAt: disabled.updatedAt,
    };

    console.log("7. Sending profile data successfully");
    console.log("=== END PROFILE DEBUG ===");
    res.json(profileData);
  } catch (err) {
    console.error("❌ Get profile error:", err);
    console.error("Error stack:", err.stack);
    res.status(500).json({
      message: "Server error",
      error:
        process.env.NODE_ENV === "development"
          ? err.message
          : "Internal server error",
    });
  }
});

// Test endpoint to check what's in the token
router.get("/debug-token", auth, (req, res) => {
  res.json({
    message: "Token debug info",
    user: req.user,
    userId: req.user.userId || req.user.id,
    fullToken: req.user,
  });
});

// Test endpoint to check database connection
router.get("/debug-db", auth, async (req, res) => {
  try {
    const userCount = await Disabled.countDocuments();
    const sampleUsers = await Disabled.find({})
      .limit(3)
      .select("_id name email");

    res.json({
      message: "Database debug info",
      totalUsers: userCount,
      sampleUsers: sampleUsers.map((u) => ({
        id: u._id.toString(),
        name: u.name,
        email: u.email,
      })),
    });
  } catch (error) {
    res.status(500).json({
      message: "Database error",
      error: error.message,
    });
  }
});

// Update profile information (atomic update to avoid VersionError)
router.put("/", auth, async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      location,
      address,
      disabilityType,
      needs,
      education,
      occupation,
      bio,
    } = req.body;
    const userId = req.user.userId || req.user.id;

    // Check if email is already taken by another user
    if (email) {
      const existingUser = await Disabled.findOne({
        email: email,
        _id: { $ne: userId },
      });
      if (existingUser) {
        return res.status(400).json({ message: "Email is already taken" });
      }
    }

    // Build update object dynamically
    const updateFields = {};
    if (name) updateFields.name = name;
    if (email) updateFields.email = email;
    if (phone) updateFields.phone = phone;
    if (location) updateFields.location = location;
    if (address) updateFields.address = address;
    if (disabilityType) updateFields.disabilityType = disabilityType;
    if (needs) updateFields.needs = needs;
    if (education !== undefined) updateFields.education = education;
    if (occupation !== undefined) updateFields.occupation = occupation;
    if (bio !== undefined) updateFields.bio = bio; // <-- NEW LINE

    // Perform atomic update
    const disabled = await Disabled.findByIdAndUpdate(
      userId,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!disabled) {
      return res.status(404).json({ message: "User not found" });
    }

    // Add activity atomically
    await Disabled.findByIdAndUpdate(userId, {
      $push: {
        recentActivity: {
          $each: [
            {
              action: "Updated Profile",
              description: "Profile information was updated",
              date: new Date(),
            },
          ],
          $position: 0,
          $slice: 20,
        },
      },
    });

    res.json({
      message: "Profile updated successfully",
      profileCompletionPercentage: disabled.profileCompletionPercentage || 0,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Upload document
router.post("/documents", [
  auth,
  upload.single("file"), // Changed from 'document' to 'file' to match frontend
  body("name").trim().notEmpty().withMessage("Document name is required")
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        message: "Validation failed",
        errors: errors.array() 
      });
    }
    
    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        message: "No document file provided" 
      });
    }

    const userId = req.user.userId || req.user.id;
    const disabled = await Disabled.findById(userId);
    
    if (!disabled) {
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }

    const newDocument = {
      name: req.body.name || "PWD Certificate",
      fileName: req.file.originalname,
      fileUrl: req.file.path,
      status: "pending"
    };

    disabled.documents.push(newDocument);
    await disabled.save();
    
    // Add activity if method exists
    if (disabled.addActivity) {
      await disabled.addActivity("Uploaded Document", `Uploaded ${newDocument.name}`);
    }

    res.json({
      success: true,
      message: "Document uploaded successfully",
      document: {
        _id: disabled.documents[disabled.documents.length - 1]._id,
        name: newDocument.name,
        status: newDocument.status,
        date: new Date().toLocaleDateString("en-IN", { 
          day: "2-digit", 
          month: "short", 
          year: "numeric" 
        })
      }
    });
  } catch (error) {
    console.error("Upload document error:", error);
    res.status(500).json({ 
      success: false,
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : "Internal server error"
    });
  }
});

module.exports = router;
