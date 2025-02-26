const express = require("express");
const multer = require("multer");
const Tesseract = require("tesseract.js");
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });


/**
 * @swagger
 * /api/ocr:
 *   post:
 *     summary: Upload an image to extract medicine details
 *     tags: [OCR]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Successfully extracted text from image
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 extractedText:
 *                   type: string
 *       500:
 *         description: Server error
 */
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { buffer } = req.file;

    Tesseract.recognize(buffer, "eng")
      .then(({ data: { text } }) => {
        res.json({ extractedText: text });
      })
      .catch((error) => {
        res.status(500).json({ error: "OCR failed" });
      });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
