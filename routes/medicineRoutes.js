const express = require("express");
const Medicine = require("../models/Medicine");
const Dose = require("../models/Dose");
const { v4: uuidv4 } = require("uuid");

const router = express.Router();

/**
 * @swagger
 * /api/medicines:
 *   post:
 *     summary: Add a new medicine and generate doses
 *     tags: [Medicine]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               brandName:
 *                 type: string
 *               genericName:
 *                 type: string
 *               dosageForm:
 *                 type: string
 *               dosagesPerDay:
 *                 type: number
 *               dosageTimes:
 *                 type: array
 *                 items:
 *                   type: string
 *               dates:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Medicine and doses added successfully
 *       500:
 *         description: Server error
 */
router.post("/", async (req, res) => {
  try {
    const { userId, brandName, genericName, dosageForm, dosagesPerDay, dosageTimes, dates } = req.body;
    const medicineId = uuidv4();

    const medicine = new Medicine({
      userId,
      medicineId,
      brandName,
      genericName,
      dosageForm,
      dosagesPerDay,
      dosageTimes,
      dates,
    });

    await medicine.save();

    // Generate doses for each date in the dates array
    const doses = [];
    dates.forEach((date) => {
      dosageTimes.forEach((time) => {
        const [hours, minutes] = time.split(":");
        const doseTime = new Date(date);
        doseTime.setHours(hours, minutes, 0, 0);

        doses.push({
          doseId: uuidv4(),
          medicineId,
          userId,
          doseTime: doseTime,
          status: "Pending",
        });
      });
    });

    console.log(doses);

    await Dose.insertMany(doses);

    res.status(201).json({ message: "Medicine and doses added successfully", medicine, doses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * @swagger
 * /api/medicines/{userId}:
 *   get:
 *     summary: Get all medicines for a user
 *     tags: [Medicine]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of medicines
 *       500:
 *         description: Server error
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
 * /api/medicines/{medicineId}/doses:
 *   get:
 *     summary: Get all doses for a medicine
 *     tags: [Dose]
 *     parameters:
 *       - in: path
 *         name: medicineId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of doses
 *       500:
 *         description: Server error
 */
router.get("/:medicineId/doses", async (req, res) => {
  try {
    const doses = await Dose.find({ medicineId: req.params.medicineId });
    res.json(doses);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// router.get("/:medicineId/doses", async (req, res) => {
//   try {
//     const doses = await Dose.find({ medicineId: req.params.medicineId });
//     // Group doses by date
//     const groupedDoses = doses.reduce((acc, dose) => {
//       const dateObj = new Date(dose.time);
//       const formattedDate = dateObj.toLocaleDateString("en-GB"); // Converts to dd-mm-yyyy
//       console.log(formattedDate,dateObj);
//       if (!acc[formattedDate]) {
//         acc[formattedDate] = [];
//       }
//       acc[formattedDate].push({
//         id: dose.doseId,
//         time: dateObj.toTimeString().split(" ")[0], // Extract HH:MM:SS
//         status: dose.status,
//       });
//       return acc;
//     }, {});

//     console.log(groupedDoses);

//     // Convert grouped doses to the desired format
//     const response = Object.keys(groupedDoses).map(date => ({
//       date,
//       doses: groupedDoses[date],
//     }));


//     res.json(response);
//   } catch (error) {
//     res.status(500).json({ error: "Server error" });
//   }
// });


/**
 * @swagger
 * /api/medicines/{medicineId}/TodayDoses:
 *   get:
 *     summary: Get all doses for a medicine
 *     tags: [Dose]
 *     parameters:
 *       - in: path
 *         name: medicineId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: List of doses
 *       500:
 *         description: Server error
 */
router.get("/:medicineId/TodayDoses", async (req, res) => {
  try {
    const { userId, date } = req.query;
    const startDate = new Date(date);
    const endDate = new Date(date);
    endDate.setDate(endDate.getDate() + 1);

    const doses = await Dose.find({
      medicineId: req.params.medicineId,
      userId: userId,
      doseTime: { $gte: startDate, $lt: endDate },
    });

    res.json(doses);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * @swagger
 * /api/medicines/doses/{doseId}:
 *   put:
 *     summary: Update dose status
 *     tags: [Dose]
 *     parameters:
 *       - in: path
 *         name: doseId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Dose status updated
 *       404:
 *         description: Dose not found
 *       500:
 *         description: Server error
 */
router.put("/doses/:doseId", async (req, res) => {
  try {
    const { status } = req.body; // "missed" or "consumed"
    const updatedDose = await Dose.findOneAndUpdate(
      { doseId: req.params.doseId },
      { status },
      { new: true }
    );

    if (!updatedDose) return res.status(404).json({ error: "Dose not found" });

    res.json({ message: "Dose status updated", updatedDose });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * @swagger
 * /api/medicines/{medicineId}:
 *   delete:
 *     summary: Delete a medicine and its doses
 *     tags: [Medicine]
 *     parameters:
 *       - in: path
 *         name: medicineId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Medicine and doses deleted successfully
 *       500:
 *         description: Server error
 */
router.delete("/:medicineId", async (req, res) => {
  try {
    await Medicine.findOneAndDelete({ medicineId: req.params.medicineId });
    await Dose.deleteMany({ medicineId: req.params.medicineId });

    res.json({ message: "Medicine and doses deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// export default router;

module.exports = router;