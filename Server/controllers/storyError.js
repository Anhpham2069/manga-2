const StoryError = require("../models/StoryError");

const storyErrorController = {
  // Thêm lỗi truyện mới
  addStoryError: async (req, res) => {
    try {
      const { userName, userID, nameErr, storyInfo, chapterInfo } = req.body;

      const newStoryError = new StoryError({
        userName,
        userID,
        nameErr,
        storyInfo,
        chapterInfo: chapterInfo || "",
      });

      const savedStoryError = await newStoryError.save();
      res.status(201).json(savedStoryError);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Xóa lỗi truyện theo ID
  deleteStoryError: async (req, res) => {
    try {
      const { id } = req.params;

      const deletedStoryError = await StoryError.findByIdAndDelete(id);
      if (!deletedStoryError) {
        return res.status(404).json({ message: "Không tìm thấy báo lỗi" });
      }

      res.json({ message: "Đã xóa báo lỗi thành công" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Cập nhật trạng thái lỗi (pending -> done)
  updateStoryErrorStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const updatedError = await StoryError.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      );

      if (!updatedError) {
        return res.status(404).json({ message: "Không tìm thấy báo lỗi" });
      }

      res.json(updatedError);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Lấy tất cả lỗi truyện
  getAllStoryError: async (req, res) => {
    try {
      const allStoryErrors = await StoryError.find().sort({ timestamp: -1 });
      res.json(allStoryErrors);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Lấy lỗi truyện theo userID
  getUserStoryError: async (req, res) => {
    try {
      const { userId } = req.params;
      const userStoryErrors = await StoryError.find({ userID: userId }).sort({ timestamp: -1 });
      res.json(userStoryErrors);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = storyErrorController;
