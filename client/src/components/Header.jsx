import { AppBar, Toolbar, Typography, Button, Avatar } from '@mui/material';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <AppBar position="fixed">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Socket.io Chat
        </Typography>
        {user && (
          <>
            <Avatar sx={{ mr: 2 }}>
              {user.username?.charAt(0).toUpperCase()}
            </Avatar>
            <Typography variant="subtitle1" sx={{ mr: 2 }}>
              {user.username}
            </Typography>
            <Button color="inherit" onClick={logout}>
              Logout
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
