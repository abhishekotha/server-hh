const express = require("express");
const Medicine = require("../models/Medicine");
const Dose = require("../models/Dose");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");

/**
 * @swagger
 * /api/medicines:
 *   post:
 *     summary: Add a new medicine
 *     tags: [Medicine]
 */
router.post("/", async (req, res) => {
  try {
    const { userId, brandName, genericName, dosageForm, dosagesPerDay, dosageTimes } = req.body;

    const medicineId = uuidv4(); // Generate unique ID for medicine
    const medicine = new Medicine({
      userId,
      medicineId,
      brandName,
      genericName,
      dosageForm,
      dosagesPerDay,
      dosageTimes,
    });

    await medicine.save();
    res.status(201).json({ message: "Medicine added successfully", medicine });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * @swagger
 * /api/medicines:
 *   get:
 *     summary: Get all medicines for a user
 *     tags: [Medicine]
 */
router.get("/:userId", async (req, res) => {
  try {
    const medicines = await Medicine.find({ userId: req.params.userId });
    res.json(medicines);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * @swagger
 * /api/medicines/{id}:
 *   put:
 *     summary: Update medicine details
 *     tags: [Medicine]
 */
router.put("/:id", async (req, res) => {
  try {
    const updatedMedicine = await Medicine.findOneAndUpdate({ medicineId: req.params.id }, req.body, { new: true });
    res.json(updatedMedicine);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * @swagger
 * /api/medicines/{id}:
 *   delete:
 *     summary: Delete a medicine
 *     tags: [Medicine]
 */
router.delete("/:id", async (req, res) => {
  try {
    await Medicine.findOneAndDelete({ medicineId: req.params.id });
    res.json({ message: "Medicine deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
