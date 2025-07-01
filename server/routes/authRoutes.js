const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const { protect } = require('../utils/authMiddleware');


router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe); // ✅ Protect this route

module.exports = router;
