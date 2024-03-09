// middleware/checkAuth.js

const jwt = require('jsonwebtoken');
const secretKey = 'your-secret-key'; // Hãy thay đổi secret key này trong môi trường thực tế

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, secretKey);
    req.userId = decodedToken.userId;
    if (decodedToken.role === 'admin') {
      req.isAdmin = true;
    }
    next();
  } catch (error) {
    res.status(401).json({ message: 'Xác thực không thành công' });
  }
};
