const vision = require("@google-cloud/vision");
const path = require("path");
const fs = require("fs");

/**
 * Initialize Google Cloud Vision client
 */
function createVisionClient() {
  const keyPath = path.join(__dirname, "../config/google-cloud-key.json");

  if (!fs.existsSync(keyPath)) {
    console.error(`❌ Google Cloud key file not found: ${keyPath}`);
    throw new Error("Google Cloud key file missing. Add it under /config.");
  }

  const client = new vision.ImageAnnotatorClient({ keyFilename: keyPath });
  console.log("✅ Google Vision client initialized from:", keyPath);
  return client;
}

const client = createVisionClient();

/**
 * Extract text from image using Google Vision
 */
async function extractTextFromImage(filePath) {
  try {
    const [result] = await client.textDetection(filePath);
    const detections = result.textAnnotations;

    if (!detections || detections.length === 0) {
      console.log("⚠️ No text detected in image:", filePath);
      return "";
    }

    return detections[0].description;
  } catch (error) {
    console.error("❌ Google Vision OCR Error:", error.message);
    throw error;
  }
}

module.exports = { extractTextFromImage };
