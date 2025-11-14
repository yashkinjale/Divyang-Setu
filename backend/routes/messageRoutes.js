const express = require("express");
const {
  sendMessage,
  getMessages,
  getConversations,
  markAsRead,
  searchDonors,    // NEW
  searchPWD,       // NEW
} = require("../controllers/messageController");

const router = express.Router();

// Send a message (Donor ↔ PWD)
router.post('/send', sendMessage);

// Get chat history between two users (Donor and PWD)
router.get('/:userId/:chatWithId', getMessages);

// Get all conversations for a user (for inbox/message list)
router.get('/conversations/:userId', getConversations);

// Mark messages as read
router.patch('/read/:messageId', markAsRead);

// NEW: Search routes for finding users to chat with
router.get('/search/donors', searchDonors);
router.get('/search/pwd', searchPWD);

module.exports = router;