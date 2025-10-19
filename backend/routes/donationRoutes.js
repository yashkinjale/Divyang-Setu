// routes/donationRoutes.js - Razorpay Payment Integration
const express = require("express");
const router = express.Router();
const Razorpay = require("razorpay");
const crypto = require("crypto");
const Donation = require("../models/Donation");
const Disabled = require("../models/Disabled");
const WishlistItem = require("../models/WishlistItem");
const auth = require("../middleware/auth");

// =============================================
// RAZORPAY SETUP
// =============================================

// Initialize Razorpay instance with test credentials
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Verify Razorpay configuration on startup
if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  console.error("❌ RAZORPAY CREDENTIALS MISSING IN .env FILE");
}

// =============================================
// STEP 1: CREATE RAZORPAY ORDER
// =============================================

/**
 * POST /api/donations/create-order
 * Creates a Razorpay order for donation
 * Body: { pwdId, amount, donorName?, donorEmail?, note? }
 */
router.post("/create-order", async (req, res) => {
  try {
    console.log("=== CREATE RAZORPAY ORDER ===");
    const { pwdId, amount, donorName, donorEmail, note } = req.body;

    // Validate required fields
    if (!pwdId || !amount) {
      return res.status(400).json({
        success: false,
        message: "PWD ID and amount are required",
      });
    }

    // Validate amount (minimum ₹1)
    if (amount < 1) {
      return res.status(400).json({
        success: false,
        message: "Minimum donation amount is ₹1",
      });
    }

    // Verify PWD exists
    const pwdUser = await Disabled.findById(pwdId);
    if (!pwdUser) {
      return res.status(404).json({
        success: false,
        message: "PWD profile not found",
      });
    }

    console.log(`Creating order for PWD: ${pwdUser.name}`);
    console.log(`Amount: ₹${amount}`);

    // Create Razorpay order
    // Amount must be in paise (multiply by 100)
    const shortReceipt = `don_${pwdId
      .toString()
      .slice(-6)}_${Date.now()}`.slice(0, 40);

    const razorpayOrder = await razorpay.orders.create({
      amount: amount * 100, // Convert rupees to paise
      currency: "INR",
      receipt: shortReceipt,
      notes: {
        pwdId: pwdId,
        pwdName: pwdUser.name,
        donorName: donorName || "Anonymous",
        donorEmail: donorEmail || "",
        note: note || "",
      },
    });

    console.log("Razorpay Order Created:", razorpayOrder.id);

    // Create pending donation record in database
    const donation = new Donation({
      pwdId,
      donorName: donorName || "Anonymous Donor",
      donorEmail: donorEmail || undefined,
      amount,
      note: note || "",
      razorpayOrderId: razorpayOrder.id,
      status: "pending",
    });

    // If donor is logged in, add donorId
    if (req.user && req.user.id) {
      donation.donorId = req.user.id;
    }

    await donation.save();
    console.log("Donation record created:", donation._id);

    // Return order details for frontend
    res.json({
      success: true,
      message: "Order created successfully",
      order: {
        id: razorpayOrder.id,
        amount: razorpayOrder.amount, // In paise
        currency: razorpayOrder.currency,
        donationId: donation._id,
      },
      // Return Razorpay key for frontend
      razorpayKeyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create order",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
});

// =============================================
// STEP 2: VERIFY PAYMENT & ALLOCATE FUNDS
// =============================================

/**
 * POST /api/donations/verify-payment
 * Verifies Razorpay payment signature and processes donation
 * Body: { razorpayOrderId, razorpayPaymentId, razorpaySignature }
 */
router.post("/verify-payment", async (req, res) => {
  try {
    console.log("=== VERIFY PAYMENT ===");
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    // Validate required fields
    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return res.status(400).json({
        success: false,
        message: "Missing payment verification parameters",
      });
    }

    console.log("Order ID:", razorpayOrderId);
    console.log("Payment ID:", razorpayPaymentId);

    // -----------------------------------------------
    // STEP 2.1: VERIFY SIGNATURE (SECURITY CHECK)
    // -----------------------------------------------

    // Generate expected signature using Razorpay secret
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest("hex");

    // Compare signatures
    if (generatedSignature !== razorpaySignature) {
      console.error("❌ Payment signature verification failed");
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }

    console.log("✅ Payment signature verified");

    // -----------------------------------------------
    // STEP 2.2: UPDATE DONATION RECORD
    // -----------------------------------------------

    const donation = await Donation.findOne({ razorpayOrderId });

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: "Donation record not found",
      });
    }

    // Update donation with payment details
    donation.razorpayPaymentId = razorpayPaymentId;
    donation.razorpaySignature = razorpaySignature;
    donation.status = "success";

    // -----------------------------------------------
    // STEP 2.3: ALLOCATE FUNDS TO WISHLIST ITEMS
    // -----------------------------------------------

    console.log(
      `Allocating ₹${donation.amount} to wishlist items for PWD: ${donation.pwdId}`
    );

    // Fetch all incomplete wishlist items for this PWD
    const wishlistItems = await WishlistItem.find({
      userId: donation.pwdId,
      status: { $ne: "completed" },
    }).sort({
      // Sort by priority (high > medium > low) and then by creation date
      urgencyLevel: -1, // High first
      createdAt: 1, // Oldest first
    });

    console.log(`Found ${wishlistItems.length} wishlist items`);

    // Priority mapping for proper sorting
    const priorityMap = {
      High: 3,
      Medium: 2,
      Low: 1,
    };

    // Sort wishlist items by priority and creation date
    wishlistItems.sort((a, b) => {
      const priorityA = priorityMap[a.urgencyLevel] || 1;
      const priorityB = priorityMap[b.urgencyLevel] || 1;

      if (priorityA !== priorityB) {
        return priorityB - priorityA; // Higher priority first
      }
      // Same priority, sort by creation date (oldest first)
      return new Date(a.createdAt) - new Date(b.createdAt);
    });

    // Allocate donation amount to wishlist items
    let remainingAmount = donation.amount;
    const allocations = [];

    for (const item of wishlistItems) {
      if (remainingAmount <= 0) break;

      // Calculate how much this item still needs
      const amountNeeded = item.amountRequired - item.amountRaised;

      if (amountNeeded > 0) {
        // Allocate funds to this item
        const amountToAllocate = Math.min(remainingAmount, amountNeeded);

        // Update wishlist item
        item.amountRaised += amountToAllocate;

        // ✅ UPDATE PROGRESS - THIS IS THE KEY ADDITION
        item.progress = Math.round(
          (item.amountRaised / item.amountRequired) * 100
        );
        console.log(
          `Updated progress for "${item.itemName}": ${item.progress}%`
        );

        // Check if item is now fully funded
        if (item.amountRaised >= item.amountRequired) {
          item.status = "completed";
          item.isCompleted = true;
          item.progress = 100; // Ensure progress is 100% for completed items
          console.log(`✅ Item "${item.itemName}" fully funded!`);
        }

        await item.save();

        // Record allocation
        allocations.push({
          wishlistItemId: item._id,
          amountAllocated: amountToAllocate,
        });

        remainingAmount -= amountToAllocate;

        console.log(
          `Allocated ₹${amountToAllocate} to "${item.itemName}" (Priority: ${item.urgencyLevel})`
        );
      }
    }

    // Update donation with allocations
    donation.allocatedToWishlist = allocations;
    await donation.save();

    console.log(`Total allocated: ₹${donation.amount - remainingAmount}`);
    if (remainingAmount > 0) {
      console.log(`Remaining unallocated: ₹${remainingAmount}`);
    }

    // -----------------------------------------------
    // STEP 2.4: UPDATE PWD PROFILE
    // -----------------------------------------------

    const pwdUser = await Disabled.findById(donation.pwdId);

    if (pwdUser) {
      // Update total donations received
      if (!pwdUser.totalDonationsReceived) {
        pwdUser.totalDonationsReceived = 0;
      }
      pwdUser.totalDonationsReceived += donation.amount;

      // Add to recent activity
      const activityMessage = donation.note
        ? `Received donation of ₹${donation.amount} from ${donation.donorName}: "${donation.note}"`
        : `Received donation of ₹${donation.amount} from ${donation.donorName}`;

      if (!pwdUser.recentActivity) {
        pwdUser.recentActivity = [];
      }

      pwdUser.recentActivity.unshift({
        action: "Donation Received",
        description: activityMessage,
        date: new Date(),
      });

      // Keep only last 20 activities
      if (pwdUser.recentActivity.length > 20) {
        pwdUser.recentActivity = pwdUser.recentActivity.slice(0, 20);
      }

      await pwdUser.save();
      console.log(`✅ Updated PWD profile: ${pwdUser.name}`);
    }

    // -----------------------------------------------
    // STEP 2.5: SEND SUCCESS RESPONSE
    // -----------------------------------------------

    res.json({
      success: true,
      message: "Payment verified and funds allocated successfully",
      donation: {
        id: donation._id,
        amount: donation.amount,
        status: donation.status,
        allocations: allocations.map((a) => ({
          itemId: a.wishlistItemId,
          amount: a.amountAllocated,
        })),
        pwdName: pwdUser?.name,
      },
    });
  } catch (error) {
    console.error("Error verifying payment:", error);

    // If error occurs, mark donation as failed
    if (req.body.razorpayOrderId) {
      await Donation.findOneAndUpdate(
        { razorpayOrderId: req.body.razorpayOrderId },
        { status: "failed" }
      );
    }

    res.status(500).json({
      success: false,
      message: "Payment verification failed",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
});

// =============================================
// ADDITIONAL ROUTES
// =============================================

/**
 * GET /api/donations/history/:pwdId
 * Get donation history for a PWD profile
 */
router.get("/history/:pwdId", async (req, res) => {
  try {
    const { pwdId } = req.params;

    const donations = await Donation.find({
      pwdId,
      status: "success",
    })
      .populate("allocatedToWishlist.wishlistItemId", "itemName category")
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      success: true,
      count: donations.length,
      donations: donations.map((d) => ({
        id: d._id,
        donorName: d.donorName,
        amount: d.amount,
        note: d.note,
        date: d.createdAt,
        allocations: d.allocatedToWishlist,
      })),
    });
  } catch (error) {
    console.error("Error fetching donation history:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch donation history",
    });
  }
});

/**
 * GET /api/donations/my-donations
 * Get logged-in donor's donation history
 */
router.get("/my-donations", auth, async (req, res) => {
  try {
    const donorId = req.user.id || req.user.userId;

    const donations = await Donation.find({
      donorId,
      status: "success",
    })
      .populate("pwdId", "name profileImage location disabilityType")
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      success: true,
      count: donations.length,
      donations: donations.map((d) => ({
        id: d._id,
        amount: d.amount,
        note: d.note,
        date: d.createdAt,
        pwd: {
          id: d.pwdId._id,
          name: d.pwdId.name,
          location: d.pwdId.location,
          disability: d.pwdId.disabilityType,
          image: d.pwdId.profileImage?.url,
        },
      })),
    });
  } catch (error) {
    console.error("Error fetching my donations:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch donations",
    });
  }
});

/**
 * GET /api/donations/stats/:pwdId
 * Get donation statistics for a PWD profile
 */
router.get("/stats/:pwdId", async (req, res) => {
  try {
    const { pwdId } = req.params;

    const totalDonations = await Donation.countDocuments({
      pwdId,
      status: "success",
    });

    const donationSum = await Donation.aggregate([
      {
        $match: {
          pwdId: require("mongoose").Types.ObjectId(pwdId),
          status: "success",
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" },
        },
      },
    ]);

    const totalAmount = donationSum.length > 0 ? donationSum[0].totalAmount : 0;

    res.json({
      success: true,
      stats: {
        totalDonations,
        totalAmount,
      },
    });
  } catch (error) {
    console.error("Error fetching donation stats:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch statistics",
    });
  }
});

module.exports = router;