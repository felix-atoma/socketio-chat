const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/config');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  try {
    let token;

    // ✅ Check for Authorization header
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token provided' });
    }

    // ✅ Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    // ✅ Find user and exclude password
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'User not found or unauthorized' });
    }

    // ✅ Attach user to request object
    req.user = user;
    next();

  } catch (err) {
    console.error('❌ Auth Middleware Error:', err.message);
    return res.status(401).json({ message: 'Not authorized, token verification failed' });
  }
};
