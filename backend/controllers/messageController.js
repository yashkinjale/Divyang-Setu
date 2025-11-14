const mongoose = require("mongoose");
const Message = require("../models/Message");
const Donor = require("../models/Donor");
const Disabled = require("../models/Disabled");

// Helper function to extract userId from either token format
const extractUserId = (user) => {
  return user.userId || user.id;
};

// Send a new message
const sendMessage = async (req, res) => {
  try {
    const { senderId, receiverId, message } = req.body;

    // Validation
    if (!senderId || !receiverId || !message) {
      return res.status(400).json({
        success: false,
        message: "senderId, receiverId, and message are required",
      });
    }

    // Create new message
    const newMsg = await Message.create({
      senderId,
      receiverId,
      message,
      timestamp: new Date(),
      read: false,
    });

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: newMsg,
    });
  } catch (err) {
    console.error('Send message error:', err);
    res.status(500).json({
      success: false,
      message: "Failed to send message",
      error: err.message,
    });
  }
};

// Get chat history between two users
const getMessages = async (req, res) => {
  try {
    const { userId, chatWithId } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(chatWithId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid user IDs",
      });
    }

    const messages = await Message.find({
      $or: [
        { senderId: userId, receiverId: chatWithId },
        { senderId: chatWithId, receiverId: userId },
      ],
    })
      .sort({ timestamp: 1 });

    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages,
    });
  } catch (err) {
    console.error('Get messages error:', err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch messages",
      error: err.message,
    });
  }
};

// Get all conversations for a user (inbox list)
const getConversations = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [
            { senderId: new mongoose.Types.ObjectId(userId) },
            { receiverId: new mongoose.Types.ObjectId(userId) },
          ],
        },
      },
      { $sort: { timestamp: -1 } },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ["$senderId", new mongoose.Types.ObjectId(userId)] },
              "$receiverId",
              "$senderId",
            ],
          },
          lastMessage: { $first: "$message" },
          lastMessageTime: { $first: "$timestamp" },
          unreadCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$receiverId", new mongoose.Types.ObjectId(userId)] },
                    { $eq: ["$read", false] },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
      { $sort: { lastMessageTime: -1 } },
    ]);

    // Fetch user details for each conversation
    const conversationsWithDetails = await Promise.all(
      conversations.map(async (conv) => {
        // Try to find user in both Donor and Disabled collections
        let otherUser = await Donor.findById(conv._id).select('name email profileImage avatar location address phone');
        let userType = 'donor';
        
        if (!otherUser) {
          otherUser = await Disabled.findById(conv._id).select('name email profileImage avatar location address disabilityType age phone');
          userType = 'pwd';
        }

        if (!otherUser) {
          return null; // Skip if user not found
        }

        // Handle profileImage which could be object or string
        let imageUrl = null;
        if (otherUser.profileImage) {
          if (typeof otherUser.profileImage === 'string') {
            imageUrl = otherUser.profileImage;
          } else if (otherUser.profileImage.url) {
            imageUrl = otherUser.profileImage.url;
          } else if (otherUser.profileImage.path) {
            imageUrl = otherUser.profileImage.path;
          }
        }
        imageUrl = imageUrl || otherUser.avatar || null;

        return {
          id: conv._id.toString(),
          otherUser: {
            id: otherUser._id.toString(),
            name: otherUser.name,
            email: otherUser.email,
            profileImage: imageUrl,
            avatar: imageUrl,
            location: otherUser.location || otherUser.address || '',
            disability: otherUser.disabilityType || null,
            age: otherUser.age || null,
            type: userType,
            online: false,
          },
          lastMessage: {
            content: conv.lastMessage,
            createdAt: conv.lastMessageTime,
          },
          unreadCount: conv.unreadCount,
        };
      })
    );

    // Filter out null values (users not found)
    const validConversations = conversationsWithDetails.filter(c => c !== null);

    res.status(200).json({
      success: true,
      count: validConversations.length,
      conversations: validConversations,
    });
  } catch (err) {
    console.error('Get conversations error:', err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch conversations",
      error: err.message,
    });
  }
};

// Mark message as read
const markAsRead = async (req, res) => {
  try {
    const { messageId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(messageId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid message ID",
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
        message: "Message not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Message marked as read",
      data: message,
    });
  } catch (err) {
    console.error('Mark as read error:', err);
    res.status(500).json({
      success: false,
      message: "Failed to mark message as read",
      error: err.message,
    });
  }
};

// Search for donors (for PWD users to find donors to chat with)
const searchDonors = async (req, res) => {
  try {
    const { query } = req.query;
    const searchQuery = query || '';

    console.log('Searching donors with query:', searchQuery);

    // Build search filter
    const filter = {};

    // If search query exists, add name/email/location search
    if (searchQuery) {
      filter.$or = [
        { name: { $regex: searchQuery, $options: 'i' } },
        { email: { $regex: searchQuery, $options: 'i' } },
        { location: { $regex: searchQuery, $options: 'i' } },
        { address: { $regex: searchQuery, $options: 'i' } },
      ];
    }

    const donors = await Donor.find(filter)
      .select('name email profileImage avatar location address phone createdAt')
      .limit(20)
      .sort({ createdAt: -1 });

    console.log(`Found ${donors.length} donors`);

    // Format donor data
    const formattedDonors = donors.map(donor => {
      let imageUrl = null;
      if (donor.profileImage) {
        if (typeof donor.profileImage === 'string') {
          imageUrl = donor.profileImage;
        } else if (donor.profileImage.url) {
          imageUrl = donor.profileImage.url;
        } else if (donor.profileImage.path) {
          imageUrl = donor.profileImage.path;
        }
      }
      imageUrl = imageUrl || donor.avatar || null;

      return {
        _id: donor._id,
        name: donor.name,
        email: donor.email,
        profileImage: imageUrl,
        avatar: imageUrl,
        location: donor.location || donor.address || '',
        createdAt: donor.createdAt,
      };
    });

    res.status(200).json({
      success: true,
      count: formattedDonors.length,
      data: formattedDonors,
    });
  } catch (err) {
    console.error('Search donors error:', err);
    res.status(500).json({
      success: false,
      message: "Failed to search donors",
      error: err.message,
    });
  }
};

// Search for PWDs (for donors to find PWDs to chat with)
const searchPWD = async (req, res) => {
  try {
    const { query } = req.query;
    const searchQuery = query || '';

    console.log('Searching PWDs with query:', searchQuery);

    // Build search filter - show all PWDs (not just verified) for testing
    const filter = {};

    // If search query exists, add name/email/location/disability search
    if (searchQuery) {
      filter.$or = [
        { name: { $regex: searchQuery, $options: 'i' } },
        { email: { $regex: searchQuery, $options: 'i' } },
        { location: { $regex: searchQuery, $options: 'i' } },
        { address: { $regex: searchQuery, $options: 'i' } },
        { disabilityType: { $regex: searchQuery, $options: 'i' } },
      ];
    }

    const pwds = await Disabled.find(filter)
      .select('name email profileImage avatar location address disabilityType age phone createdAt isVerified')
      .limit(20)
      .sort({ isVerified: -1, createdAt: -1 }); // Show verified first

    console.log(`Found ${pwds.length} PWDs`);

    // Format PWD data
    const formattedPWDs = pwds.map(pwd => {
      let imageUrl = null;
      if (pwd.profileImage) {
        if (typeof pwd.profileImage === 'string') {
          imageUrl = pwd.profileImage;
        } else if (pwd.profileImage.url) {
          imageUrl = pwd.profileImage.url;
        } else if (pwd.profileImage.path) {
          imageUrl = pwd.profileImage.path;
        }
      }
      imageUrl = imageUrl || pwd.avatar || null;

      return {
        _id: pwd._id,
        name: pwd.name,
        email: pwd.email,
        profileImage: imageUrl,
        avatar: imageUrl,
        location: pwd.location || pwd.address || '',
        disability: pwd.disabilityType || 'Not specified',
        age: pwd.age || null,
        createdAt: pwd.createdAt,
        isVerified: pwd.isVerified || false,
      };
    });

    res.status(200).json({
      success: true,
      count: formattedPWDs.length,
      data: formattedPWDs,
    });
  } catch (err) {
    console.error('Search PWDs error:', err);
    res.status(500).json({
      success: false,
      message: "Failed to search PWDs",
      error: err.message,
    });
  }
};

// ✅ Export all functions
module.exports = {
  sendMessage,
  getMessages,
  getConversations,
  markAsRead,
  searchDonors,
  searchPWD,
};