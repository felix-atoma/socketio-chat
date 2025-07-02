// src/socket/socket.js
import { io } from 'socket.io-client';

// ✅ Use environment variable or fallback
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

// Determine WebSocket protocol: ws:// or wss://
const isSecure = SOCKET_URL.startsWith('https');
const WS_PROTOCOL = isSecure ? 'wss' : 'ws';
const WS_URL = SOCKET_URL.replace(/^http/, WS_PROTOCOL);

let socket = null;

export const initializeSocket = (token) => {
  if (socket && socket.connected) {
    console.log('⚠️ Socket already connected:', socket.id);
    return socket;
  }

  socket = io(WS_URL, {
    auth: { token },
    transports: ['websocket'],
    timeout: 20000, // ⏱️ Increase timeout to 20s
    connectTimeout: 20000,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    withCredentials: true,
  });

  // ✅ Socket event listeners
  socket.on('connect', () => {
    console.log('✅ Socket connected:', socket.id);
  });

  socket.on('connect_error', (err) => {
    console.error('❌ Socket connection error:', err.message, err);
  });

  socket.on('disconnect', (reason) => {
    console.warn('⚠️ Socket disconnected:', reason);
  });

  return socket;
};

export const getSocket = () => {
  if (!socket) {
    console.warn('⚠️ getSocket called before initializeSocket!');
    return null;
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.off(); // ✅ Remove all listeners
    socket.disconnect();
    socket = null;
    console.log('🔌 Socket disconnected and cleaned up.');
  }
};
