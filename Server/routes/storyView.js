const express = require("express");
const router = express.Router();
const storyViewController = require("../controllers/storyView");

// Tăng lượt xem (không cần đăng nhập)
router.post("/increment", storyViewController.incrementView);

// Lấy lượt xem theo slug
router.get("/get/:slug", storyViewController.getViewBySlug);

// Lấy tổng lượt xem
router.get("/total", storyViewController.getTotalViews);

// Top truyện xem nhiều
router.get("/top", storyViewController.getTopViewed);

// Lấy batch lượt xem
router.post("/batch", storyViewController.getViewsBatch);

// Lấy tổng lượt xem hôm nay
router.get("/today", storyViewController.getTodayViews);

// Lấy lượt xem theo khoảng ngày (biểu đồ)
router.get("/daily-range", storyViewController.getViewsByDateRange);

module.exports = router;
