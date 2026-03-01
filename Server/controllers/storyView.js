const StoryView = require("../models/StoryView");

const storyViewController = {
    // Tăng lượt xem cho 1 truyện (không cần đăng nhập)
    incrementView: async (req, res) => {
        try {
            const { slug, storyName } = req.body;

            if (!slug) {
                return res.status(400).json({ message: "Slug là bắt buộc" });
            }

            const view = await StoryView.findOneAndUpdate(
                { slug },
                {
                    $inc: { viewCount: 1 },
                    $set: { lastViewedAt: new Date(), storyName: storyName || "" },
                },
                { upsert: true, new: true }
            );

            res.status(200).json({ slug: view.slug, viewCount: view.viewCount });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Lỗi khi cập nhật lượt xem" });
        }
    },

    // Lấy lượt xem của 1 truyện
    getViewBySlug: async (req, res) => {
        try {
            const { slug } = req.params;
            const view = await StoryView.findOne({ slug });
            res.status(200).json({ slug, viewCount: view?.viewCount || 0 });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Lỗi khi lấy lượt xem" });
        }
    },

    // Lấy tổng lượt xem tất cả truyện
    getTotalViews: async (req, res) => {
        try {
            const result = await StoryView.aggregate([
                { $group: { _id: null, totalViews: { $sum: "$viewCount" } } },
            ]);
            const totalViews = result[0]?.totalViews || 0;
            res.status(200).json({ totalViews });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Lỗi khi lấy tổng lượt xem" });
        }
    },

    // Top truyện xem nhiều nhất
    getTopViewed: async (req, res) => {
        try {
            const limit = parseInt(req.query.limit) || 20;
            const topStories = await StoryView.find()
                .sort({ viewCount: -1 })
                .limit(limit);
            res.status(200).json(topStories);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Lỗi khi lấy top truyện" });
        }
    },

    // Lấy lượt xem của nhiều truyện cùng lúc (batch)
    getViewsBatch: async (req, res) => {
        try {
            const { slugs } = req.body;
            if (!slugs || !Array.isArray(slugs)) {
                return res.status(400).json({ message: "slugs phải là một mảng" });
            }

            const views = await StoryView.find({ slug: { $in: slugs } });
            const viewMap = {};
            views.forEach((v) => {
                viewMap[v.slug] = v.viewCount;
            });

            res.status(200).json(viewMap);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Lỗi khi lấy lượt xem" });
        }
    },
};

module.exports = storyViewController;
