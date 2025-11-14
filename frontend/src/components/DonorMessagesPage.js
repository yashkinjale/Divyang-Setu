import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Avatar,
  Typography,
  TextField,
  IconButton,
  Paper,
  Divider,
  Badge,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  InputAdornment,
  CircularProgress,
  Alert,
  Collapse,
} from "@mui/material";
import {
  Send as SendIcon,
  AttachFile as AttachIcon,
  EmojiEmotions as EmojiIcon,
  Person as PersonIcon,
  Circle as CircleIcon,
  Call as CallIcon,
  Videocam as VideocamIcon,
  MoreVert as MoreVertIcon,
  Search as SearchIcon,
  Accessibility as AccessibilityIcon,
  ArrowBack as ArrowBackIcon,
  PersonAdd as PersonAddIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { messageApi, authHelpers } from "../utils/api";
import DonorNavbar from "./DonorNavbar";

const DonorMessagesPage = ({ profile }) => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sending, setSending] = useState(false);
  
  // Search states
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  
  const messagesEndRef = useRef(null);
  const searchTimeoutRef = useRef(null);
  const currentUserRef = useRef(authHelpers.getCurrentUser());
  const currentUser = currentUserRef.current;

  // Fetch conversations on mount
  useEffect(() => {
    let isMounted = true;
    
    if (currentUser?.id && isMounted) {
      fetchConversations();
    }
    
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle profile prop and auto-select
  useEffect(() => {
    if (conversations.length === 0) return;
    
    if (profile && !selectedConversation) {
      const profileConv = conversations.find((c) => c.userId === profile.id || c.name === profile.name);
      if (profileConv) {
        setSelectedConversation(profileConv);
        fetchMessages(profileConv);
      }
    } else if (!selectedConversation) {
      setSelectedConversation(conversations[0]);
      fetchMessages(conversations[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversations.length]);

  // Search for PWDs with debouncing
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
      searchPWDs(searchTerm);
    }, 500);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  const searchPWDs = async (query) => {
    try {
      setSearchLoading(true);
      const response = await messageApi.searchPWD(query);
      
      if (response.data.success) {
        setSearchResults(response.data.pwds || response.data.data || []);
        setShowSearchResults(true);
      }
    } catch (err) {
      console.error("Error searching PWDs:", err);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSearchResultClick = (pwd) => {
    const newConversation = {
      id: pwd._id,
      userId: pwd._id,
      name: pwd.name,
      avatar: pwd.profileImage || pwd.avatar,
      lastMessage: "Start a new conversation",
      time: "Now",
      unread: 0,
      online: false,
      disability: pwd.disability,
      location: pwd.location,
      age: pwd.age,
    };
    
    setSelectedConversation(newConversation);
    setMessages([]);
    setSearchTerm("");
    setShowSearchResults(false);
  };

  const fetchConversations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Check if currentUser and id exist
      if (!currentUser || !currentUser.id) {
        console.error("No current user found");
        setError("User not authenticated");
        setLoading(false);
        return;
      }

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
          id: conv.otherUser?._id || conv._id,
          userId: conv.otherUser?._id || conv._id,
          name: conv.otherUser?.name || conv.name,
          avatar: conv.otherUser?.profileImage || conv.profileImage || conv.avatar,
          lastMessage: conv.lastMessage?.content || conv.lastMessage || "No messages yet",
          time: formatTimeAgo(conv.lastMessage?.createdAt || conv.lastMessageTime),
          unread: conv.unreadCount || 0,
          online: conv.otherUser?.online || false,
          disability: conv.otherUser?.disability || conv.disability || "",
          location: conv.otherUser?.location || conv.location || "",
          age: conv.otherUser?.age || conv.age || 0,
        }));
        setConversations(transformedConversations);
      }
    } catch (err) {
      console.error("Error fetching conversations:", err);
      console.error("Error response:", err.response?.data);
      
      // If it's a 404 or no conversations, just show empty state
      if (err.response?.status === 404) {
        setConversations([]);
      } else {
        setError(err.response?.data?.message || err.message || "Failed to load conversations");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversation) => {
    try {
      setError(null);
      const response = await messageApi.getMessages(currentUser.id, conversation.userId);
      
      if (response.data.success) {
        const msgData = response.data.messages || response.data.data || [];
        const transformedMessages = msgData.map((msg) => ({
          id: msg._id || msg.id,
          sender: (msg.senderId === currentUser.id || msg.sender === currentUser.id) ? "donor" : "pwd",
          text: msg.content || msg.message || msg.text,
          timestamp: new Date(msg.createdAt || msg.timestamp),
          read: msg.read,
        }));
        setMessages(transformedMessages);
        
        // Mark messages as read
        const unreadMessages = msgData.filter(
          (msg) => !msg.read && (msg.senderId !== currentUser.id && msg.sender !== currentUser.id)
        );
        unreadMessages.forEach((msg) => {
          messageApi.markAsRead(msg._id || msg.id).catch(console.error);
        });
      }
    } catch (err) {
      console.error("Error fetching messages:", err);
      if (err.response?.status !== 404) {
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
    if (message.trim() && selectedConversation) {
      const messageText = message.trim();
      setMessage("");
      setSending(true);

      try {
        const response = await messageApi.sendMessage({
          senderId: currentUser.id,
          receiverId: selectedConversation.userId,
          content: messageText,
        });

        if (response.data.success) {
          const msgData = response.data.message || response.data.data;
          const newMessage = {
            id: msgData._id || msgData.id,
            sender: "donor",
            text: messageText,
            timestamp: new Date(msgData.createdAt || msgData.timestamp || Date.now()),
            read: false,
          };
          setMessages((prev) => [...prev, newMessage]);
        }
      } catch (err) {
        console.error("Error sending message:", err);
        setError(err.response?.data?.message || "Failed to send message");
        setMessage(messageText);
      } finally {
        setSending(false);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleConversationSelect = (conversation) => {
    setSelectedConversation(conversation);
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

  if (loading && conversations.length === 0) {
    return (
      <Box sx={{ minHeight: "100vh", bgcolor: "#f5f5f5" }}>
        <DonorNavbar />
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
          <CircularProgress size={60} />
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f5f5" }}>
      <DonorNavbar />

      {error && (
        <Alert severity="error" onClose={() => setError(null)} sx={{ m: 2 }}>
          {error}
        </Alert>
      )}

      <Box
        sx={{
          display: "flex",
          height: "calc(100vh - 64px)",
          maxWidth: "1400px",
          mx: "auto",
        }}
      >
        {/* Left Sidebar */}
        <Paper
          sx={{
            width: { xs: "100%", md: "400px" },
            display: { xs: selectedConversation ? "none" : "flex", md: "flex" },
            flexDirection: "column",
            borderRadius: 0,
            borderRight: "1px solid #e0e0e0",
          }}
        >
          <Box sx={{ p: 2, borderBottom: "1px solid #e0e0e0" }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
              💬 Messages
            </Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="Search PWDs to chat..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "#9e9e9e" }} />
                  </InputAdornment>
                ),
                endAdornment: searchLoading && (
                  <InputAdornment position="end">
                    <CircularProgress size={20} />
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: "20px",
                  bgcolor: "#f5f5f5",
                  "& .MuiOutlinedInput-notchedOutline": { border: "none" },
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
              {searchResults.map((pwd) => (
                <ListItem
                  key={pwd._id}
                  button
                  onClick={() => handleSearchResultClick(pwd)}
                  sx={{
                    py: 2,
                    px: 2,
                    "&:hover": { bgcolor: "#f5f5f5" },
                  }}
                >
                  <ListItemAvatar>
                    <Avatar src={pwd.profileImage || pwd.avatar} sx={{ width: 48, height: 48 }}>
                      <PersonIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    sx={{ ml: 1 }}
                    primary={
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {pwd.name}
                      </Typography>
                    }
                    secondary={
                      <Box sx={{ display: "flex", gap: 0.5, mt: 0.5, flexWrap: "wrap" }}>
                        {pwd.disability && (
                          <Chip
                            icon={<AccessibilityIcon sx={{ fontSize: 12 }} />}
                            label={pwd.disability}
                            size="small"
                            sx={{
                              height: 20,
                              fontSize: "0.7rem",
                              bgcolor: "#e3f2fd",
                              color: "#1976d2",
                            }}
                          />
                        )}
                        {pwd.age && (
                          <Chip
                            label={`${pwd.age} yrs`}
                            size="small"
                            sx={{
                              height: 20,
                              fontSize: "0.7rem",
                              bgcolor: "#f3e5f5",
                              color: "#7b1fa2",
                            }}
                          />
                        )}
                      </Box>
                    }
                  />
                  <PersonAddIcon sx={{ color: "#1976d2" }} />
                </ListItem>
              ))}
            </List>
          </Collapse>

          {/* Conversations List */}
          <List sx={{ flexGrow: 1, overflowY: "auto", p: 0 }}>
            {!showSearchResults && filteredConversations.length === 0 ? (
              <Box sx={{ p: 4, textAlign: "center" }}>
                <Typography variant="body2" color="text.secondary">
                  No conversations yet. Search for PWDs above to start chatting!
                </Typography>
              </Box>
            ) : !showSearchResults ? (
              filteredConversations.map((conv) => (
                <ListItem
                  key={conv.id}
                  button
                  onClick={() => handleConversationSelect(conv)}
                  sx={{
                    py: 2.5,
                    px: 2,
                    bgcolor:
                      selectedConversation?.id === conv.id
                        ? "#e3f2fd"
                        : "transparent",
                    borderLeft:
                      selectedConversation?.id === conv.id
                        ? "4px solid #1976d2"
                        : "4px solid transparent",
                    "&:hover": { bgcolor: "#f5f5f5" },
                  }}
                >
                  <ListItemAvatar>
                    <Badge
                      overlap="circular"
                      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                      badgeContent={
                        conv.online ? (
                          <CircleIcon sx={{ fontSize: 14, color: "#4caf50" }} />
                        ) : null
                      }
                    >
                      <Avatar src={conv.avatar} sx={{ width: 56, height: 56 }}>
                        <PersonIcon />
                      </Avatar>
                    </Badge>
                  </ListItemAvatar>
                  <ListItemText
                    sx={{ ml: 1 }}
                    primary={
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          mb: 0.5,
                        }}
                      >
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: 600, fontSize: "1rem" }}
                        >
                          {conv.name}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: "text.secondary", fontSize: "0.7rem" }}
                        >
                          {conv.time}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            fontSize: "0.85rem",
                            mb: 0.8,
                          }}
                        >
                          {conv.lastMessage}
                        </Typography>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 0.8, flexWrap: "wrap" }}
                        >
                          {conv.disability && (
                            <Chip
                              icon={<AccessibilityIcon sx={{ fontSize: 14 }} />}
                              label={conv.disability}
                              size="small"
                              sx={{
                                height: 22,
                                fontSize: "0.7rem",
                                bgcolor: "#e3f2fd",
                                color: "#1976d2",
                              }}
                            />
                          )}
                          {conv.unread > 0 && (
                            <Chip
                              label={`${conv.unread} new`}
                              size="small"
                              sx={{
                                height: 22,
                                fontSize: "0.7rem",
                                bgcolor: "#1976d2",
                                color: "white",
                                fontWeight: "bold",
                              }}
                            />
                          )}
                        </Box>
                      </>
                    }
                  />
                </ListItem>
              ))
            ) : null}
          </List>
        </Paper>

        {/* Right Side - Chat Area */}
        <Box
          sx={{
            flexGrow: 1,
            display: { xs: !selectedConversation ? "none" : "flex", md: "flex" },
            flexDirection: "column",
            bgcolor: "white",
          }}
        >
          {selectedConversation ? (
            <>
              <Paper
                sx={{
                  p: 2.5,
                  display: "flex",
                  alignItems: "center",
                  borderRadius: 0,
                  borderBottom: "1px solid #e0e0e0",
                  boxShadow: 2,
                }}
              >
                <IconButton
                  sx={{ display: { xs: "block", md: "none" }, mr: 1 }}
                  onClick={() => setSelectedConversation(null)}
                >
                  <ArrowBackIcon />
                </IconButton>
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  badgeContent={
                    selectedConversation.online ? (
                      <CircleIcon sx={{ fontSize: 14, color: "#4caf50" }} />
                    ) : null
                  }
                >
                  <Avatar
                    src={selectedConversation.avatar}
                    sx={{ width: 50, height: 50, mr: 2 }}
                  >
                    <PersonIcon />
                  </Avatar>
                </Badge>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, fontSize: "1.1rem" }}>
                    {selectedConversation.name}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
                    <Typography
                      variant="caption"
                      sx={{
                        color: selectedConversation.online ? "#4caf50" : "text.secondary",
                        fontWeight: 600,
                      }}
                    >
                      {selectedConversation.online ? "● Online" : "○ Offline"}
                    </Typography>
                    {selectedConversation.disability && (
                      <Typography variant="caption" color="text.secondary">
                        • {selectedConversation.disability}
                      </Typography>
                    )}
                  </Box>
                </Box>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <IconButton color="primary" size="small">
                    <CallIcon />
                  </IconButton>
                  <IconButton color="primary" size="small">
                    <VideocamIcon />
                  </IconButton>
                  <IconButton size="small">
                    <MoreVertIcon />
                  </IconButton>
                </Box>
              </Paper>

              <Box
                sx={{
                  flexGrow: 1,
                  overflowY: "auto",
                  p: 3,
                  bgcolor: "#f8f9fa",
                  backgroundImage:
                    "linear-gradient(rgba(25,118,210,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(25,118,210,0.03) 1px, transparent 1px)",
                  backgroundSize: "20px 20px",
                }}
              >
                {messages.length === 0 ? (
                  <Box sx={{ textAlign: "center", py: 8 }}>
                    <Typography variant="body2" color="text.secondary">
                      No messages yet. Start the conversation!
                    </Typography>
                  </Box>
                ) : (
                  messages.map((msg, index) => (
                    <Box
                      key={msg.id}
                      sx={{
                        display: "flex",
                        justifyContent:
                          msg.sender === "donor" ? "flex-end" : "flex-start",
                        mb: 2,
                        animation: index === messages.length - 1 ? "fadeIn 0.3s ease-in" : "none",
                        "@keyframes fadeIn": {
                          from: { opacity: 0, transform: "translateY(10px)" },
                          to: { opacity: 1, transform: "translateY(0)" },
                        },
                      }}
                    >
                      <Paper
                        elevation={2}
                        sx={{
                          maxWidth: "65%",
                          p: 2,
                          bgcolor: msg.sender === "donor" ? "#1976d2" : "white",
                          color: msg.sender === "donor" ? "white" : "black",
                          borderRadius:
                            msg.sender === "donor"
                              ? "18px 18px 4px 18px"
                              : "18px 18px 18px 4px",
                        }}
                      >
                        <Typography variant="body2" sx={{ mb: 0.5, lineHeight: 1.6 }}>
                          {msg.text}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            display: "block",
                            textAlign: "right",
                            opacity: 0.8,
                            fontSize: "0.7rem",
                          }}
                        >
                          {formatTime(msg.timestamp)}
                        </Typography>
                      </Paper>
                    </Box>
                  ))
                )}
                <div ref={messagesEndRef} />
              </Box>

              <Divider />

              <Box sx={{ p: 2.5, bgcolor: "white" }}>
                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    alignItems: "flex-end",
                    bgcolor: "#f5f5f5",
                    borderRadius: "24px",
                    px: 2,
                    py: 1,
                    border: "2px solid transparent",
                    "&:focus-within": {
                      border: "2px solid #1976d2",
                      bgcolor: "white",
                    },
                  }}
                >
                  <IconButton size="small" color="primary">
                    <EmojiIcon />
                  </IconButton>
                  <IconButton size="small" color="primary">
                    <AttachIcon />
                  </IconButton>
                  <TextField
                    fullWidth
                    multiline
                    maxRows={4}
                    placeholder="Type your message to help..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={sending}
                    variant="standard"
                    InputProps={{
                      disableUnderline: true,
                      sx: { fontSize: "0.95rem", py: 0.5 },
                    }}
                  />
                  <IconButton
                    color="primary"
                    onClick={handleSendMessage}
                    disabled={!message.trim() || sending}
                    sx={{
                      bgcolor: message.trim() && !sending ? "primary.main" : "grey.300",
                      color: "white",
                      width: 40,
                      height: 40,
                      "&:hover": {
                        bgcolor: message.trim() && !sending ? "primary.dark" : "grey.300",
                      },
                      "&:disabled": {
                        bgcolor: "grey.300",
                        color: "white",
                      },
                    }}
                  >
                    {sending ? <CircularProgress size={20} color="inherit" /> : <SendIcon sx={{ fontSize: 20 }} />}
                  </IconButton>
                </Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: "block", mt: 1, ml: 2, fontSize: "0.7rem" }}
                >
                  Press Enter to send • Shift+Enter for new line
                </Typography>
              </Box>
            </>
          ) : (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                color: "text.secondary",
                gap: 2,
              }}
            >
              <AccessibilityIcon sx={{ fontSize: 80, color: "#e0e0e0" }} />
              <Typography variant="h6">
                Select a conversation to start helping
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Search for PWDs above or choose from your conversations
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default DonorMessagesPage;