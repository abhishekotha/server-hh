// const mongoose = require("mongoose");

// const MedicineSchema = new mongoose.Schema({
//   userId: { type: String, required: true }, // Links medicine to a user
//   medicineId: { type: String, required: true, unique: true },
//   brandName: { type: String, required: true },
//   genericName: { type: String, required: true },
//   dosageForm: { type: String, required: true },
//   dosagesPerDay: { type: Number, required: true },
//   dosageTimes: [{ type: String, required: true }], // e.g., ["08:00 AM", "02:00 PM", "08:00 PM"]
//   createdAt: { type: Date, default: Date.now },
// });

// module.exports = mongoose.model("Medicine", MedicineSchema);

const mongoose = require("mongoose");

const MedicineSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // User who added the medicine
  medicineId: { type: String, unique: true, required: true }, // Unique medicine ID
  brandName: { type: String, required: true },
  genericName: { type: String, required: true },
  dosageForm: { type: String, required: true },
  dosagesPerDay: { type: Number, required: true }, // Number of doses per day
  dosageTimes: { type: [String], required: true }, // ["08:00", "14:00", "20:00"]
  dates: { type: [Date], required: true }, // Array of specific dates when the medicine should be taken
});

module.exports = mongoose.model("Medicine", MedicineSchema);

