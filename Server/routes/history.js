const express = require('express');
const router = express.Router();
const readHistoryController = require('../controllers/history');

// Lưu lịch sử đọc truyện mới
router.post('/save', readHistoryController.saveReadHistory);
router.get('/get-all', readHistoryController.getAllReadHistory)
router.get('/last/:slug', readHistoryController.getLatestReadHistory)

// Lấy lịch sử đọc truyện của một người dùng cụ thể
// router.get('/:userId', readHistoryController.getReadHistoryByUser);

module.exports = router;
