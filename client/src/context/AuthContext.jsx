import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { jwtDecode } from 'jwt-decode';
import { initializeSocket, disconnectSocket } from '../socket/socket';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // ✅ Apply token to Axios and initialize socket
  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      initializeSocket(token);
    } else {
      delete api.defaults.headers.common['Authorization'];
      disconnectSocket();
    }
  }, [token]);

  // ✅ Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
        setIsAuthenticated(true);

        // Optional: verify token by fetching current user
        await api.get('/auth/me');
      } catch (err) {
        console.error('Auth check failed:', err);
        logout(false); // avoid redirect on first load
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // ✅ Login handler
  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token, user } = res.data;

      localStorage.setItem('token', token);
      setToken(token);
      setUser(user);
      setIsAuthenticated(true);
      setError(null);

      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed';
      setError(msg);
      return { success: false, error: msg };
    }
  };

  // ✅ Registration handler
  const register = async (username, email, password) => {
    try {
      const res = await api.post('/auth/register', { username, email, password });
      const { token, user } = res.data;

      localStorage.setItem('token', token);
      setToken(token);
      setUser(user);
      setIsAuthenticated(true);
      setError(null);

      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed';
      setError(msg);
      return { success: false, error: msg };
    }
  };

  // ✅ Logout (optional redirect)
  const logout = (redirect = true) => {
    localStorage.removeItem('token');
    setToken('');
    setUser(null);
    setIsAuthenticated(false);
    delete api.defaults.headers.common['Authorization'];
    disconnectSocket();
    if (redirect) navigate('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        loading,
        error,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthProvider;
