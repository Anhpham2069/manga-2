const Announcement = require("../models/noti");

const announcementController = {
  // Tạo thông báo mới
  createAnnouncement: async (req, res) => {
    try {
      const { title, message } = req.body;
      if (!message) {
        return res.status(400).json({ error: "Nội dung thông báo là bắt buộc" });
      }
      const newAnnouncement = new Announcement({ title, message });
      const saved = await newAnnouncement.save();
      res.status(201).json(saved);
    } catch (error) {
      res.status(500).json({ error: "Lỗi server" });
    }
  },

  // Lấy tất cả thông báo (admin)
  getAllAnnouncements: async (req, res) => {
    try {
      const announcements = await Announcement.find().sort({ createdAt: -1 });
      res.json(announcements);
    } catch (error) {
      res.status(500).json({ error: "Lỗi server" });
    }
  },

  // Lấy thông báo active mới nhất (user)
  getActiveAnnouncement: async (req, res) => {
    try {
      const announcement = await Announcement.findOne({ isActive: true }).sort({
        createdAt: -1,
      });
      res.json(announcement);
    } catch (error) {
      res.status(500).json({ error: "Lỗi server" });
    }
  },

  // Cập nhật thông báo
  updateAnnouncement: async (req, res) => {
    try {
      const { id } = req.params;
      const { title, message } = req.body;
      const updated = await Announcement.findByIdAndUpdate(
        id,
        { title, message },
        { new: true }
      );
      if (!updated) {
        return res.status(404).json({ message: "Không tìm thấy thông báo" });
      }
      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: "Lỗi server" });
    }
  },

  // Xóa thông báo
  deleteAnnouncement: async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await Announcement.findByIdAndDelete(id);
      if (!deleted) {
        return res.status(404).json({ message: "Không tìm thấy thông báo" });
      }
      res.json({ message: "Đã xóa thông báo thành công" });
    } catch (error) {
      res.status(500).json({ error: "Lỗi server" });
    }
  },

  // Bật/tắt trạng thái active
  toggleAnnouncement: async (req, res) => {
    try {
      const { id } = req.params;
      const announcement = await Announcement.findById(id);
      if (!announcement) {
        return res.status(404).json({ message: "Không tìm thấy thông báo" });
      }
      announcement.isActive = !announcement.isActive;
      const updated = await announcement.save();
      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: "Lỗi server" });
    }
  },
};

module.exports = announcementController;
