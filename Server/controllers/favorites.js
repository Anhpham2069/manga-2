const Favorite = require("../models/favorites");
require('dotenv').config()

const favoritesController = {
    addFavorite: async (req,res)=>{
        try {
            const { slug, storyInfo,userId } = req.body; // Lấy thông tin của truyện từ request body
            const newFavorite = new Favorite( slug, storyInfo, userId); // Tạo một đối tượng Favorite mới với thông tin của truyện và ID của người dùng
            await newFavorite.save(); // Lưu đối tượng vào cơ sở dữ liệu
            res.status(201).json({ message: 'Favorite added successfully' });
          } catch (error) {
            console.error('Error adding favorite:', error);
            res.status(500).json({ error: 'Internal server error' });
          }
    },
    deleteFavorites: async (req,res)=>{
        try {
            const { slug } = req.body;
            await Favorite.findOneAndDelete({ slug, userId: req.user.id }); // Xóa truyện dựa trên slug và ID của người dùng
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
    }
};

module.exports = favoritesController