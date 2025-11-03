const natural = require("natural");

function calculateSimilarity(text1, text2) {
  // Using Jaro-Winkler distance for similarity measurement
  return natural.JaroWinklerDistance(text1, text2);
}

module.exports = calculateSimilarity;