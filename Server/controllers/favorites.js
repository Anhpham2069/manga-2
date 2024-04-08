const Favorite = require("../models/favorites");
require("dotenv").config();

const favoritesController = {
  addFavorite: async (req, res) => {
    try {
      const { userId, storyInfo } = req.body;

      const {slug} = req.params

      // Tạo một bản ghi mới
      const newFavorite = new Favorite({slug,  userId, storyInfo });

      // Lưu bản ghi mới vào cơ sở dữ liệu
      await newFavorite.save();

      res.status(201).json({ newFavorite });
    } catch (error) {
      console.error("Error adding favorite:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  deleteFavorites: async (req, res) => {
    try {
      const { slug, userId } = req.body;
      await Favorite.findOneAndDelete({ slug, userId }); // Xóa truyện dựa trên slug và ID của người dùng
      res.status(200).json({ message: "Favorite removed successfully" });
    } catch (error) {
      console.error("Error removing favorite:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  getAllFavorites: async (req, res) => {
    try {
      const favorites = await Favorite.find({ userId: req.user.id }); // Lấy danh sách yêu thích dựa trên ID của người dùng
      res.status(200).json(favorites);
    } catch (error) {
      console.error("Error getting favorites:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  getUserFavorites: async (req, res) => {
    try {
      const { userId } = req.params; // Lấy userId từ params của request
      const userFavorites = await Favorite.find({ userId }); // Tìm các truyện yêu thích của user có userId tương ứng
      res.status(200).json(userFavorites);
    } catch (error) {
      console.error("Error getting user favorites:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
};

module.exports = favoritesController;
