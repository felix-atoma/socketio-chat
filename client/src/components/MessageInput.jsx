import { useState, useEffect } from 'react';
import { 
  TextField, 
  IconButton, 
  Box, 
  InputAdornment,
  Typography,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { useChat } from '../context';

const MessageInput = () => {
  const [message, setMessage] = useState('');
  const { 
    currentChat, 
    sendPrivateMessage, 
    sendRoomMessage, 
    sendTypingIndicator,
    isTyping,
    typingUser,
  } = useChat();
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (message.trim() && currentChat) {
      sendTypingIndicator(currentChat._id || currentChat, true);
      const timer = setTimeout(() => {
        sendTypingIndicator(currentChat._id || currentChat, false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [message, currentChat, sendTypingIndicator]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() || !currentChat || isSending) return;

    setIsSending(true);
    try {
      if (typeof currentChat === 'string') {
        // Room chat
        await sendRoomMessage(currentChat, message);
      } else {
        // Private chat
        await sendPrivateMessage(currentChat._id, message);
      }
      setMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
    } finally {
      setIsSending(false);
    }
  };

  if (!currentChat) return null;

  return (
    <Box sx={{ p: 2 }}>
      {isTyping && typingUser && (
        <Typography variant="caption" sx={{ display: 'block', mb: 1 }}>
          {typingUser === currentChat._id ? currentChat.username : 'Someone'} is typing...
        </Typography>
      )}
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type a message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton 
                  type="submit" 
                  color="primary" 
                  disabled={!message.trim() || isSending}
                >
                  <SendIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </form>
    </Box>
  );
};

export default MessageInput;