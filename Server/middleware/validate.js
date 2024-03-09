    // middleware/validate.js

const validator = require('validator');

module.exports = {
  register: (req, res, next) => {
    const { username, email, password } = req.body;
    if (!validator.isEmail(email) || !validator.isLength(password, { min: 6 })) {
      return res.status(400).json({ message: 'Email hoặc mật khẩu không hợp lệ' });
    }
    // Thêm các kiểm tra khác nếu cần thiết
    next();
  },

  login: (req, res, next) => {
    const { email, password } = req.body;
    if (!validator.isEmail(email) || !validator.isLength(password, { min: 6 })) {
      return res.status(400).json({ message: 'Email hoặc mật khẩu không hợp lệ' });
    }
    // Thêm các kiểm tra khác nếu cần thiết
    next();
  },

  editProfile: (req, res, next) => {
    // Thêm validation cho các trường cần thiết
    next();
  },

  changePassword: (req, res, next) => {
    const { currentPassword, newPassword } = req.body;
    if (!validator.isLength(newPassword, { min: 6 })) {
      return res.status(400).json({ message: 'Mật khẩu mới phải có ít nhất 6 ký tự' });
    }
    // Thêm các kiểm tra khác nếu cần thiết
    next();
  },
};
