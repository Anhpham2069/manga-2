const mongoose = require("mongoose");
const StoryError = require("../models/StoryError");

const storyErrorController = {
  // Thêm lỗi truyện mới vào cơ sở dữ liệu
  addStoryError: async (req, res) => {
    try {
      const { userName, userID, nameErr, storyInfo } = req.body;

      // Tạo một đối tượng lỗi truyện mới
      const newStoryError = new StoryError({
        userName,
        userID,
        nameErr,
        storyInfo,
      });

      // Lưu lỗi truyện mới vào cơ sở dữ liệu
      const savedStoryError = await newStoryError.save();
      res.status(201).json(savedStoryError);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Xóa lỗi truyện dựa trên ID
  deleteStoryError: async (req, res) => {
    try {
      const storyErrorId = req.params.id;

      // Tìm và xóa lỗi truyện trong cơ sở dữ liệu
      const deletedStoryError = await StoryError.findByIdAndDelete(storyErrorId);
      if (!deletedStoryError) {
        return res.status(404).json({ message: "Story error not found" });
      }

      res.json({ message: "Story error deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Lấy danh sách tất cả các lỗi truyện
  getAllStoryError: async (req, res) => {
    try {
      const allStoryErrors = await StoryError.find();
      res.json(allStoryErrors);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Lấy danh sách lỗi truyện theo userID
  getUserStoryError: async (req, res) => {
    try {
      const userID = req.params.userID;

      // Lấy tất cả lỗi truyện theo userID từ cơ sở dữ liệu
      const userStoryErrors = await StoryError.find({ userID });
      res.json(userStoryErrors);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = storyErrorController;
