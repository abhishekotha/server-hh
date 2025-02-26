const express = require("express");
// const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();

/**
 * Generates a unique 5-digit user ID
 */
const generateUserId = async () => {
    let userId;
    let userExists;
    do {
      userId = Math.floor(10000 + Math.random() * 90000).toString(); // Generates a 5-digit ID
      userExists = await User.findOne({ userId }); // Check if it exists
    } while (userExists);
    return userId;
  };


/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: User already exists
 */
router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    // const hashedPassword = await bcrypt.hash(password, 10);
    const userId = await generateUserId();

    user = new User({userId, name, email, password: password });

    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @swagger
 * /api/auth/signin:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Invalid credentials
 */
router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });
    
    // const isMatch = await bcrypt.compare(password, user.password);
    if (password!=user.password) return res.status(400).json({ message: "Invalid credentials" });
    console.log(user,password,"hii");
    
    const token = jwt.sign({ id: user.userId }, process.env.JWT_SECRET, { expiresIn: "5h" });
    // console.log(token);
    res.json({ token ,userId:user.userId});
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
