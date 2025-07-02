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
    socketConnected,
  } = useChat();
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState(null);

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
    if (!message.trim() || !currentChat || isSending || !socketConnected) {
      setSendError(!socketConnected ? 'Not connected to chat server.' : null);
      return;
    }

    setIsSending(true);
    setSendError(null);

    try {
      if (typeof currentChat === 'string') {
        await sendRoomMessage(currentChat, message);
      } else {
        await sendPrivateMessage(currentChat._id, message);
      }
      setMessage('');
    } catch (err) {
      setSendError(err.message);
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

      {sendError && (
        <Typography variant="caption" color="error" sx={{ mb: 1, display: 'block' }}>
          {sendError}
        </Typography>
      )}

      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder={socketConnected ? 'Type a message' : 'Disconnected...'}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={!socketConnected}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  type="submit"
                  color="primary"
                  disabled={!message.trim() || isSending || !socketConnected}
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
