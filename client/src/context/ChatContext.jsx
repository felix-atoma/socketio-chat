import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useSocket } from './SocketContext';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState(null);
  const { socket } = useSocket();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await axios.get('/api/users');
        setUsers(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handlePrivateMessage = (message) => {
      if (
        (message.sender._id === currentChat?._id || message.receiver._id === currentChat?._id) ||
        (message.sender._id === currentChat || message.receiver._id === currentChat)
      ) {
        setMessages(prev => [...prev, message]);
      }
    };

    const handleRoomMessage = (message) => {
      if (message.room === currentChat) {
        setMessages(prev => [...prev, message]);
      }
    };

    const handleTyping = ({ senderId, isTyping }) => {
      if (senderId === currentChat?._id || senderId === currentChat) {
        setIsTyping(isTyping);
        setTypingUser(senderId);
      }
    };

    socket.on('private-message', handlePrivateMessage);
    socket.on('room-message', handleRoomMessage);
    socket.on('typing', handleTyping);

    return () => {
      socket.off('private-message', handlePrivateMessage);
      socket.off('room-message', handleRoomMessage);
      socket.off('typing', handleTyping);
    };
  }, [socket, currentChat]);

  const fetchMessages = async (chatId, isRoom = false) => {
    try {
      setLoading(true);
      setMessages([]);
      setCurrentChat(chatId);

      const endpoint = isRoom 
        ? `/api/messages?room=${chatId}`
        : `/api/messages?receiverId=${chatId}`;

      const res = await axios.get(endpoint);
      setMessages(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching messages');
    } finally {
      setLoading(false);
    }
  };

  const sendPrivateMessage = async (receiverId, content) => {
    try {
      if (!socket) throw new Error('Socket not connected');

      return new Promise((resolve, reject) => {
        socket.emit('private-message', { receiverId, content }, (response) => {
          if (response.success) {
            resolve(response.message);
          } else {
            reject(new Error(response.error));
          }
        });
      });
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const sendRoomMessage = async (room, content) => {
    try {
      if (!socket) throw new Error('Socket not connected');

      return new Promise((resolve, reject) => {
        socket.emit('room-message', { room, content }, (response) => {
          if (response.success) {
            resolve(response.message);
          } else {
            reject(new Error(response.error));
          }
        });
      });
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const sendTypingIndicator = (receiverId, isTyping) => {
    if (!socket) return;
    socket.emit('typing', { receiverId, isTyping });
  };

  const markMessagesAsRead = (messageIds) => {
    if (!socket) return;
    socket.emit('mark-as-read', messageIds);
  };

  const joinRoom = (room) => {
    if (!socket) return;
    socket.emit('join-room', room);
  };

  const leaveRoom = (room) => {
    if (!socket) return;
    socket.emit('leave-room', room);
  };

  return (
    <ChatContext.Provider
      value={{
        currentChat,
        messages,
        users,
        loading,
        error,
        isTyping,
        typingUser,
        fetchMessages,
        sendPrivateMessage,
        sendRoomMessage,
        sendTypingIndicator,
        markMessagesAsRead,
        joinRoom,
        leaveRoom,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);

export default ChatProvider;