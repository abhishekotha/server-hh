const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs"); // For password hashing
const { GoogleGenerativeAI } = require("@google/generative-ai");

dotenv.config();

const connectDB = require("./config/db");
const db = connectDB();

const swaggerDocs = require("./swagger/swaggerConfig");
const medicineRoutes = require("./routes/medicineRoutes");
const ocrRoutes = require("./routes/ocrRoutes");

console.log(process.env.MONGO_URI);

const app = express();
app.use(cors());
app.use(bodyParser.json());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genAi = new GoogleGenerativeAI(GEMINI_API_KEY);

// ✅ Register Route with MySQL
app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const checkQuery = "SELECT * FROM userdata WHERE email = ?";
    db.query(checkQuery, [email], async (err, results) => {
      if (err) {
        console.error("Database Error:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      if (results.length > 0) {
        return res.status(400).json({ message: "⚠️ Email already exists!" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const insertQuery = "INSERT INTO userdata (username, email, password) VALUES (?, ?, ?)";
      
      db.query(insertQuery, [name, email, hashedPassword], (err, result) => {
        if (err) {
          console.error("Insert Error:", err);
          return res.status(500).json({ error: "Error creating user" });
        }

        // Generate the auth token
        const token = jwt.sign({ email, username: name }, 'your_secret_key', { expiresIn: '1h' }); // Use a secret key to sign the token

        // Send the response with the token
        res.status(201).json({ 
          message: "✅ User registered successfully!", 
          authtoken: token 
        });
      });
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// ✅ Login Route with MySQL
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const checkQuery = "SELECT * FROM userdata WHERE email = ?";
    db.query(checkQuery, [email], async (err, results) => {
      if (err) {
        console.error("Database Error:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      if (results.length === 0) {
        return res.status(400).json({ message: "⚠️ Email not found!" });
      }

      const user = results[0];
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).json({ message: "❌ Invalid credentials!" });
      }

      res.status(200).json({ message: "✅ Login successful!", user: { id: user.id, name: user.name, email: user.email } });
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/generate", async (req, res) => {
  const prompt = req.body.prompt;
  try {
    const model = genAi.getGenerativeModel({ model: "gemini-1.5-pro" });
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    res.json({ message: text });
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
    res.status(500).json({ error: error.response?.data || error.message });
  }
});

app.get("/", async (req, res) => {
  res.send("hai abhi");
});

app.use("/api/medicines", medicineRoutes);
app.use("/api/ocr", ocrRoutes);

swaggerDocs(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
