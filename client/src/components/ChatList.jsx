import { useState, useEffect } from 'react';
import { Button } from '@mui/material';

import { 
  List, 
  ListItem, 
  ListItemAvatar, 
  Avatar, 
  ListItemText, 
  Badge,
  Divider,
  Typography,
  CircularProgress,
} from '@mui/material';
import { useChat, useSocket } from '../context';

const ChatList = () => {
  const { users, currentChat, fetchMessages, loading } = useChat();
  const { onlineUsers } = useSocket();
  const [filter, setFilter] = useState('all'); // 'all', 'online', 'offline'

  const filteredUsers = users.filter(user => {
    if (filter === 'all') return true;
    if (filter === 'online') return onlineUsers.includes(user._id);
    if (filter === 'offline') return !onlineUsers.includes(user._id);
    return true;
  });

  return (
    <div style={{ width: '100%' }}>
      <Typography variant="h6" sx={{ p: 2 }}>Users</Typography>
      <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '10px' }}>
        <Button 
          variant={filter === 'all' ? 'contained' : 'outlined'} 
          size="small"
          onClick={() => setFilter('all')}
        >
          All
        </Button>
        <Button 
          variant={filter === 'online' ? 'contained' : 'outlined'} 
          size="small"
          onClick={() => setFilter('online')}
        >
          Online
        </Button>
        <Button 
          variant={filter === 'offline' ? 'contained' : 'outlined'} 
          size="small"
          onClick={() => setFilter('offline')}
        >
          Offline
        </Button>
      </div>
      {loading ? (
        <CircularProgress sx={{ display: 'block', margin: '20px auto' }} />
      ) : (
        <List>
          {filteredUsers.map((user) => (
            <div key={user._id}>
              <ListItem 
                button 
                selected={currentChat?._id === user._id}
                onClick={() => fetchMessages(user._id)}
              >
                <ListItemAvatar>
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    variant="dot"
                    color={onlineUsers.includes(user._id) ? 'success' : 'error'}
                  >
                    <Avatar>{user.username.charAt(0).toUpperCase()}</Avatar>
                  </Badge>
                </ListItemAvatar>
                <ListItemText 
                  primary={user.username} 
                  secondary={onlineUsers.includes(user._id) ? 'Online' : 'Offline'} 
                />
              </ListItem>
              <Divider variant="inset" component="li" />
            </div>
          ))}
        </List>
      )}
    </div>
  );
};

export default ChatList;