const Favorite = require("../models/favorites");
require('dotenv').config()

const favoritesController = {
  addFavorite: async (req, res) => {
    try {
        const { slug, userId,storyInfo } = req.body; // Lấy thông tin của truyện từ request body
        // Kiểm tra xem truyện đã tồn tại trong danh sách yêu thích của người dùng chưa
        const existingFavorite = await Favorite.findOne({ slug });
        if (existingFavorite) {
            return res.status(400).json({ error: 'Truyện đã tồn tại trong danh sách yêu thích của bạn' });
        }
        // Nếu truyện chưa tồn tại, thêm vào danh sách yêu thích
        const newFavorite = new Favorite({ slug, userId,storyInfo }); // Tạo một đối tượng Favorite mới với thông tin của truyện và ID của người dùng
        await newFavorite.save(); // Lưu đối tượng vào cơ sở dữ liệu
        res.status(201).json({newFavorite });
    } catch (error) {
        console.error('Error adding favorite:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
},

    deleteFavorites: async (req,res)=>{
        try {
            const { slug,userId } = req.body;
            await Favorite.findOneAndDelete({ slug, userId}); // Xóa truyện dựa trên slug và ID của người dùng
            res.status(200).json({ message: 'Favorite removed successfully' });
          } catch (error) {
            console.error('Error removing favorite:', error);
            res.status(500).json({ error: 'Internal server error' });
          }
    },
    getAllFavorites: async (req, res) => {
        try {
            const favorites = await Favorite.find({ userId: req.user.id }); // Lấy danh sách yêu thích dựa trên ID của người dùng
            res.status(200).json(favorites);
        } catch (error) {
            console.error('Error getting favorites:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
    getUserFavorites: async (req, res) => {
      try {
          const { userId } = req.params; // Lấy userId từ params của request
          const userFavorites = await Favorite.find({ userId }); // Tìm các truyện yêu thích của user có userId tương ứng
          res.status(200).json(userFavorites);
      } catch (error) {
          console.error('Error getting user favorites:', error);
          res.status(500).json({ error: 'Internal server error' });
      }
  }
};

module.exports = favoritesController