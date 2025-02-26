const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const swaggerDocs = require("./swagger/swaggerConfig");

const medicineRoutes = require("./routes/medicineRoutes");
const doseRoutes = require("./routes/doseRoutes");
const ocrRoutes = require("./routes/ocrRoutes");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use("/api/auth", authRoutes);
app.use("/api/medicines", medicineRoutes);
app.use("/api/doses", doseRoutes);
app.use("/api/ocr", ocrRoutes);
  
swaggerDocs(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
