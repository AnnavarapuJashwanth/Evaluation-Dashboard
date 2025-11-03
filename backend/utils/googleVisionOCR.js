import vision from "@google-cloud/vision";
import fs from "fs";
import path from "path";

/**
 * Creates and configures the Google Cloud Vision client using either:
 *  - Render Secret File (preferred for production)
 *  - Local file (for local testing)
 *  - Environment variable (fallback)
 */
function createVisionClient() {
  try {
    const secretFilePath = "/etc/secrets/google-cloud-key.json";
    const localFilePath = path.join(process.cwd(), "backend/config/google-cloud-key.json");

    let credentials = null;

    if (fs.existsSync(secretFilePath)) {
      console.log("✅ Using Render Secret File for Google Cloud credentials.");
      const keyData = fs.readFileSync(secretFilePath, "utf8");
      credentials = JSON.parse(keyData);
    } else if (fs.existsSync(localFilePath)) {
      console.log("✅ Using local google-cloud-key.json file for credentials.");
      const keyData = fs.readFileSync(localFilePath, "utf8");
      credentials = JSON.parse(keyData);
    } else if (process.env.GOOGLE_CLOUD_KEY) {
      console.log("✅ Using GOOGLE_CLOUD_KEY environment variable for credentials.");
      credentials = JSON.parse(process.env.GOOGLE_CLOUD_KEY);
    } else {
      throw new Error("❌ Google Cloud key not found (neither secret file, local file, nor env variable).");
    }

    // Create Vision API client
    const client = new vision.ImageAnnotatorClient({ credentials });
    console.log("✅ Google Vision client initialized successfully.");
    return client;
  } catch (error) {
    console.error("❌ Failed to initialize Google Vision client:", error.message);
    throw new Error("Google Cloud credentials missing or invalid.");
  }
}

// Export client
export const visionClient = createVisionClient();

/**
 * Perform OCR on an image using Google Vision API
 * @param {string} imagePath - Path or URL of the image
 * @returns {Promise<string>} Extracted text
 */
export async function extractTextFromImage(imagePath) {
  try {
    const [result] = await visionClient.textDetection(imagePath);
    const detections = result.textAnnotations;
    return detections[0]?.description || "";
  } catch (error) {
    console.error("❌ OCR error:", error.message);
    throw new Error("OCR processing failed. Check Google Vision setup.");
  }
}
