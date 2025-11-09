const userModel = require("../models/user.models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_EXPIRY = "7d";

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

// Register user
async function registerUser(req, res) {
  try {
    const { username, email, password } = req.body;

    const existingUser = await userModel.findOne({ $or: [{ email }, { username }] });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userModel.create({ username, email, password: hashedPassword });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: JWT_EXPIRY });

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Login user
async function loginUser(req, res) {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(400).json({ message: "Incorrect password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: JWT_EXPIRY });

    res.status(200).json({
      message: "Logged in successfully",
      token,
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Verify user via Authorization header
async function checkUser(req, res) {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Token missing or malformed" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded.id);
    if (!user) return res.status(401).json({ message: "User not found" });

    const { _id, username, email } = user;
    return res.status(200).json({ user: { id: _id, username, email } });
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

// Logout (frontend should remove token)
async function logoutUser(req, res) {
  res.status(200).json({ message: "Logout successful (remove token on client)" });
}

module.exports = { registerUser, loginUser, checkUser, logoutUser };
