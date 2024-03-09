const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true,minLength: 6,maxLength: 20,unique: true },
  email: { type: String, required: true, unique: true, validate: { validator: value => /\S+@\S+\.\S+/.test(value), message: 'Email không hợp lệ' } },
  password: { type: String, required: true,minLength: 6 },
  // googleId: { type: String },
  // facebookId: { type: String },
  // displayName: { type: String },
  // role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
  admin:{type: Boolean,default: false},

},{timestamps: true});



// Thêm trường thời gian cập nhật khi thay đổi thông tin
// userSchema.pre('findOneAndUpdate', function (next) {
//   this.set({ updatedAt: new Date() });
//   return next();
// });

const User = mongoose.model('User', userSchema);

module.exports = User;
