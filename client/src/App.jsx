import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import { AuthProvider, SocketProvider, ChatProvider } from './context';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ChatPage from './pages/ChatPage';
import PrivateChatPage from './pages/PrivateChatPage';
import RoomChatPage from './pages/RoomChatPage';
import PrivateRoute from './components/PrivateRoute';

const theme = createTheme({
  palette: {
    mode: 'light',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AuthProvider>
          <SocketProvider>
            <ChatProvider>
              <Routes>
                {/* Public routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                
                {/* Protected routes */}
                <Route element={<PrivateRoute />}>
                  <Route path="/chat" element={<ChatPage />}>
                    {/* Default view when no sub-route is selected */}
                    <Route index element={<Navigate to="private" replace />} />
                    
                    {/* Private chat routes */}
                    <Route path="private" element={<PrivateChatPage />} />
                    <Route path="private/:userId" element={<PrivateChatPage />} />
                    
                    {/* Room chat routes */}
                    <Route path="rooms" element={<RoomChatPage />} />
                    <Route path="rooms/:roomId" element={<RoomChatPage />} />
                  </Route>
                </Route>

                {/* Catch-all redirect */}
                <Route path="/" element={<Navigate to="/chat" replace />} />
                <Route path="*" element={<Navigate to="/chat" replace />} />
              </Routes>
            </ChatProvider>
          </SocketProvider>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;