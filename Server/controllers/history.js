const ReadHistory = require('../models/history');

// Lưu lịch sử đọc truyện mới
exports.saveReadHistory = async (req, res) => {
  try {
    const { slug, storyInfo, chapter } = req.body;

    // Kiểm tra xem có lịch sử đọc trước đó không
    const existingHistory = await ReadHistory.findOne({
      slug,
    });

    if (existingHistory) {
      // Nếu đã có lịch sử đọc trước đó, tăng readCount lên 1
      existingHistory.readCount += 1;
      // Cập nhật trường chapter
      existingHistory.chapter = chapter; // Sửa dòng này
      await existingHistory.save();
      res.status(200).json({ message: 'Lịch sử đọc truyện đã được cập nhật.' });
    } else {
      // Nếu chưa có lịch sử đọc, tạo lịch sử mới và đặt readCount là 1
      const newHistory = new ReadHistory({
          slug, storyInfo, chapter // Sửa dòng này
      });
      await newHistory.save();
      res.status(201).json({ message: 'Lịch sử đọc truyện đã được lưu.' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
  }
};

  // Lấy tất cả lịch sử đọc truyện từ tất cả người dùng
exports.getAllReadHistory = async (req, res) => {
  try {
    const allHistory = await ReadHistory.find().sort({ timestamp: -1 });
    res.status(200).json(allHistory);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
  }
};

  
// Lấy lịch sử đọc truyện của một người dùng cụ thể
// exports.getReadHistoryByUser = async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const readHistory = await ReadHistory.find({ user: userId })
//       .sort({ timestamp: -1 })
//       .limit(10); // Lấy ra 10 lần đọc gần nhất
//     res.status(200).json(readHistory);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
//   }
// };
