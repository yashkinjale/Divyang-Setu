const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const documentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  fileName: String,
  fileUrl: String,
  status: {
    type: String,
    enum: ["pending", "verified", "rejected"],
    default: "pending",
  },
  uploadDate: {
    type: Date,
    default: Date.now,
  },
  verifiedDate: Date,
  rejectionReason: String,
});

const activitySchema = new mongoose.Schema({
  action: {
    type: String,
    required: true,
  },
  description: String,
  date: {
    type: Date,
    default: Date.now,
  },
  metadata: mongoose.Schema.Types.Mixed,
});

const disabledSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    disabilityType: {
      type: String,
      required: true,
      trim: true,
    },
    needs: {
      type: String,
      required: true,
      trim: true,
    },
    education: {
      type: String,
      trim: true,
    },
    occupation: {
      type: String,
      trim: true,
    },
    profileImage: {
      url: String,
      publicId: String,
    },
    documents: [documentSchema],
    recentActivity: [activitySchema],
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationStatus: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    versionKey: false, // Disable version key completely
  }
);

// Password hashing middleware
disabledSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Password comparison method
disabledSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Virtual for profile completion percentage
disabledSchema.virtual("profileCompletionPercentage").get(function () {
  let completedFields = 0;
  const totalFields = 9;

  if (this.name) completedFields++;
  if (this.email) completedFields++;
  if (this.phone) completedFields++;
  if (this.address) completedFields++;
  if (this.disabilityType) completedFields++;
  if (this.needs) completedFields++;
  if (this.education) completedFields++;
  if (this.occupation) completedFields++;
  if (this.profileImage && this.profileImage.url) completedFields++;

  return Math.round((completedFields / totalFields) * 100);
});

// REMOVE THE INSTANCE METHOD COMPLETELY - IT'S CAUSING THE ERROR
// DO NOT ADD ANY addActivity instance method here

// ONLY USE THIS STATIC METHOD (guaranteed to work)
disabledSchema.statics.addActivitySafely = async function (
  userId,
  action,
  description,
  metadata = null
) {
  try {
    // Use findByIdAndUpdate for atomic operation
    const result = await this.findByIdAndUpdate(
      userId,
      {
        $push: {
          recentActivity: {
            $each: [
              {
                action,
                description,
                date: new Date(),
                metadata,
              },
            ],
            $position: 0,
            $slice: 50, // Keep only latest 50 activities
          },
        },
      },
      {
        new: true,
        select: "recentActivity",
      }
    );

    return result;
  } catch (error) {
    console.error("Activity logging failed (safe to ignore):", error.message);
    return null; // Don't throw, just return null
  }
};

module.exports = mongoose.model("Disabled", disabledSchema);