import { Box, Grid } from '@mui/material';
import RoomList from '../components/RoomList';
import MessageList from '../components/MessageList';
import MessageInput from '../components/MessageInput';

const RoomChatPage = () => {
  return (
    <Grid container sx={{ height: 'calc(100vh - 64px)' }}>
      <Grid item xs={12} md={4} sx={{ borderRight: '1px solid rgba(0, 0, 0, 0.12)' }}>
        <RoomList />
      </Grid>
      <Grid item xs={12} md={8} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <MessageList />
        <MessageInput />
      </Grid>
    </Grid>
  );
};

export default RoomChatPage;