const userModel = require("../models/users");
const bcrypt = require("bcryptjs");
const validator = require("validator"); // Thêm thư viện validator

// Sử dụng biến môi trường cho các giá trị nhạy cảm
const secretKey = process.env.SECRET_KEY || 'your-secret-key';
const saltRounds = process.env.SALT_ROUNDS || 10;

// ... (các import khác)

exports.register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Kiểm tra validation của email và mật khẩu
    if (!validator.isEmail(email) || !validator.isLength(password, { min: 6 })) {
      return res.status(400).json({ message: 'Email hoặc mật khẩu không hợp lệ' });
    }

    // Kiểm tra xem tài khoản đã tồn tại chưa
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email đã tồn tại' });
    }

    // Hash mật khẩu trước khi lưu vào cơ sở dữ liệu
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Tạo người dùng mới với vai trò được chỉ định
    const newUser = new userModel({
      username,
      email,
      password: hashedPassword,
      role: role || 'customer',
    });

    // Lưu người dùng vào cơ sở dữ liệu
    await newUser.save();

    res.status(201).json({ message: 'Đăng ký thành công' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Kiểm tra validation của email và mật khẩu
    if (!validator.isEmail(email) || !validator.isLength(password, { min: 6 })) {
      return res.status(400).json({ message: 'Email hoặc mật khẩu không hợp lệ' });
    }

    // Kiểm tra xem tài khoản có tồn tại không
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Email hoặc mật khẩu không chính xác' });
    }

    // So sánh mật khẩu đã hash
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'mật khẩu không chính xác' });
    }

    // Tạo và gửi token
    const token = jwt.sign({ userId: user._id, email: user.email }, secretKey, { expiresIn: '1h' });
    res.status(200).json({ token, expiresIn: 3600 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Chỉnh sửa thông tin tài khoản
exports.editProfile = async (req, res) => {
  try {
    const userId = req.userId;

    // Lấy thông tin mới từ req.body và cập nhật vào cơ sở dữ liệu
    const updatedUser = await userModel.findByIdAndUpdate(userId, { $set: req.body }, { new: true });

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Đổi mật khẩu
exports.changePassword = async (req, res) => {
  try {
    const userId = req.userId;
    const { currentPassword, newPassword } = req.body;

    // Kiểm tra validation của mật khẩu mới
    if (!validator.isLength(newPassword, { min: 6 })) {
      return res.status(400).json({ message: 'Mật khẩu mới phải có ít nhất 6 ký tự' });
    }

    // Lấy thông tin người dùng
    const user = await userModel.findById(userId);

    // So sánh mật khẩu hiện tại
    const passwordMatch = await bcrypt.compare(currentPassword, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Mật khẩu hiện tại không chính xác' });
    }

    // Hash mật khẩu mới
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    // Cập nhật mật khẩu mới vào cơ sở dữ liệu
    await userModel.findByIdAndUpdate(userId, { $set: { password: hashedNewPassword } });

    res.status(200).json({ message: 'Đổi mật khẩu thành công' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};
