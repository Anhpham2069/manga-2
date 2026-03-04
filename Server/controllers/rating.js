const Rating = require("../models/Rating");

const ratingController = {
    // Đánh giá truyện (tạo mới hoặc cập nhật)
    rateStory: async (req, res) => {
        try {
            const { slug, userId, score } = req.body;

            if (!slug || !userId || !score) {
                return res.status(400).json({ message: "Thiếu thông tin đánh giá" });
            }

            if (score < 1 || score > 5) {
                return res.status(400).json({ message: "Điểm đánh giá phải từ 1 đến 5" });
            }

            const rating = await Rating.findOneAndUpdate(
                { slug, userId },
                { score, updatedAt: new Date() },
                { upsert: true, new: true }
            );

            // Tính trung bình mới
            const stats = await Rating.aggregate([
                { $match: { slug } },
                {
                    $group: {
                        _id: "$slug",
                        averageScore: { $avg: "$score" },
                        totalRatings: { $sum: 1 },
                    },
                },
            ]);

            const result = stats[0] || { averageScore: 0, totalRatings: 0 };

            res.status(200).json({
                message: "Đánh giá thành công",
                userScore: rating.score,
                averageScore: Math.round(result.averageScore * 10) / 10,
                totalRatings: result.totalRatings,
            });
        } catch (error) {
            console.error("Error rating story:", error);
            res.status(500).json({ message: "Lỗi khi đánh giá truyện" });
        }
    },

    // Lấy thông tin đánh giá của truyện
    getRating: async (req, res) => {
        try {
            const { slug } = req.params;

            const stats = await Rating.aggregate([
                { $match: { slug } },
                {
                    $group: {
                        _id: "$slug",
                        averageScore: { $avg: "$score" },
                        totalRatings: { $sum: 1 },
                    },
                },
            ]);

            const result = stats[0] || { averageScore: 0, totalRatings: 0 };

            res.status(200).json({
                averageScore: Math.round(result.averageScore * 10) / 10,
                totalRatings: result.totalRatings,
            });
        } catch (error) {
            console.error("Error getting rating:", error);
            res.status(500).json({ message: "Lỗi khi lấy đánh giá" });
        }
    },

    // Lấy đánh giá của user cho 1 truyện
    getUserRating: async (req, res) => {
        try {
            const { slug, userId } = req.params;

            const rating = await Rating.findOne({ slug, userId });

            res.status(200).json({
                userScore: rating ? rating.score : 0,
            });
        } catch (error) {
            console.error("Error getting user rating:", error);
            res.status(500).json({ message: "Lỗi khi lấy đánh giá người dùng" });
        }
    },

    // Lấy batch rating cho nhiều truyện cùng lúc
    getRatingsBatch: async (req, res) => {
        try {
            const { slugs } = req.body;
            if (!slugs || !Array.isArray(slugs)) {
                return res.status(400).json({ message: "slugs phải là một mảng" });
            }

            const stats = await Rating.aggregate([
                { $match: { slug: { $in: slugs } } },
                {
                    $group: {
                        _id: "$slug",
                        averageScore: { $avg: "$score" },
                        totalRatings: { $sum: 1 },
                    },
                },
            ]);

            const ratingMap = {};
            stats.forEach((s) => {
                ratingMap[s._id] = {
                    averageScore: Math.round(s.averageScore * 10) / 10,
                    totalRatings: s.totalRatings,
                };
            });

            res.status(200).json(ratingMap);
        } catch (error) {
            console.error("Error getting batch ratings:", error);
            res.status(500).json({ message: "Lỗi khi lấy đánh giá" });
        }
    },
};

module.exports = ratingController;
