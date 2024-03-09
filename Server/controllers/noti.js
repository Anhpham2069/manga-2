// controllers/notificationController.js
const Notification = require('../models/noti');

exports.createNotification = async (req, res) => {
  try {
    const newNotification = new Notification(req.body);
    const savedNotification = await newNotification.save();
    res.json(savedNotification);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
