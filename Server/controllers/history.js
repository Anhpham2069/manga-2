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
