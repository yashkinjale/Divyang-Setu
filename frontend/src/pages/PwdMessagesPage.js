import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  IconButton,
  InputAdornment,
  Paper,
  Badge,
  Chip,
  CircularProgress,
  Alert,
  Collapse,
  Button,
} from '@mui/material';
import {
  Search as SearchIcon,
  Videocam as VideocamIcon,
  Call as CallIcon,
  MoreVert as MoreVertIcon,
  Send as SendIcon,
  Mic as MicIcon,
  EmojiEmotions as EmojiIcon,
  AttachFile as AttachIcon,
  VolunteerActivism as DonorIcon,
  Circle as CircleIcon,
  PersonAdd as PersonAddIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { messageApi, authHelpers } from '../utils/api';

const pageVariants = {
  initial: { opacity: 0, scale: 0.95, y: 20 },
  in: { opacity: 1, scale: 1, y: 0 },
  out: { opacity: 0, scale: 0.95, y: -20 }
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.8
};

const PWDMessagesPage = () => {
  const navigate = useNavigate();
  const [selectedChat, setSelectedChat] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sending, setSending] = useState(false);
  const [sessionError, setSessionError] = useState(false);
  
  // Search functionality
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  
  const messagesEndRef = useRef(null);
  const searchTimeoutRef = useRef(null);
  const currentUserRef = useRef(authHelpers.getCurrentUser());
  const currentUser = currentUserRef.current;

  // CRITICAL: Validate user session on mount
  useEffect(() => {
    const validateSession = () => {
      if (!currentUser || !currentUser.id) {
        console.error('No user found in session');
        setSessionError(true);
        setError('Please log in to access messages');
        setLoading(false);
        return false;
      }

      // Validate MongoDB ObjectId format (exactly 24 hex characters)
      const isValidObjectId = /^[a-f\d]{24}$/i.test(currentUser.id);
      
      console.log('Session Validation:', {
        userId: currentUser.id,
        idLength: currentUser.id.length,
        isValid: isValidObjectId,
        user: currentUser
      });

      if (!isValidObjectId) {
        console.error('Invalid user ID format. Expected 24 hex characters, got:', currentUser.id);
        setSessionError(true);
        setError('Your session is corrupted. Please log in again.');
        setLoading(false);
        return false;
      }

      return true;
    };

    if (validateSession()) {
      fetchConversations();
    }
  }, []);

  // Handle session error - force logout
  const handleForceLogout = () => {
    localStorage.clear();
    navigate('/disabled/login');
  };

  // Fetch conversations on mount
  const fetchConversations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("Fetching conversations for user:", currentUser.id);
      const response = await messageApi.getConversations(currentUser.id);
      
      console.log("Conversations response:", response.data);
      
      if (response.data.success) {
        const convData = response.data.conversations || response.data.data || [];
        
        if (convData.length === 0) {
          setConversations([]);
          setLoading(false);
          return;
        }
        
        const transformedConversations = convData.map((conv) => ({
          id: conv.otherUser._id || conv.otherUser.id,
          userId: conv.otherUser._id || conv.otherUser.id,
          name: conv.otherUser.name,
          message: conv.lastMessage?.content || conv.lastMessage || "No messages yet",
          avatar: conv.otherUser.profileImage || conv.otherUser.avatar,
          status: conv.otherUser.online ? 'Online' : 'Offline',
          time: formatTimeAgo(conv.lastMessage?.createdAt || conv.lastMessageTime),
          unread: conv.unreadCount || 0,
          isDonor: conv.otherUser.type === 'donor' || conv.otherUser.role === 'donor',
        }));
        setConversations(transformedConversations);
      }
    } catch (err) {
      console.error("Error fetching conversations:", err);
      console.error("Error response:", err.response?.data);
      
      // Check for authentication/session errors
      if (err.response?.status === 400 && err.response?.data?.message === "Invalid user IDs") {
        setSessionError(true);
        setError('Your session is invalid. Please log in again.');
      } else if (err.response?.status === 404) {
        setConversations([]);
      } else {
        setError(err.response?.data?.message || err.message || "Failed to load conversations");
      }
    } finally {
      setLoading(false);
    }
  };

  // Auto-select first conversation
  useEffect(() => {
    if (!selectedChat && conversations.length > 0) {
      handleConversationSelect(conversations[0]);
    }
  }, [conversations.length]);

  // Search for donors with debouncing
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (!searchTerm.trim()) {
      setShowSearchResults(false);
      setSearchResults([]);
      return;
    }

    searchTimeoutRef.current = setTimeout(() => {
      searchDonors(searchTerm);
    }, 500);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchTerm]);

  const searchDonors = async (query) => {
    try {
      setSearchLoading(true);
      console.log("Searching for donors with query:", query);
      
      const response = await messageApi.searchDonors(query);
      
      console.log("Search donors response:", response.data);
      
      if (response.data.success) {
        const results = response.data.data || [];
        setSearchResults(results);
        setShowSearchResults(results.length > 0);
      }
    } catch (err) {
      console.error("Error searching donors:", err);
      setSearchResults([]);
      setShowSearchResults(false);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSearchResultClick = (donor) => {
    const newConversation = {
      id: donor._id,
      userId: donor._id,
      name: donor.name,
      message: "Start a new conversation",
      avatar: donor.profileImage || donor.avatar,
      status: 'Offline',
      time: "Now",
      unread: 0,
      isDonor: true,
      email: donor.email,
    };
    
    setSelectedChat(newConversation);
    setMessages([]);
    setSearchTerm("");
    setShowSearchResults(false);
  };

  const fetchMessages = async (conversation) => {
    try {
      setError(null);
      
      if (!conversation || !conversation.userId) {
        console.error("Invalid conversation object");
        return;
      }
      
      console.log("Fetching messages between:", currentUser.id, "and", conversation.userId);
      const response = await messageApi.getMessages(currentUser.id, conversation.userId);
      
      console.log("Messages response:", response.data);
      
      if (response.data.success) {
        const messageData = response.data.data || [];
        
        if (messageData.length === 0) {
          setMessages([]);
          return;
        }
        
        const transformedMessages = messageData.map((msg) => ({
          id: msg._id,
          sender: (msg.senderId === currentUser.id) ? 'You' : conversation.name,
          content: msg.message,
          time: formatTime(new Date(msg.timestamp)),
          isOwn: (msg.senderId === currentUser.id),
          avatar: (msg.senderId === currentUser.id)
            ? currentUser.profileImage || 'https://mui.com/static/images/avatar/4.jpg'
            : conversation.avatar,
        }));
        setMessages(transformedMessages);
        
        // Mark unread messages as read
        const unreadMessages = messageData.filter(
          (msg) => !msg.read && msg.senderId !== currentUser.id
        );
        unreadMessages.forEach((msg) => {
          messageApi.markAsRead(msg._id).catch(console.error);
        });
      }
    } catch (err) {
      console.error("Error fetching messages:", err);
      
      if (err.response?.status === 404) {
        setMessages([]);
      } else if (err.response?.status !== 404) {
        setError(err.response?.data?.message || "Failed to load messages");
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async () => {
    if (messageInput.trim() && selectedChat) {
      const messageText = messageInput.trim();
      setMessageInput('');
      setSending(true);

      try {
        console.log("Sending message from:", currentUser.id, "to:", selectedChat.userId);
        
        const response = await messageApi.sendMessage({
          senderId: currentUser.id,
          receiverId: selectedChat.userId,
          message: messageText,
        });

        console.log("Send message response:", response.data);

        if (response.data.success) {
          const msgData = response.data.data;
          const newMessage = {
            id: msgData._id || Date.now(),
            sender: 'You',
            content: messageText,
            time: formatTime(new Date(msgData.timestamp || Date.now())),
            isOwn: true,
            avatar: currentUser.profileImage || 'https://mui.com/static/images/avatar/4.jpg',
          };
          setMessages((prev) => [...prev, newMessage]);
        }
      } catch (err) {
        console.error("Error sending message:", err);
        setError(err.response?.data?.message || "Failed to send message");
        setMessageInput(messageText);
      } finally {
        setSending(false);
      }
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const handleConversationSelect = (conversation) => {
    setSelectedChat(conversation);
    fetchMessages(conversation);
    setShowSearchResults(false);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatTimeAgo = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Show session error screen
  if (sessionError) {
    return (
      <motion.div
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
      >
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '100vh',
          bgcolor: '#f5f5f5',
          p: 3
        }}>
          <Paper sx={{ p: 4, maxWidth: 500, textAlign: 'center' }}>
            <LogoutIcon sx={{ fontSize: 80, color: '#f44336', mb: 2 }} />
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
              Session Error
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              {error}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Your session data is corrupted (invalid user ID format). This can happen after database updates or system changes.
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={handleForceLogout}
              startIcon={<LogoutIcon />}
              sx={{ borderRadius: 2 }}
            >
              Log In Again
            </Button>
          </Paper>
        </Box>
      </motion.div>
    );
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      {error && !sessionError && (
        <Alert severity="error" onClose={() => setError(null)} sx={{ m: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ 
        height: 'calc(100vh - 100px)', 
        display: 'flex',
        backgroundColor: '#f8f9fa'
      }}>
        {/* Left Sidebar - Conversations List */}
        <Box sx={{ 
          width: { xs: selectedChat ? '0' : '100%', md: '350px' },
          display: { xs: selectedChat ? 'none' : 'flex', md: 'flex' },
          backgroundColor: '#ffffff',
          flexDirection: 'column',
          borderRight: '1px solid #e1e5e9'
        }}>
          {/* Header */}
          <Box sx={{ p: 3, pb: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, color: '#1a1a1a', mb: 3 }}>
              Messages
            </Typography>
            
            {/* Search */}
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search donors to chat..."
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#9e9e9e', fontSize: 20 }} />
                  </InputAdornment>
                ),
                endAdornment: searchLoading && (
                  <InputAdornment position="end">
                    <CircularProgress size={20} />
                  </InputAdornment>
                ),
                sx: { 
                  borderRadius: '20px', 
                  backgroundColor: '#f1f3f4',
                  '& .MuiOutlinedInput-notchedOutline': {
                    border: 'none'
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    border: 'none'
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    border: '1px solid #1976d2'
                  }
                },
              }}
            />
          </Box>

          {/* Search Results Dropdown */}
          <Collapse in={showSearchResults && searchResults.length > 0}>
            <Box sx={{ borderBottom: "2px solid #1976d2", bgcolor: "#e3f2fd", p: 1 }}>
              <Typography variant="caption" sx={{ px: 2, fontWeight: "bold", color: "#1976d2" }}>
                Search Results ({searchResults.length})
              </Typography>
            </Box>
            <List sx={{ maxHeight: "300px", overflowY: "auto", p: 0, borderBottom: "1px solid #e0e0e0" }}>
              {searchResults.map((donor) => (
                <ListItem
                  key={donor._id}
                  button
                  onClick={() => handleSearchResultClick(donor)}
                  sx={{
                    py: 2,
                    px: 3,
                    "&:hover": { bgcolor: "#f5f5f5" },
                  }}
                >
                  <ListItemAvatar>
                    <Avatar src={donor.profileImage || donor.avatar} sx={{ width: 48, height: 48 }}>
                      <DonorIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {donor.name}
                      </Typography>
                    }
                    secondary={
                      <Box sx={{ display: "flex", gap: 0.5, mt: 0.5 }}>
                        <Chip
                          icon={<DonorIcon sx={{ fontSize: 12 }} />}
                          label="Donor"
                          size="small"
                          sx={{
                            height: 20,
                            fontSize: "0.7rem",
                            bgcolor: "#e8f5e9",
                            color: "#2e7d32",
                          }}
                        />
                      </Box>
                    }
                  />
                  <PersonAddIcon sx={{ color: "#1976d2" }} />
                </ListItem>
              ))}
            </List>
          </Collapse>

          {/* Conversations */}
          <List sx={{ flexGrow: 1, overflowY: 'auto', p: 0 }}>
            {!showSearchResults && filteredConversations.length === 0 ? (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  No conversations yet. Search for donors above to start chatting!
                </Typography>
              </Box>
            ) : !showSearchResults ? (
              filteredConversations.map((conv) => (
                <ListItem
                  key={conv.id}
                  button
                  onClick={() => handleConversationSelect(conv)}
                  sx={{ 
                    px: 3,
                    py: 2,
                    backgroundColor: selectedChat?.id === conv.id ? '#e3f2fd' : 'transparent',
                    borderLeft: selectedChat?.id === conv.id ? '4px solid #1976d2' : '4px solid transparent',
                    '&:hover': {
                      backgroundColor: '#f5f5f5'
                    }
                  }}
                >
                  <ListItemAvatar>
                    <Badge
                      overlap="circular"
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                      badgeContent={
                        conv.status === 'Online' ? (
                          <CircleIcon sx={{ fontSize: 12, color: '#4caf50' }} />
                        ) : null
                      }
                    >
                      <Avatar 
                        alt={conv.name} 
                        src={conv.avatar}
                        sx={{ width: 48, height: 48 }}
                      />
                    </Badge>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 500, color: '#1a1a1a' }}>
                          {conv.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#5f6368', fontSize: '0.7rem' }}>
                          {conv.time}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                          {conv.message}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          {conv.isDonor && (
                            <Chip
                              icon={<DonorIcon sx={{ fontSize: 12 }} />}
                              label="Donor"
                              size="small"
                              sx={{
                                height: 20,
                                fontSize: '0.65rem',
                                bgcolor: '#e8f5e9',
                                color: '#2e7d32',
                              }}
                            />
                          )}
                          {conv.unread > 0 && (
                            <Chip
                              label={`${conv.unread} new`}
                              size="small"
                              sx={{
                                height: 20,
                                fontSize: '0.65rem',
                                bgcolor: '#1976d2',
                                color: 'white',
                                fontWeight: 'bold',
                              }}
                            />
                          )}
                        </Box>
                      </Box>
                    }
                  />
                </ListItem>
              ))
            ) : null}
          </List>
        </Box>

        {/* Right Side - Chat Area */}
        <Box sx={{ 
          flexGrow: 1, 
          display: { xs: !selectedChat ? 'none' : 'flex', md: 'flex' },
          flexDirection: 'column', 
          backgroundColor: '#ffffff' 
        }}>
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <Box sx={{ 
                p: 3, 
                display: 'flex', 
                alignItems: 'center', 
                borderBottom: '1px solid #e1e5e9',
                backgroundColor: '#ffffff'
              }}>
                <Avatar 
                  alt={selectedChat.name} 
                  src={selectedChat.avatar} 
                  sx={{ mr: 2, width: 40, height: 40 }} 
                />
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
                    {selectedChat.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: selectedChat.status === 'Online' ? '#4caf50' : '#9e9e9e', fontWeight: 500 }}>
                    {selectedChat.status}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <IconButton sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}>
                    <CallIcon sx={{ color: '#5f6368' }} />
                  </IconButton>
                  <IconButton sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}>
                    <VideocamIcon sx={{ color: '#5f6368' }} />
                  </IconButton>
                  <IconButton sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}>
                    <MoreVertIcon sx={{ color: '#5f6368' }} />
                  </IconButton>
                </Box>
              </Box>
              
              {/* Messages Area */}
              <Box sx={{ 
                flexGrow: 1, 
                p: 3, 
                overflowY: 'auto', 
                backgroundColor: '#f8f9fa',
                display: 'flex',
                flexDirection: 'column',
                gap: 2
              }}>
                {messages.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 8 }}>
                    <Typography variant="body2" color="text.secondary">
                      No messages yet. Start the conversation!
                    </Typography>
                  </Box>
                ) : (
                  messages.map((message) => (
                    <Box 
                      key={message.id}
                      sx={{ 
                        display: 'flex', 
                        justifyContent: message.isOwn ? 'flex-end' : 'flex-start',
                        alignItems: 'flex-start',
                        gap: 1
                      }}
                    >
                      {!message.isOwn && (
                        <Avatar 
                          src={message.avatar} 
                          sx={{ width: 32, height: 32, mt: 0.5 }}
                        />
                      )}
                      <Box sx={{ 
                        maxWidth: '60%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: message.isOwn ? 'flex-end' : 'flex-start'
                      }}>
                        <Paper 
                          elevation={0}
                          sx={{ 
                            p: 2,
                            backgroundColor: message.isOwn ? '#1976d2' : '#ffffff',
                            color: message.isOwn ? 'white' : '#1a1a1a',
                            borderRadius: '18px',
                            border: message.isOwn ? 'none' : '1px solid #e1e5e9',
                            maxWidth: '100%',
                            wordBreak: 'break-word'
                          }}
                        >
                          <Typography variant="body1" sx={{ lineHeight: 1.4 }}>
                            {message.content}
                          </Typography>
                        </Paper>
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            color: '#5f6368', 
                            mt: 0.5,
                            fontSize: '0.75rem'
                          }}
                        >
                          {message.time}
                        </Typography>
                      </Box>
                      {message.isOwn && (
                        <Avatar 
                          src={message.avatar} 
                          sx={{ width: 32, height: 32, mt: 0.5 }}
                        />
                      )}
                    </Box>
                  ))
                )}
                <div ref={messagesEndRef} />
              </Box>

              {/* Message Input */}
              <Box sx={{ 
                p: 3, 
                backgroundColor: '#ffffff',
                borderTop: '1px solid #e1e5e9'
              }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 2,
                  backgroundColor: '#f8f9fa',
                  borderRadius: '24px',
                  px: 2,
                  py: 1
                }}>
                  <IconButton size="small">
                    <EmojiIcon sx={{ color: '#5f6368' }} />
                  </IconButton>
                  <IconButton size="small">
                    <AttachIcon sx={{ color: '#5f6368' }} />
                  </IconButton>
                  <TextField
                    fullWidth
                    variant="standard"
                    placeholder="Type your message..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={sending}
                    InputProps={{
                      disableUnderline: true,
                      sx: { 
                        fontSize: '14px',
                        '& input': {
                          padding: '8px 0'
                        }
                      }
                    }}
                  />
                  <IconButton size="small">
                    <MicIcon sx={{ color: '#5f6368' }} />
                  </IconButton>
                  <IconButton
                    onClick={handleSendMessage}
                    disabled={!messageInput.trim() || sending}
                    sx={{
                      backgroundColor: messageInput.trim() && !sending ? '#1976d2' : 'transparent',
                      color: messageInput.trim() && !sending ? 'white' : '#5f6368',
                      width: 36,
                      height: 36,
                      '&:hover': {
                        backgroundColor: messageInput.trim() && !sending ? '#1565c0' : '#f5f5f5'
                      },
                      '&:disabled': {
                        color: '#5f6368'
                      }
                    }}
                  >
                    {sending ? <CircularProgress size={18} color="inherit" /> : <SendIcon sx={{ fontSize: 18 }} />}
                  </IconButton>
                </Box>
              </Box>
            </>
          ) : (
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              color: 'text.secondary',
              gap: 2,
            }}>
              <DonorIcon sx={{ fontSize: 80, color: '#e0e0e0' }} />
              <Typography variant="h6">
                Select a conversation
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Search for donors above or choose from your conversations
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </motion.div>
  );
};

export default PWDMessagesPage;