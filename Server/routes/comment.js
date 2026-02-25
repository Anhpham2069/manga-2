const express = require("express");
const router = express.Router();
const commentController = require("../controllers/comment");
const { verifyToken } = require("../controllers/verifyToken");

// Thêm bình luận (cần đăng nhập)
router.post("/add", verifyToken, commentController.addComment);

// Lấy bình luận theo story slug (public)
router.get("/:slug", commentController.getCommentsByStory);

// Xoá bình luận (cần đăng nhập)
router.delete("/delete/:id", verifyToken, commentController.deleteComment);

module.exports = router;
