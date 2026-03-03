const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      maxLength: 20,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (value) => /\S+@\S+\.\S+/.test(value),
        message: "Email không hợp lệ",
      },
    },
    password: { type: String, minLength: 6 },
    googleId: { type: String },
    avatar: { type: String, default: "" },
    admin: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
