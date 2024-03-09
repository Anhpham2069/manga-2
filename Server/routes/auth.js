const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const { verifyToken } = require('../middleware/middlewareController');

// Đăng ký tài khoản
router.post('/register', authController.register);
// Đăng nhập tài khoản
router.post('/login', authController.loginUser);
//REFRESH TOKEN
router.post("/refresh", authController.requestRefreshToken);
// logout
router.post("/logout", verifyToken, authController.logOut);

// Chỉnh sửa thông tin tài khoản (yêu cầu xác thực)
router.put('/edit-profile', authController.editUser);

// // Đổi mật khẩu (yêu cầu xác thực)
router.put('/change-password', authController.changePassword);

module.exports = router;