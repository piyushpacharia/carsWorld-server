const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    unique: true,
  },
  emailVerified: {
    type: Boolean,
    default: false,
    required: true,
  },
  password: String,
  balance: {
    type: Number,
    default: 0,
    required: true,
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user'
  },
});

module.exports = mongoose.model("coinUsers", userSchema);
