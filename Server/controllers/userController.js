const User = require("../models/users");

const userController = {
  //GET ALL USER
  getAllUsers: async (req, res) => {
    try {
      const user = await User.find().select("-password");
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  //UPDATE A USER
  updateUser: async (req, res) => {
    try {
      const { username, email } = req.body;
      const updateData = {};
      if (username) updateData.username = username;
      if (email) updateData.email = email;

      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        { $set: updateData },
        { new: true }
      ).select("-password");

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json(updatedUser);
    } catch (err) {
      if (err.code === 11000) {
        return res.status(409).json({ message: "Username hoặc email đã tồn tại" });
      }
      res.status(500).json(err);
    }
  },

  //TOGGLE ADMIN STATUS
  toggleAdmin: async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      user.admin = !user.admin;
      await user.save();

      const result = await User.findById(req.params.id).select("-password");
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  //DELETE A USER
  deleteUser: async (req, res) => {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json("User deleted");
    } catch (err) {
      res.status(500).json(err);
    }
  },
};

module.exports = userController;