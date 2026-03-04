const express = require("express");
const router = express.Router();
const commentController = require("../controllers/comment");
const { verifyToken } = require("../controllers/verifyToken");

// Thêm bình luận (cần đăng nhập)
router.post("/add", verifyToken, commentController.addComment);

// Lấy tất cả bình luận (admin)
router.get("/all", commentController.getAllComments);

// Lấy bình luận theo story slug (public)
router.get("/:slug", commentController.getCommentsByStory);

// Xoá bình luận (cần đăng nhập)
router.delete("/delete/:id", verifyToken, commentController.deleteComment);

// Admin xoá bình luận
router.delete("/admin/delete/:id", commentController.adminDeleteComment);

module.exports = router;
