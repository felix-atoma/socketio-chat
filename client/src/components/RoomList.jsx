import { useState } from 'react';
import { 
  List, 
  ListItem, 
  ListItemText, 
  Divider, 
  Typography,
  Button,
  TextField,
  Box,
} from '@mui/material';
import { useChat } from '../context';

const rooms = ['general', 'random', 'help'];

const RoomList = () => {
  const { currentChat, fetchMessages, joinRoom, leaveRoom } = useChat();
  const [newRoom, setNewRoom] = useState('');

  const handleJoinRoom = (room) => {
    if (currentChat !== room) {
      if (typeof currentChat === 'string') {
        leaveRoom(currentChat);
      }
      joinRoom(room);
      fetchMessages(room, true);
    }
  };

  const handleCreateRoom = () => {
    if (newRoom.trim() && !rooms.includes(newRoom.trim())) {
      rooms.push(newRoom.trim());
      handleJoinRoom(newRoom.trim());
      setNewRoom('');
    }
  };

  return (
    <div style={{ width: '100%' }}>
      <Typography variant="h6" sx={{ p: 2 }}>Rooms</Typography>
      <Box sx={{ p: 2, display: 'flex' }}>
        <TextField
          size="small"
          placeholder="New room name"
          value={newRoom}
          onChange={(e) => setNewRoom(e.target.value)}
          sx={{ flexGrow: 1 }}
        />
        <Button 
          variant="contained" 
          onClick={handleCreateRoom}
          sx={{ ml: 1 }}
        >
          Create
        </Button>
      </Box>
      <List>
        {rooms.map((room) => (
          <div key={room}>
            <ListItem 
              button 
              selected={currentChat === room}
              onClick={() => handleJoinRoom(room)}
            >
              <ListItemText primary={`# ${room}`} />
            </ListItem>
            <Divider />
          </div>
        ))}
      </List>
    </div>
  );
};

export default RoomList;