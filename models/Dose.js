const mongoose = require("mongoose");

const DoseSchema = new mongoose.Schema({
  medicineId: { type: String, required: true },
  userId: { type: String, required: true }, // Links dose to a user
  doseTime: { type: String, required: true }, // Time of dose
  status: { type: String, enum: ["Pending", "Taken", "Missed"], default: "Pending" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Dose", DoseSchema);
