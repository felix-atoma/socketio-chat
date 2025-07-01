import { List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import ChatIcon from '@mui/icons-material/Chat';
import GroupIcon from '@mui/icons-material/Group';

const Sidebar = () => {
  const location = useLocation();

  return (
    <List>
      <ListItem 
        button 
        component={Link} 
        to="/chat/private" 
        selected={location.pathname.includes('/private')}
      >
        <ListItemIcon>
          <ChatIcon />
        </ListItemIcon>
        <ListItemText primary="Private Chat" />
      </ListItem>
      <ListItem 
        button 
        component={Link} 
        to="/chat/rooms" 
        selected={location.pathname.includes('/rooms')}
      >
        <ListItemIcon>
          <GroupIcon />
        </ListItemIcon>
        <ListItemText primary="Rooms" />
      </ListItem>
    </List>
  );
};

export default Sidebar;