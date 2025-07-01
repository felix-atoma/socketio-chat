import { Box, Grid } from '@mui/material';
import ChatList from '../components/ChatList';
import MessageList from '../components/MessageList';
import MessageInput from '../components/MessageInput';

const PrivateChatPage = () => {
  return (
    <Grid container sx={{ height: 'calc(100vh - 64px)' }}>
      <Grid item xs={12} md={4} sx={{ borderRight: '1px solid rgba(0, 0, 0, 0.12)' }}>
        <ChatList />
      </Grid>
      <Grid item xs={12} md={8} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <MessageList />
        <MessageInput />
      </Grid>
    </Grid>
  );
};

export default PrivateChatPage;