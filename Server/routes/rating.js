const express = require("express");
const router = express.Router();
const ratingController = require("../controllers/rating");

// Đánh giá truyện (tạo / cập nhật)
router.post("/rate", ratingController.rateStory);

// Lấy rating trung bình của truyện
router.get("/get/:slug", ratingController.getRating);

// Lấy rating của user cho 1 truyện
router.get("/user/:slug/:userId", ratingController.getUserRating);

// Lấy batch rating cho nhiều truyện
router.post("/batch", ratingController.getRatingsBatch);

module.exports = router;
