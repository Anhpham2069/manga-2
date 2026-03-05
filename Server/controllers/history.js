const ReadHistory = require('../models/history');

// Lưu lịch sử đọc truyện
exports.saveReadHistory = async (req, res) => {
  try {
    const { userId, slug, storyInfo, chapter, chapterId } = req.body;

    // Tìm theo cả userId + slug để mỗi user có history riêng
    const existingHistory = await ReadHistory.findOne({ userId, slug });

    if (existingHistory) {
      existingHistory.readCount += 1;
      existingHistory.chapter = chapter;
      existingHistory.chapterId = chapterId;
      existingHistory.storyInfo = storyInfo;
      existingHistory.timestamp = Date.now();
      await existingHistory.save();
      res.status(200).json({ message: 'Lịch sử đọc truyện đã được cập nhật.' });
    } else {
      const newHistory = new ReadHistory({
        userId, slug, storyInfo, chapter, chapterId,
      });
      await newHistory.save();
      res.status(201).json({ message: 'Lịch sử đọc truyện đã được lưu.' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
  }
};

// Lấy tất cả lịch sử (admin)
exports.getAllReadHistory = async (req, res) => {
  try {
    const allHistory = await ReadHistory.find().sort({ timestamp: -1 });
    res.status(200).json(allHistory);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
  }
};

// Lấy chapter cuối cùng user đọc cho 1 truyện
exports.getLatestReadHistory = async (req, res) => {
  try {
    const { slug } = req.params;
    const { userId } = req.query;

    const query = { slug };
    if (userId) query.userId = userId;

    const latestHistory = await ReadHistory.findOne(query).sort({ timestamp: -1 });
    res.status(200).json(latestHistory);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
  }
};

// Lấy lịch sử đọc truyện của user
exports.getReadHistoryByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const readHistory = await ReadHistory.find({ userId })
      .sort({ timestamp: -1 })
      .limit(50);
    res.status(200).json(readHistory);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
  }
};

// Bảng xếp hạng truyện theo lượt xem thực tế (ngày / tuần / tháng)
exports.getRanking = async (req, res) => {
  try {
    const { period } = req.query; // 'day', 'week', 'month'
    const DailyViewCount = require('../models/DailyViewCount');

    const now = new Date();
    let startDate = new Date();

    switch (period) {
      case 'day':
        startDate.setDate(now.getDate() - 1);
        break;
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      default:
        startDate.setDate(now.getDate() - 7);
    }

    // Format ngày bắt đầu thành "YYYY-MM-DD" để so sánh string
    const startDateStr = startDate.toISOString().slice(0, 10);

    const ranking = await DailyViewCount.aggregate([
      { $match: { date: { $gte: startDateStr } } },
      {
        $group: {
          _id: '$slug',
          totalViews: { $sum: '$viewCount' },
          storyName: { $first: '$storyName' },
        },
      },
      { $sort: { totalViews: -1 } },
      { $limit: 20 },
    ]);

    // Lấy storyInfo từ ReadHistory cho từng truyện (để hiển thị tên + ảnh)
    const slugs = ranking.map((item) => item._id);
    const historyInfos = await ReadHistory.aggregate([
      { $match: { slug: { $in: slugs } } },
      { $sort: { timestamp: -1 } },
      {
        $group: {
          _id: '$slug',
          storyInfo: { $first: '$storyInfo' },
        },
      },
    ]);

    const infoMap = {};
    historyInfos.forEach((h) => { infoMap[h._id] = h.storyInfo; });

    // Lấy lượt xem all-time từ StoryView (để hiển thị đồng bộ với grid cards)
    const StoryView = require('../models/StoryView');
    const storyViews = await StoryView.find({ slug: { $in: slugs } });
    const viewsMap = {};
    storyViews.forEach((v) => { viewsMap[v.slug] = v.viewCount; });

    // Gộp storyInfo + allTimeViews vào kết quả ranking
    const result = ranking.map((item) => ({
      ...item,
      storyInfo: infoMap[item._id] || null,
      allTimeViews: viewsMap[item._id] || 0,
    }));

    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
  }
};
