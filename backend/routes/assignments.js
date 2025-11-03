// routes/assignments.js

const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const Assignment = require("../models/Assignment");
const generateFileHash = require("../utils/pdfHash");
const { extractTextFromPDF } = require("../utils/ocrExtractor"); // Your existing extractor
const compareTextLines = require("../utils/textComparer"); // <-- IMPORT the new comparer
const fs = require("fs");
const path = require("path");
const auth = require("../middleware/auth");

// The `extractTextFromPDF` function you provided can remain unchanged.

// Compare Two Assignments (Enhanced)
router.post(
  "/compare",
  auth,
  upload.fields([
    { name: "firstFile", maxCount: 1 },
    { name: "secondFile", maxCount: 1 },
  ]),
  async (req, res) => {
    let firstFilePath, secondFilePath;

    try {
      if (!req.files?.firstFile || !req.files?.secondFile) {
        return res.status(400).json({ error: "Both files are required" });
      }

      firstFilePath = req.files.firstFile[0].path;
      secondFilePath = req.files.secondFile[0].path;

      console.log("\n=== STARTING ENHANCED COMPARISON ===");

      // Extract text from both files
      const [firstTextContent, secondTextContent] = await Promise.all([
        extractTextFromPDF(firstFilePath),
        extractTextFromPDF(secondFilePath),
      ]);

      // Enhanced text cleaning
      const cleanFirstText = (firstTextContent || "")
        .replace(/\r\n/g, "\n")
        .trim();
      const cleanSecondText = (secondTextContent || "")
        .replace(/\r\n/g, "\n")
        .trim();

      if (cleanFirstText.length < 10 || cleanSecondText.length < 10) {
        return res.status(400).json({
          error: "No readable text extracted from one or both files.",
          details: "Try using clearer, text-based PDFs instead of poor quality scans.",
        });
      }

      console.log("✅ Text extraction successful, starting comparison...");

      // Split text into lines for comparison, filtering out empty lines
      const firstFileLines = cleanFirstText.split("\n").filter(l => l.trim());
      const secondFileLines = cleanSecondText.split("\n").filter(l => l.trim());
      
      // *** USE THE NEW LINE-BY-LINE COMPARISON UTILITY ***
      const result = compareTextLines(firstFileLines, secondFileLines);

      // Save the detailed comparison to the database
      const newAssignment = new Assignment({
        user: req.user.id,
        filename: `${req.files.firstFile[0].originalname} vs ${req.files.secondFile[0].originalname}`,
        fileHash: generateFileHash(firstFilePath) + ":" + generateFileHash(secondFilePath),
        textContent: `FILE 1:\n${cleanFirstText.substring(0, 1000)}\n\nFILE 2:\n${cleanSecondText.substring(0, 1000)}`,
        similarityScore: result.similarity,
        matchingLines: result.matchingLines,
        totalLines: result.totalLines,
        lineComparisons: result.lineComparisons, // Save the detailed line data
        extractionMethod: "enhanced_ocr",
      });

      await newAssignment.save();

      console.log(`✅ Comparison completed: ${(result.similarity * 100).toFixed(1)}% similarity`);

      // Send the full results back to the frontend
      res.json({
        msg: "Assignments compared successfully",
        similarity: result.similarity,
        matchingLines: result.matchingLines,
        totalLinesCompared: result.totalLines,
        lineComparisons: result.lineComparisons, // <-- Crucial for the new UI
      });
    } catch (err) {
      console.error("💥 Comparison error:", err);
      res.status(500).json({ error: "Server error: " + err.message });
    } finally {
      // Cleanup uploaded files
      if (firstFilePath && fs.existsSync(firstFilePath)) fs.unlinkSync(firstFilePath);
      if (secondFilePath && fs.existsSync(secondFilePath)) fs.unlinkSync(secondFilePath);
    }
  }
);

module.exports = router;