const Comment = require("../models/Comment");

// Thêm bình luận
exports.addComment = async (req, res) => {
    try {
        const { storySlug, userId, username, content, parentId } = req.body;

        if (!storySlug || !content) {
            return res.status(400).json({ message: "storySlug và content là bắt buộc" });
        }

        const newComment = new Comment({
            storySlug,
            userId,
            username,
            content,
            parentId: parentId || null,
        });

        const savedComment = await newComment.save();
        res.status(201).json(savedComment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi khi thêm bình luận" });
    }
};

// Lấy tất cả bình luận (admin)
exports.getAllComments = async (req, res) => {
    try {
        const comments = await Comment.find()
            .populate("userId", "avatar username")
            .sort({ createdAt: -1 });
        res.status(200).json(comments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi khi lấy tất cả bình luận" });
    }
};

// Lấy tất cả bình luận theo story slug
exports.getCommentsByStory = async (req, res) => {
    try {
        const { slug } = req.params;
        const comments = await Comment.find({ storySlug: slug })
            .populate("userId", "avatar")
            .sort({ createdAt: -1 });
        res.status(200).json(comments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi khi lấy bình luận" });
    }
};

// Xoá bình luận (chỉ chủ comment hoặc admin)
exports.deleteComment = async (req, res) => {
    try {
        const { id } = req.params;
        const comment = await Comment.findById(id);

        if (!comment) {
            return res.status(404).json({ message: "Không tìm thấy bình luận" });
        }

        // Chỉ cho phép chủ comment hoặc admin xoá
        if (comment.userId.toString() !== req.user.id && !req.user.admin) {
            return res.status(403).json({ message: "Bạn không có quyền xoá bình luận này" });
        }

        await Comment.findByIdAndDelete(id);
        res.status(200).json({ message: "Đã xoá bình luận" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi khi xoá bình luận" });
    }
};

// Admin xoá bình luận (không cần kiểm tra quyền sở hữu)
exports.adminDeleteComment = async (req, res) => {
    try {
        const { id } = req.params;
        const comment = await Comment.findById(id);

        if (!comment) {
            return res.status(404).json({ message: "Không tìm thấy bình luận" });
        }

        await Comment.findByIdAndDelete(id);
        res.status(200).json({ message: "Đã xoá bình luận" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi khi xoá bình luận" });
    }
};
