const express = require('express');
const http = require('http');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');
const { initSocket } = require('./socket');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messageRoutes');
const { protect } = require('./utils/authMiddleware');
const config = require('./config/config');

const app = express();
const server = http.createServer(app);

// Connect to database
connectDB();

// Initialize Socket.io
initSocket(server);

// ✅ Fixed CORS setup for frontend at localhost:5173
app.use(cors({
  origin: config.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));

// Middleware
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', protect, userRoutes);
app.use('/api/messages', protect, messageRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// ✅ Root route for Render home page
app.get('/', (req, res) => {
  res.send('🔧 Socket.io Chat Backend is running. Visit /api/health for status.');
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = config.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
