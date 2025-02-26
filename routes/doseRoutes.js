const express = require("express");
const Dose = require("../models/Dose");
const router = express.Router();

/**
 * @swagger
 * /api/doses:
 *   post:
 *     summary: Add a new dose entry
 *     tags: [Dose]
 */
router.post("/", async (req, res) => {
  try {
    const { medicineId, userId, doseTime } = req.body;

    const dose = new Dose({ medicineId, userId, doseTime });
    await dose.save();
    res.status(201).json({ message: "Dose added successfully", dose });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * @swagger
 * /api/doses/{id}:
 *   put:
 *     summary: Update dose status (Taken, Missed, Pending)
 *     tags: [Dose]
 */
router.put("/:id", async (req, res) => {
  try {
    const updatedDose = await Dose.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedDose);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * @swagger
 * /api/doses/{id}:
 *   delete:
 *     summary: Delete a dose entry
 *     tags: [Dose]
 */
router.delete("/:id", async (req, res) => {
  try {
    await Dose.findByIdAndDelete(req.params.id);
    res.json({ message: "Dose deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
