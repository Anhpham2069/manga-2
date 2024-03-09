// routes/notificationRoutes.js
const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/noti');

router.post('/noti', notificationController.createNotification);

module.exports = router;
