// ocrExtractor.js
const fs = require("fs");
const path = require("path");
const pdfParse = require("pdf-parse");
const { extractTextFromImage } = require("./googleVisionOCR"); // Google Vision OCR
const pdf2pic = require("pdf2pic");

/**
 * Extract text from scanned PDFs using Google Vision OCR
 * Works on Windows with ImageMagick ('magick')
 */
async function extractTextFromScannedPDF(filePath) {
  const tempDir = path.join(__dirname, "../temp");
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

  // pdf2pic options
  const options = {
    density: 200,
    saveFilename: "ocr_page",
    savePath: tempDir,
    format: "png",
    width: 1200,
    height: 1600,
    convertOptions: {
      cmd: "magick", // Force ImageMagick on Windows
    },
  };

  const convert = pdf2pic.fromPath(filePath, options);

  let totalPages = 0;
  try {
    const dataBuffer = fs.readFileSync(filePath);
    totalPages = await pdfParse(dataBuffer).then((data) => data.numpages);
  } catch (err) {
    console.error("❌ Failed to read PDF:", err.message);
    return "";
  }

  let ocrText = "";

  for (let page = 1; page <= totalPages; page++) {
    console.log(`🔄 Converting page ${page} to image for OCR...`);
    let image;
    try {
      image = await convert(page); // ✅ No 'true' argument
    } catch (convErr) {
      console.error(`❌ PDF→Image conversion failed for page ${page}:`, convErr.message);
      continue;
    }

    console.log(`🔍 Running Google Vision OCR on page ${page}...`);
    try {
      const text = await extractTextFromImage(image.path);
      ocrText += text + "\n";
    } catch (ocrErr) {
      console.error(`❌ OCR failed for page ${page}:`, ocrErr.message);
    }

    // Optional: cleanup image
    if (fs.existsSync(image.path)) fs.unlinkSync(image.path);
  }

  console.log(`✅ OCR extraction done: ${ocrText.length} characters`);
  return ocrText.trim();
}

/**
 * Try direct PDF text extraction first; fallback to OCR
 */
async function extractTextFromPDF(filePath) {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(dataBuffer);
    const directText = pdfData.text?.trim() || "";

    if (directText.length > 30) {
      console.log(`✅ Direct PDF text extraction successful (${directText.length} chars)`);
      return directText;
    } else {
      console.log("⚠️ Direct text extraction too short, using OCR...");
      return await extractTextFromScannedPDF(filePath);
    }
  } catch (error) {
    console.log("⚠️ PDF direct extraction failed, using OCR...", error.message);
    return await extractTextFromScannedPDF(filePath);
  }
}

module.exports = { extractTextFromScannedPDF, extractTextFromPDF };
