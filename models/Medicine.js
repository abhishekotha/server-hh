const mongoose = require("mongoose");

const MedicineSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // Links medicine to a user
  medicineId: { type: String, required: true, unique: true },
  brandName: { type: String, required: true },
  genericName: { type: String, required: true },
  dosageForm: { type: String, required: true },
  dosagesPerDay: { type: Number, required: true },
  dosageTimes: [{ type: String, required: true }], // e.g., ["08:00 AM", "02:00 PM", "08:00 PM"]
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Medicine", MedicineSchema);
