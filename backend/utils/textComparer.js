// utils/textComparer.js

const natural = require("natural");

// You can adjust this threshold. 0.9 means lines must be 90% similar to be a "match".
const SIMILARITY_THRESHOLD = 0.9;

/**
 * Compares two arrays of text lines using Jaro-Winkler similarity.
 * @param {string[]} lines1 - An array of strings from the first file.
 * @param {string[]} lines2 - An array of strings from the second file.
 * @returns {object} An object containing the detailed comparison results.
 */
function compareTextLines(lines1, lines2) {
  const lineComparisons = [];
  let matchingLines = 0;
  const maxLines = Math.max(lines1.length, lines2.length);

  for (let i = 0; i < maxLines; i++) {
    const line1 = lines1[i] || "";
    const line2 = lines2[i] || "";

    // Skip comparison if both lines are effectively empty
    if (line1.trim() === "" && line2.trim() === "") {
      continue;
    }

    // Normalize text for better comparison (lowercase, remove extra spaces)
    const normalizedLine1 = line1.toLowerCase().replace(/\s+/g, " ");
    const normalizedLine2 = line2.toLowerCase().replace(/\s+/g, " ");

    const similarityScore = natural.JaroWinklerDistance(
      normalizedLine1,
      normalizedLine2
    );

    const matched = similarityScore >= SIMILARITY_THRESHOLD;

    if (matched) {
      matchingLines++;
    }

    lineComparisons.push({
      lineNumber: i + 1,
      firstFileLine: line1,
      secondFileLine: line2,
      similarity: similarityScore,
      matched: matched,
    });
  }

  // Calculate the overall similarity score based on the number of matched lines
  const overallSimilarity =
    lineComparisons.length > 0 ? matchingLines / lineComparisons.length : 0;

  return {
    lineComparisons,
    matchingLines,
    totalLines: lineComparisons.length,
    similarity: overallSimilarity,
  };
}

module.exports = compareTextLines;