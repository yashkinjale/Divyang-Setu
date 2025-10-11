import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Paper
} from '@mui/material';
import {
  Search as SearchIcon,
  Videocam as VideocamIcon,
  Call as CallIcon,
  MoreVert as MoreVertIcon,
  Send as SendIcon,
  Mic as MicIcon,
  EmojiEmotions as EmojiIcon
} from '@mui/icons-material';

// --- Mock Data ---
const conversations = [
  {
    id: 1,
    name: 'John Doe',
    message: "Hey, how's it going? Did you...",
    avatar: 'https://mui.com/static/images/avatar/1.jpg',
    status: 'Online'
  },
  {
    id: 2,
    name: 'Jane Smith',
    message: "Let's catch up tomorrow for th...",
    avatar: 'https://mui.com/static/images/avatar/2.jpg',
    status: 'Online'
  },
  {
    id: 3,
    name: 'Support Team',
    message: 'We have an update regarding...',
    avatar: 'https://mui.com/static/images/avatar/3.jpg',
    status: 'Online'
  },
];

// Mock messages for the chat
const messages = [
  {
    id: 1,
    sender: 'John Doe',
    content: "Hey, how's it going? Did you see the new scheme for entrepreneurship? It looks promising.",
    time: '10:43 AM',
    isOwn: false,
    avatar: 'https://mui.com/static/images/avatar/1.jpg'
  },
  {
    id: 2,
    sender: 'You',
    content: "Hi John! Yes, I saw it. I was just about to message you. It does look great. I think it's a perfect fit for my project idea.",
    time: '10:44 AM',
    isOwn: true,
    avatar: 'https://mui.com/static/images/avatar/4.jpg'
  },
  {
    id: 3,
    sender: 'John Doe',
    content: "That's awesome! We should definitely discuss this further. Are you free for a call sometime this afternoon?",
    time: '10:44 AM',
    isOwn: false,
    avatar: 'https://mui.com/static/images/avatar/1.jpg'
  }
];

// Page entrance animation variants
const pageVariants = {
  initial: {
    opacity: 0,
    scale: 0.95,
    y: 20
  },
  in: {
    opacity: 1,
    scale: 1,
    y: 0
  },
  out: {
    opacity: 0,
    scale: 0.95,
    y: -20
  }
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.8
};

const MessagesPage = () => {
  const [selectedChat, setSelectedChat] = useState(1);
  const [messageInput, setMessageInput] = useState('');

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      setMessageInput('');
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const selectedConversation = conversations.find(conv => conv.id === selectedChat);

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      <Box sx={{ 
        height: 'calc(100vh - 100px)', 
        display: 'flex',
        backgroundColor: '#f8f9fa'
      }}>
        {/* Left Sidebar - Conversations List */}
        <Box sx={{ 
          width: '350px', 
          backgroundColor: '#ffffff',
          display: 'flex', 
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
              placeholder="Search messages"
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#9e9e9e', fontSize: 20 }} />
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

          {/* Conversations */}
          <List sx={{ flexGrow: 1, overflowY: 'auto', p: 0 }}>
            {conversations.map((conv) => (
              <ListItem
                key={conv.id}
                button
                onClick={() => setSelectedChat(conv.id)}
                sx={{ 
                  px: 3,
                  py: 2,
                  backgroundColor: selectedChat === conv.id ? '#e3f2fd' : 'transparent',
                  borderLeft: selectedChat === conv.id ? '4px solid #1976d2' : '4px solid transparent',
                  '&:hover': {
                    backgroundColor: '#f5f5f5'
                  }
                }}
              >
                <ListItemAvatar>
                  <Avatar 
                    alt={conv.name} 
                    src={conv.avatar}
                    sx={{ width: 48, height: 48 }}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography variant="subtitle1" sx={{ fontWeight: 500, color: '#1a1a1a', mb: 0.5 }}>
                      {conv.name}
                    </Typography>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                        {conv.message}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#4caf50', fontWeight: 500 }}>
                        {conv.status}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Box>

        {/* Right Side - Chat Area */}
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#ffffff' }}>
          {/* Chat Header */}
          <Box sx={{ 
            p: 3, 
            display: 'flex', 
            alignItems: 'center', 
            borderBottom: '1px solid #e1e5e9',
            backgroundColor: '#ffffff'
          }}>
            <Avatar 
              alt={selectedConversation?.name} 
              src={selectedConversation?.avatar} 
              sx={{ mr: 2, width: 40, height: 40 }} 
            />
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
                {selectedConversation?.name}
              </Typography>
              <Typography variant="body2" sx={{ color: '#4caf50', fontWeight: 500 }}>
                Online
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
            {messages.map((message) => (
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
            ))}
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
              <TextField
                fullWidth
                variant="standard"
                placeholder="Type your message..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={handleKeyPress}
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
                disabled={!messageInput.trim()}
                sx={{
                  backgroundColor: messageInput.trim() ? '#1976d2' : 'transparent',
                  color: messageInput.trim() ? 'white' : '#5f6368',
                  width: 36,
                  height: 36,
                  '&:hover': {
                    backgroundColor: messageInput.trim() ? '#1565c0' : '#f5f5f5'
                  },
                  '&:disabled': {
                    color: '#5f6368'
                  }
                }}
              >
                <SendIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Box>
    </motion.div>
  );
};

export default MessagesPage;



