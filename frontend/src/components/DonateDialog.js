// src/components/DonateDialog.jsx
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  InputAdornment,
  Alert,
  CircularProgress,
  Avatar,
  Divider,
  Chip,
} from "@mui/material";
import {
  AttachMoney as MoneyIcon,
  Person as PersonIcon,
  Close as CloseIcon,
  Send as SendIcon,
} from "@mui/icons-material";
import { donationApi } from "../utils/api";

/**
 * DonateDialog Component
 * 
 * Handles donation process with Razorpay integration:
 * 1. Shows dialog to collect amount and note
 * 2. Creates Razorpay order via backend
 * 3. Opens Razorpay payment popup
 * 4. Verifies payment after completion
 * 5. Shows success/error feedback
 */
const DonateDialog = ({ open, onClose, profile, onSuccess }) => {
  // Form states
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  
  // UI states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Quick amount selection buttons
  const quickAmounts = [100, 500, 1000, 2000, 5000];

  /**
   * Handles the donation process
   * Creates order, opens Razorpay popup, verifies payment
   */
  const handleDonate = async () => {
    // Validation
    if (!amount || amount <= 0) {
      setError("Please enter a valid amount (minimum ₹1)");
      return;
    }

    if (amount < 1) {
      setError("Minimum donation amount is ₹1");
      return;
    }

    if (amount > 1000000) {
      setError("Maximum donation amount is ₹10,00,000");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log("=== Starting Donation Process ===");
      console.log("Profile:", profile.name, profile.id);
      console.log("Amount:", amount);

      // ---------------------------------------------
      // STEP 1: Create Razorpay Order via Backend
      // ---------------------------------------------
      const orderResponse = await donationApi.createOrder({
        pwdId: profile.id,
        amount: parseFloat(amount),
        donorName: donorName || "Anonymous Donor",
        donorEmail: donorEmail || "",
        note: note || "",
      });

      console.log("Order created:", orderResponse.data);

      const { order, razorpayKeyId } = orderResponse.data;

      // ---------------------------------------------
      // STEP 2: Check if Razorpay is loaded
      // ---------------------------------------------
      if (typeof window.Razorpay === "undefined") {
        throw new Error(
          "Razorpay SDK not loaded. Please refresh the page and try again."
        );
      }

      // ---------------------------------------------
      // STEP 3: Configure Razorpay Options
      // ---------------------------------------------
      const options = {
        key: razorpayKeyId, // Razorpay Key ID from backend
        amount: order.amount, // Amount in paise
        currency: order.currency,
        name: "Support Platform",
        description: `Donation for ${profile.name}`,
        image: profile.image || "/logo.png", // Optional: your logo
        order_id: order.id, // Order ID from backend
        
        // Prefill donor details
        prefill: {
          name: donorName || "",
          email: donorEmail || "",
          contact: "",
        },

        // Donation details
        notes: {
          pwdName: profile.name,
          pwdId: profile.id,
          donationNote: note || "",
        },

        // Theme customization
        theme: {
          color: "#1976d2", // Your primary color
        },

        // Modal settings
        modal: {
          ondismiss: () => {
            console.log("Payment popup closed by user");
            setLoading(false);
            setError("Payment cancelled. You can try again anytime.");
          },
        },

        // ---------------------------------------------
        // STEP 4: Handle Payment Success
        // ---------------------------------------------
        handler: async (response) => {
          console.log("=== Payment Successful ===");
          console.log("Razorpay Response:", response);

          try {
            // Verify payment with backend
            const verifyResponse = await donationApi.verifyPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });

            console.log("Payment verified:", verifyResponse.data);

            // Show success message
            alert(
              `Thank you for your donation of ₹${amount} to ${profile.name}!\n\nYour contribution will make a real difference.`
            );

            // Call success callback to refresh data
            if (onSuccess) {
              onSuccess(verifyResponse.data);
            }

            // Close dialog
            handleClose();
          } catch (verifyError) {
            console.error("Payment verification failed:", verifyError);
            setError(
              "Payment completed but verification failed. Please contact support with Payment ID: " +
                response.razorpay_payment_id
            );
          } finally {
            setLoading(false);
          }
        },
      };

      // ---------------------------------------------
      // STEP 5: Open Razorpay Payment Popup
      // ---------------------------------------------
      console.log("Opening Razorpay popup...");
      const razorpayInstance = new window.Razorpay(options);

      // Handle payment failure
      razorpayInstance.on("payment.failed", (response) => {
        console.error("Payment failed:", response.error);
        setLoading(false);
        setError(
          response.error.description ||
            "Payment failed. Please try again."
        );
      });

      // Open the payment popup
      razorpayInstance.open();
    } catch (err) {
      console.error("Error in donation process:", err);
      setLoading(false);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to process donation. Please try again."
      );
    }
  };

  /**
   * Handles dialog close
   * Resets form and states
   */
  const handleClose = () => {
    if (!loading) {
      setAmount("");
      setNote("");
      setDonorName("");
      setDonorEmail("");
      setError(null);
      onClose();
    }
  };

  /**
   * Handles quick amount selection
   */
  const handleQuickAmount = (quickAmount) => {
    setAmount(quickAmount.toString());
    setError(null);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxHeight: "90vh",
        },
      }}
    >
      {/* Dialog Header */}
      <DialogTitle
        sx={{
          bgcolor: "primary.main",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pb: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <MoneyIcon />
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Make a Donation
          </Typography>
        </Box>
        <Button
          onClick={handleClose}
          disabled={loading}
          sx={{
            color: "white",
            minWidth: "auto",
            p: 0.5,
            "&:hover": {
              bgcolor: "rgba(255, 255, 255, 0.1)",
            },
          }}
        >
          <CloseIcon />
        </Button>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        {/* Profile Info */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            p: 2,
            bgcolor: "#f5f5f5",
            borderRadius: 2,
            mb: 3,
          }}
        >
          <Avatar
            src={profile?.image}
            sx={{ width: 56, height: 56, mr: 2 }}
          >
            <PersonIcon />
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              {profile?.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {profile?.location} • {profile?.disability}
            </Typography>
          </Box>
          <Chip
            label={`Goal: ₹${profile?.goalAmount?.toLocaleString()}`}
            color="primary"
            size="small"
          />
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Donation Amount */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: "bold", mb: 1 }}
          >
            Donation Amount *
          </Typography>
          <TextField
            fullWidth
            type="number"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              setError(null);
            }}
            placeholder="Enter amount"
            disabled={loading}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Typography sx={{ fontWeight: "bold" }}>₹</Typography>
                </InputAdornment>
              ),
            }}
            inputProps={{
              min: 1,
              step: 1,
            }}
            sx={{ mb: 1.5 }}
          />

          {/* Quick Amount Buttons */}
          <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: "block" }}>
            Quick Select:
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {quickAmounts.map((quickAmount) => (
              <Chip
                key={quickAmount}
                label={`₹${quickAmount}`}
                onClick={() => handleQuickAmount(quickAmount)}
                disabled={loading}
                sx={{
                  cursor: "pointer",
                  "&:hover": {
                    bgcolor: "primary.light",
                    color: "white",
                  },
                  ...(amount === quickAmount.toString() && {
                    bgcolor: "primary.main",
                    color: "white",
                  }),
                }}
              />
            ))}
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Optional: Donor Details */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: "bold", mb: 1 }}
          >
            Your Details (Optional)
          </Typography>
          <TextField
            fullWidth
            label="Your Name"
            value={donorName}
            onChange={(e) => setDonorName(e.target.value)}
            placeholder="Enter your name (optional)"
            disabled={loading}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Your Email"
            type="email"
            value={donorEmail}
            onChange={(e) => setDonorEmail(e.target.value)}
            placeholder="Enter your email (optional)"
            disabled={loading}
          />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block" }}>
            We'll send you a donation receipt
          </Typography>
        </Box>

        {/* Personal Note */}
        <Box>
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: "bold", mb: 1 }}
          >
            Add a Personal Note (Optional)
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Write an encouraging message... (e.g., 'Hope this helps with your medical needs!')"
            disabled={loading}
            inputProps={{
              maxLength: 300,
            }}
          />
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mt: 0.5, display: "block", textAlign: "right" }}
          >
            {note.length}/300 characters
          </Typography>
        </Box>
      </DialogContent>

      {/* Dialog Actions */}
      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button
          onClick={handleClose}
          disabled={loading}
          sx={{ px: 3 }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleDonate}
          disabled={loading || !amount || amount <= 0}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
          sx={{ px: 4, py: 1.5 }}
        >
          {loading ? "Processing..." : `Donate ₹${amount || "0"}`}
        </Button>
      </DialogActions>

      {/* Loading Overlay */}
      {loading && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: "rgba(255, 255, 255, 0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <Box sx={{ textAlign: "center" }}>
            <CircularProgress size={48} />
            <Typography variant="body2" sx={{ mt: 2 }}>
              Opening payment gateway...
            </Typography>
          </Box>
        </Box>
      )}
    </Dialog>
  );
};

export default DonateDialog;