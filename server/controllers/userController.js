const User = require('../models/User');

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user.id } }).select('-password');
    res.status(200).json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.updateUserStatus = async (userId, isOnline) => {
  try {
    await User.findByIdAndUpdate(userId, { isOnline, lastSeen: isOnline ? Date.now() : Date.now() });
  } catch (err) {
    console.error(err.message);
  }
};