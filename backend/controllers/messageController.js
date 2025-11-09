import Message from '../models/Message.js';
import mongoose from 'mongoose';

// Send a new message
export const sendMessage = async (req, res) => {
  try {
    const { senderId, receiverId, message } = req.body;

    // Validation
    if (!senderId || !receiverId || !message) {
      return res.status(400).json({ 
        success: false, 
        message: 'senderId, receiverId, and message are required' 
      });
    }

    // Create new message
    const newMsg = await Message.create({ 
      senderId, 
      receiverId, 
      message, 
      timestamp: new Date(), 
      read: false 
    });

    res.status(201).json({ 
      success: true, 
      message: 'Message sent successfully',
      data: newMsg 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send message', 
      error: err.message 
    });
  }
};

// Get chat history between two users
export const getMessages = async (req, res) => {
  try {
    const { userId, chatWithId } = req.params;

    // Validation
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(chatWithId)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid user IDs' 
      });
    }

    // Fetch all messages between these two users
    const messages = await Message.find({
      $or: [
        { senderId: userId, receiverId: chatWithId },
        { senderId: chatWithId, receiverId: userId }
      ]
    })
    .sort({ timestamp: 1 }) // Oldest first
    .populate('senderId', 'name email') // Populate sender details
    .populate('receiverId', 'name email'); // Populate receiver details

    res.status(200).json({ 
      success: true, 
      count: messages.length,
      data: messages 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch messages', 
      error: err.message 
    });
  }
};

// Get all conversations for a user (inbox list)
export const getConversations = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validation
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid user ID' 
      });
    }

    // Get all unique users this person has chatted with
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [
            { senderId: new mongoose.Types.ObjectId(userId) },
            { receiverId: new mongoose.Types.ObjectId(userId) }
          ]
        }
      },
      {
        $sort: { timestamp: -1 } // Latest messages first
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ['$senderId', new mongoose.Types.ObjectId(userId)] },
              '$receiverId',
              '$senderId'
            ]
          },
          lastMessage: { $first: '$message' },
          lastMessageTime: { $first: '$timestamp' },
          unreadCount: {
            $sum: {
              $cond: [
                { 
                  $and: [
                    { $eq: ['$receiverId', new mongoose.Types.ObjectId(userId)] },
                    { $eq: ['$read', false] }
                  ]
                },
                1,
                0
              ]
            }
          }
        }
      },
      {
        $lookup: {
          from: 'users', // Your User collection name
          localField: '_id',
          foreignField: '_id',
          as: 'userDetails'
        }
      },
      {
        $unwind: '$userDetails'
      },
      {
        $project: {
          _id: 1,
          name: '$userDetails.name',
          email: '$userDetails.email',
          lastMessage: 1,
          lastMessageTime: 1,
          unreadCount: 1
        }
      },
      {
        $sort: { lastMessageTime: -1 }
      }
    ]);

    res.status(200).json({ 
      success: true, 
      count: conversations.length,
      data: conversations 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch conversations', 
      error: err.message 
    });
  }
};

// Mark message as read
export const markAsRead = async (req, res) => {
  try {
    const { messageId } = req.params;

    // Validation
    if (!mongoose.Types.ObjectId.isValid(messageId)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid message ID' 
      });
    }

    const message = await Message.findByIdAndUpdate(
      messageId,
      { read: true },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({ 
        success: false, 
        message: 'Message not found' 
      });
    }

    res.status(200).json({ 
      success: true, 
      message: 'Message marked as read',
      data: message 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to mark message as read', 
      error: err.message 
    });
  }
};