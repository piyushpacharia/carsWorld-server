const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();
function checkBodyParams(req, res, next) {
  const { name, email, password } = req.body;
  if (!email || !password || !name)
    return res.json({ success: false, message: "invalid data" });
  if (password.length < 6)
    return res.json({ success: false, message: "Weak password" });

  if (name.length <= 1)
    return res.json({ success: false, message: "name is too short" });

  if (email.length < 6)
    return res.json({ success: false, message: "Wrong Email" });

  next();
}

async function isLoggedIn(req, res, next) {
  const token = req.headers.authorization;

  try {
    if (!token) {
      throw new Error("No token provided");
    }

    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    const user = await User.findById(decoded._id);

    if (!user) {
      throw new Error("User not found");
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: error.message });
  }
}

module.exports = { checkBodyParams, isLoggedIn }; 
