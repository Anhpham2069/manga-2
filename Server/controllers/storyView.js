const StoryView = require("../models/StoryView");
const DailyViewCount = require("../models/DailyViewCount");

const storyViewController = {
    // Tăng lượt xem cho 1 truyện (không cần đăng nhập)
    incrementView: async (req, res) => {
        try {
            const { slug, storyName } = req.body;

            if (!slug) {
                return res.status(400).json({ message: "Slug là bắt buộc" });
            }

            // 1. Tăng tổng lượt xem (all-time)
            const view = await StoryView.findOneAndUpdate(
                { slug },
                {
                    $inc: { viewCount: 1 },
                    $set: { lastViewedAt: new Date(), storyName: storyName || "" },
                },
                { upsert: true, new: true }
            );

            // 2. Tăng lượt xem hàng ngày (cho ranking theo period)
            const today = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
            await DailyViewCount.findOneAndUpdate(
                { slug, date: today },
                {
                    $inc: { viewCount: 1 },
                    $set: { storyName: storyName || "" },
                },
                { upsert: true }
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

    // Lấy tổng lượt xem hôm nay (từ DailyViewCount)
    getTodayViews: async (req, res) => {
        try {
            const today = new Date().toISOString().slice(0, 10);
            const result = await DailyViewCount.aggregate([
                { $match: { date: today } },
                { $group: { _id: null, totalViews: { $sum: "$viewCount" } } },
            ]);
            const totalViews = result[0]?.totalViews || 0;
            res.status(200).json({ todayViews: totalViews });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Lỗi khi lấy lượt xem hôm nay" });
        }
    },

    // Lấy lượt xem theo khoảng ngày (cho biểu đồ admin)
    getViewsByDateRange: async (req, res) => {
        try {
            const { days = 7 } = req.query;
            const numDays = parseInt(days);
            const dates = [];
            for (let i = numDays - 1; i >= 0; i--) {
                const d = new Date();
                d.setDate(d.getDate() - i);
                dates.push(d.toISOString().slice(0, 10));
            }

            const result = await DailyViewCount.aggregate([
                { $match: { date: { $in: dates } } },
                {
                    $group: {
                        _id: '$date',
                        totalViews: { $sum: '$viewCount' },
                    },
                },
                { $sort: { _id: 1 } },
            ]);

            // Build map for quick lookup
            const viewMap = {};
            result.forEach((r) => { viewMap[r._id] = r.totalViews; });

            // Return ordered array with 0 for missing dates
            const data = dates.map((date) => ({
                date,
                views: viewMap[date] || 0,
            }));

            res.status(200).json(data);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Lỗi khi lấy lượt xem theo ngày" });
        }
    },
};

module.exports = storyViewController;