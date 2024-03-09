const User = require("../models/users");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

let refreshTokens = [];

const authController = {
  register: async (req, res) => {
    try {
      const { username, email, password } = req.body;

      // Kiểm tra dữ liệu đầu vào
      if (!username || !email || !password) {
        return res.status(400).json({ message: "Vui lòng cung cấp đầy đủ thông tin" });
      }

      // Kiểm tra xem username đã tồn tại chưa
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(409).json({ message: "Tên đã tồn tại" });
      }

      // Hash mật khẩu
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Tạo người dùng mới
      const newUser = new User({
        username,
        email,
        password: hashedPassword,
      });

      // Lưu người dùng mới vào cơ sở dữ liệu
      const savedUser = await newUser.save();

      // Trả về phản hồi thành công
      res.status(200).json({savedUser, message: "Đăng ký thành công" });
    } catch (error) {
      // Xử lý lỗi đúng cách
      console.error("Error during registration:", error);
      res.status(500).json({ message: "Đã xảy ra lỗi trong quá trình đăng ký" });
    }
},

  //access token
   generateAccessToken: (user) =>{
    return jwt.sign(
      { 
        id: user.id, 
        admin: user.admin
      },
      process.env.JWT_ACCESS_KEY,
      { expiresIn: "60s" },

      );
  },
  generateRefeshToken: (user) =>{
    return jwt.sign(
      { 
        id: user.id, 
        admin: user.admin
      },
      process.env.JWT_REFESH_KEY,
      { expiresIn: "365d" },

      );
  },

// login

  loginUser: async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(401).json({ message: "Tên không chính xác" });
      }
      // So sánh mật khẩu đã hash
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ message: "mật khẩu không chính xác" });
      }
      if (user && passwordMatch) {
       const accesToken =  authController.generateAccessToken(user)
       const refeshToken =  authController.generateRefeshToken(user)
       refreshTokens.push(refeshToken)
       res.cookie("refeshToken",refeshToken,{
        httpOnly: true,
        secure: false,
        path: "/",
        sameSite: "strict"
       })
          const {password,...others} = user._doc
          res.status(200).json({ ...others, accesToken });
          // res.status(200).json(user);
        }
    } catch (error) {
      res.status(500).json(error);
    }
  },
  requestRefreshToken: async (req, res) => {
    //Take refresh token from user
    const refreshToken = req.cookies.refreshToken;
    //Send error if token is not valid
    if (!refreshToken) return res.status(401).json("You're not authenticated");
    if (!refreshTokens.includes(refreshToken)) {
      return res.status(403).json("Refresh token is not valid");
    }
    jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, user) => {
      if (err) {
        console.log(err);
      }
      refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
      //create new access token, refresh token and send to user
      const newAccessToken = authController.generateAccessToken(user);
      const newRefreshToken = authController.generateRefreshToken(user);
      refreshTokens.push(newRefreshToken);
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure:false,
        path: "/",
        sameSite: "strict",
      });
      res.status(200).json({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      });
    });
  },
  logOut: async (req, res) => {
    //Clear cookies when user logs out
    refreshTokens = refreshTokens.filter((token) => token !== req.body.token);
    res.clearCookie("refreshToken");
    res.status(200).json("Logged out successfully!");
  },


  editUser: async (req, res) => {
    try {
      const { userId } = req.body;

      const userUpdate = await User.findByIdAndUpdate(
        userId,
        { $set: req.body },
        { new: true }
      );
      res.status(200).json(userUpdate);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  changePassword: async (req, res) => {
    try {
      const userId = req.userId;
      const { currentPassword, newPassword } = req.body;

      // Kiểm tra validation của mật khẩu mới
      if (!validator.isLength(newPassword, { min: 6 })) {
        return res
          .status(400)
          .json({ message: "Mật khẩu mới phải có ít nhất 6 ký tự" });
      }

      // Lấy thông tin người dùng
      const user = await User.findById(userId);

      // So sánh mật khẩu hiện tại
      const passwordMatch = await bcrypt.compare(
        currentPassword,
        user.password
      );
      if (!passwordMatch) {
        return res
          .status(401)
          .json({ message: "Mật khẩu hiện tại không chính xác" });
      }

      // Hash mật khẩu mới
      const salt = await bcrypt.genSalt(10);
      const hashedNewPassword = await bcrypt.hash(newPassword, salt);

      // Cập nhật mật khẩu mới vào cơ sở dữ liệu
      await User.findByIdAndUpdate(userId, {
        $set: { password: hashedNewPassword },
      });

      res.status(200).json({ message: "Đổi mật khẩu thành công" });
    } catch (error) {
      res.status(500).json(error);
    }
  },
};

module.exports = authController;
