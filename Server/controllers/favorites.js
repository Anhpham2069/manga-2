const Favorite = require("../models/favorites");
require("dotenv").config();

const favoritesController = {
  addFavorite: async (req, res) => {
    try {
      const { userId, storyInfo } = req.body;
      // Tạo một đối tượng Date hiện tại
      const currentTime = new Date().toLocaleString("en-US", {
        timeZone: "Asia/Ho_Chi_Minh",
      });

      // Kiểm tra xem có bản ghi nào có userId tương tự không
      const existingFavorite = await Favorite.findOne({ userId });

      if (existingFavorite) {
        // Nếu có, thêm storyInfo vào mảng storyInfo của bản ghi đó và cập nhật thời gian
        existingFavorite.storyInfo.push({
          ...storyInfo,
          createdAt: currentTime,
        });
        await existingFavorite.save();
        return res
          .status(200)
          .json({ message: "Thêm vào mảng cũ thành công!" });
      } else {
        // Nếu không, tạo một bản ghi mới và cập nhật thời gian
        const newFavorite = new Favorite({
          userId,
          storyInfo: [{ ...storyInfo, createdAt: currentTime }],
        });
        await newFavorite.save();
        return res.status(201).json({ message: "Tạo bản ghi mới thành công!" });
      }
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Đã xảy ra lỗi khi thêm yêu thích!" });
    }
  },

  deleteFavorites: async (req, res) => {
    try {
      const { userId, slug } = req.body;

      // Tìm kiếm bản ghi yêu thích của người dùng dựa trên userId
      const favorite = await Favorite.findOne({ userId });

      if (favorite) {
        // Nếu tìm thấy bản ghi yêu thích, tìm kiếm và xóa storyInfo có slug tương ứng
        const index = favorite.storyInfo.findIndex(
          (story) => story.slug === slug
        );
        if (index !== -1) {
          favorite.storyInfo.splice(index, 1);
          await favorite.save();
          return res.status(200).json({ message: "Xóa yêu thích thành công!" });
        } else {
          return res
            .status(404)
            .json({ message: "Không tìm thấy mục yêu thích để xóa!" });
        }
      } else {
        // Nếu không tìm thấy bản ghi yêu thích, trả về thông báo lỗi
        return res
          .status(404)
          .json({ message: "Không tìm thấy yêu thích cho người dùng này!" });
      }
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Đã xảy ra lỗi khi xóa yêu thích!" });
    }
  },
  getAllFavorites: async (req, res) => {
    try {
      // Sử dụng aggregation để nhóm theo slug và tính tổng số lượt lưu cho mỗi slug
      const favoriteCounts = await Favorite.aggregate([
        {
          $unwind: "$storyInfo"
        },
        {
          $group: {
            _id: "$storyInfo.slug",
            totalFavorites: { $sum: 1 }
          }
        }
      ]);

      // Tạo một object map để dễ dàng truy cập số lượt lưu của mỗi slug
      const favoriteCountsMap = favoriteCounts.reduce((acc, curr) => {
        acc[curr._id] = curr.totalFavorites;
        return acc;
      }, {});

      res.status(200).json(favoriteCountsMap);
    } catch (error) {
      console.error("Error getting favorites:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  getUserFavorites: async (req, res) => {
    try {
      const { userId } = req.params;

      // Tìm kiếm các yêu thích của người dùng dựa trên userId
      const favorites = await Favorite.findOne({ userId });

      if (favorites) {
        // Nếu tìm thấy yêu thích, trả về danh sách storyInfo
        return res.status(200).json(favorites.storyInfo);
      } else {
        return res
          .status(404)
          .json({ message: "Không tìm thấy yêu thích cho người dùng này!" });
      }
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Đã xảy ra lỗi khi lấy yêu thích!" });
    }
  },
};

module.exports = favoritesController;
