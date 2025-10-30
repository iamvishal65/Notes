const jwt = require("jsonwebtoken");
const userModel = require("../models/user.models");

module.exports = async function (req, res, next) {
  try {
    console.log("--- AUTH CHECK ---");
    console.log("req.headers.authorization =>", req.headers.authorization);
    const token = req.headers.authorization?.split(" ")[1]; // Bearer token
    if (!token) {
      console.log("No token extracted");
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("decoded =>", decoded);
    const user = await userModel.findById(decoded.id);
    console.log("user found =>", !!user, user?._id);
    if (!user) return res.status(401).json({ message: "Invalid token" });

    req.user = user; // ⚡ attach user
    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    return res.status(401).json({ message: "Unauthorized" });
  }
};
