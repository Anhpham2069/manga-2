const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = async () => {
    try {
      await mongoose.connect(process.env.DATABASE);
      console.log('Kết nối thành công đến MongoDB');
    } catch (error) {
      console.error('Failed to connect to MongoDB:', error);
      process.exit(1);
    }
  };

module.exports = connectDB;
