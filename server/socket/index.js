const socketio = require('socket.io');
const { updateUserStatus } = require('../controllers/userController');
const { createMessage, markAsRead } = require('../controllers/messageController');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/config');

let io;

const initSocket = (server) => {
  io = socketio(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error'));
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      socket.userId = decoded.id;
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.userId}`);

    // Update user status to online
    updateUserStatus(socket.userId, true);
    socket.broadcast.emit('user-online', { userId: socket.userId });

    // Join user to their own room for private messages
    socket.join(socket.userId);

    // Handle joining rooms
    socket.on('join-room', (room) => {
      socket.join(room);
      console.log(`User ${socket.userId} joined room ${room}`);
    });

    // Handle leaving rooms
    socket.on('leave-room', (room) => {
      socket.leave(room);
      console.log(`User ${socket.userId} left room ${room}`);
    });

    // Handle private messages
    socket.on('private-message', async ({ receiverId, content }, callback) => {
      try {
        const message = await createMessage({
          sender: socket.userId,
          receiver: receiverId,
          content,
        });

        // Emit to sender
        socket.emit('private-message', message);

        // Emit to receiver
        socket.to(receiverId).emit('private-message', message);

        callback({ success: true, message });
      } catch (err) {
        callback({ success: false, error: err.message });
      }
    });

    // Handle room messages
    socket.on('room-message', async ({ room, content }, callback) => {
      try {
        const message = await createMessage({
          sender: socket.userId,
          content,
          room,
        });

        // Emit to all in the room including sender
        io.to(room).emit('room-message', message);

        callback({ success: true, message });
      } catch (err) {
        callback({ success: false, error: err.message });
      }
    });

    // Handle typing indicator
    socket.on('typing', ({ receiverId, isTyping }) => {
      socket.to(receiverId).emit('typing', { senderId: socket.userId, isTyping });
    });

    // Handle read receipts
    socket.on('mark-as-read', async (messageIds) => {
      try {
        await markAsRead(messageIds);
        socket.emit('messages-read', messageIds);
      } catch (err) {
        console.error(err.message);
      }
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.userId}`);
      updateUserStatus(socket.userId, false);
      socket.broadcast.emit('user-offline', { userId: socket.userId });
    });
  });

  return io;
};

const getIo = () => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};

module.exports = { initSocket, getIo };