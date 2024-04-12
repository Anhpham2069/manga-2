const mongoose = require("mongoose");
const dotenv = require("dotenv");
const ReadHistory = require("../models/history"); // Đường dẫn đúng đến mô hình ReadHistory

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE);
    console.log('Kết nối thành công đến MongoDB');
    // Gọi hàm để xóa các bản ghi cũ ngay sau khi kết nối thành công
    await deleteOldRecords();
    // Thiết lập interval để xóa các bản ghi cũ mỗi 24 giờ
    setInterval(deleteOldRecords, 24 * 60 * 60 * 1000); // Mỗi 24 giờ
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  }
};

// Hàm để xóa các bản ghi cũ hơn 7 ngày
async function deleteOldRecords() {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 30);
  try {
    await ReadHistory.deleteMany({ timestamp: { $lt: sevenDaysAgo } });
    console.log("Deleted old records history successfully.");
  } catch (error) {
    console.error("Error deleting old records:", error);
  }
}

module.exports = connectDB;
