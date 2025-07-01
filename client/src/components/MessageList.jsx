import { useEffect, useRef } from 'react';
import { 
  List, 
  ListItem, 
  ListItemText, 
  Avatar, 
  Typography, 
  Box, 
  CircularProgress,
} from '@mui/material';
import { useChat } from '../context';

const MessageList = () => {
  const { messages, currentChat, loading, user } = useChat();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!currentChat) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <Typography variant="h6" color="textSecondary">
          Select a chat to start messaging
        </Typography>
      </Box>
    );
  }

  return (
    <List sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
      {messages.map((message) => (
        <ListItem 
          key={message._id} 
          sx={{ 
            justifyContent: message.sender._id === user?.id ? 'flex-end' : 'flex-start',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: message.sender._id === user?.id ? 'row-reverse' : 'row',
              alignItems: 'flex-end',
              maxWidth: '70%',
            }}
          >
            {message.sender._id !== user?.id && (
              <Avatar sx={{ mr: 1 }}>
                {message.sender.username.charAt(0).toUpperCase()}
              </Avatar>
            )}
            <Box
              sx={{
                bgcolor: message.sender._id === user?.id ? 'primary.main' : 'grey.300',
                color: message.sender._id === user?.id ? 'primary.contrastText' : 'text.primary',
                borderRadius: 2,
                p: 1.5,
                wordBreak: 'break-word',
              }}
            >
              <ListItemText 
                primary={message.content} 
                secondary={
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      display: 'block', 
                      textAlign: 'right',
                      color: message.sender._id === user?.id ? 'primary.contrastText' : 'text.secondary',
                    }}
                  >
                    {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    {message.sender._id === user?.id && (
                      message.isRead ? ' ✓✓' : ' ✓'
                    )}
                  </Typography>
                }
              />
            </Box>
          </Box>
        </ListItem>
      ))}
      <div ref={messagesEndRef} />
    </List>
  );
};

export default MessageList;