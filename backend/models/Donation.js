const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema(
  {
    pwdId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Disabled", // Reference to the PWD user
      required: true,
    },
    donorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Donor", // Optional: for logged-in donors
    },
    donorName: {
      type: String,
      trim: true,
    },
    donorEmail: {
      type: String,
      trim: true,
      lowercase: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 1,
    },
    note: {
      type: String,
      trim: true,
      maxlength: 300,
    },
    razorpayOrderId: {
      type: String,
      trim: true,
    },
    razorpayPaymentId: {
      type: String,
      trim: true,
    },
    razorpaySignature: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
    },
    allocatedToWishlist: [
      {
        wishlistItemId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Wishlist",
        },
        amountAllocated: Number,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Optional virtual for displaying formatted donation date
donationSchema.virtual("formattedDate").get(function () {
  return this.createdAt.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "medium",
    timeStyle: "short",
  });
});

module.exports = mongoose.model("Donation", donationSchema);

