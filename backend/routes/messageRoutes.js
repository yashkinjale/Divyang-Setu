import express from 'express';
import { 
  sendMessage, 
  getMessages, 
  getConversations,
  markAsRead 
} from '../controllers/messageController.js';

const router = express.Router();

// Send a message (Donor ↔ PWD)
router.post('/send', sendMessage);

// Get chat history between two users (Donor and PWD)
router.get('/:userId/:chatWithId', getMessages);

// Get all conversations for a user (for inbox/message list)
router.get('/conversations/:userId', getConversations);

// Mark messages as read
router.patch('/read/:messageId', markAsRead);

export default router;