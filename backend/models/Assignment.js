// models/Assignment.js

const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  filename: String,
  fileHash: String,
  textContent: String,
  similarityScore: Number,
  matchingLines: Number,
  totalLines: Number,
  lineComparisons: [
    {
      lineNumber: Number,
      firstFileLine: String,
      secondFileLine: String,
      matched: Boolean,
      similarity: Number, // <-- ADDED: Stores the similarity score for the line pair
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Assignment", assignmentSchema);