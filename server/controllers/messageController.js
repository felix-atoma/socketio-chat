const Message = require('../models/Message');
const User = require('../models/User');

exports.getMessages = async (req, res) => {
  try {
    const { room, receiverId } = req.query;
    let query = {};

    if (room) {
      query.room = room;
    } else if (receiverId) {
      query.$or = [
        { sender: req.user.id, receiver: receiverId },
        { sender: receiverId, receiver: req.user.id },
      ];
    } else {
      return res.status(400).json({ message: 'Either room or receiverId is required' });
    }

    const messages = await Message.find(query)
      .populate('sender', 'username')
      .populate('receiver', 'username')
      .sort('createdAt');

    res.status(200).json(messages);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.createMessage = async (data) => {
  try {
    const { sender, receiver, content, room } = data;
    
    const message = new Message({
      sender,
      receiver: receiver || null,
      content,
      room: room || null,
    });

    await message.save();

    const populatedMessage = await Message.populate(message, [
      { path: 'sender', select: 'username' },
      { path: 'receiver', select: 'username' },
    ]);

    return populatedMessage;
  } catch (err) {
    console.error(err.message);
    throw err;
  }
};

exports.markAsRead = async (messageIds) => {
  try {
    await Message.updateMany(
      { _id: { $in: messageIds } },
      { $set: { isRead: true } }
    );
  } catch (err) {
    console.error(err.message);
    throw err;
  }
};