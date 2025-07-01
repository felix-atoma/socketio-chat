import { createContext, useContext, useEffect, useState } from 'react';
import { getSocket } from '../socket/socket';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    try {
      const socketInstance = getSocket();
      setSocket(socketInstance);

      socketInstance?.on('user-online', ({ userId }) => {
        setOnlineUsers(prev => [...new Set([...prev, userId])]);
      });

      socketInstance?.on('user-offline', ({ userId }) => {
        setOnlineUsers(prev => prev.filter(id => id !== userId));
      });

      return () => {
        socketInstance?.off('user-online');
        socketInstance?.off('user-offline');
      };
    } catch (err) {
      console.error('Socket not initialized');
    }
  }, []);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);

export default SocketProvider;