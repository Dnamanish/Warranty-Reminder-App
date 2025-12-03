const express = require("express");
const multer = require("multer");
const app = express();
const path = require("path");
const router = express.Router();
const pdfParse = require("pdf-parse");
const tesseract = require("tesseract.js");
const fs = require("fs");
const warranty = require("../models/warranty");

// storage for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

router.post("/upload", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  let purchaseDate = null;
  let warrantyPeriod = null;
  let warrantyEndDate = null;
  let text = "";

  try {
    if (req.file.mimetype === "application/pdf") {
      // agr pdf h to text extract krega
      const dataBuffer = fs.readFileSync(req.file.path);
      const data = await pdfParse(dataBuffer);
      text = data.text;
    } else if (req.file.mimetype.startsWith("image/")) {
      const result = await tesseract.recognize(req.file.path, "eng");
      text = result.data.text;
    }

    // extract product name
    const productMatch = text.match(/Laptop Model\s*([A-Za-z0-9\- ]+)/i);
    const productName = productMatch ? productMatch[1].trim() : "unknown";

    // extract purchased date first
    const purchaseDateMatch = text.match(/\b\d{2}[\/\-]\d{2}[\/\-]\d{4}\b/);
    purchaseDate = purchaseDateMatch ? purchaseDateMatch[0] : null;

    // extract warranty period
    const numYearMatch = text.match(/(\d+)\s*(year|month)s?/i);
    if (numYearMatch) {
      warrantyPeriod = {
        value: parseInt(numYearMatch[1]),
        unit: numYearMatch[2],
      };
    } else {
      const wordYearMatch = text.match(
        /(one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve)\s*(year|month)s?/i
      );
      if (wordYearMatch) {
        const num = wordToNumber(wordYearMatch[1]);
        if (num) {
          warrantyPeriod = { value: num, unit: wordYearMatch[2] };
        }
      }
    }

    // 3. Calculate warranty end date
    if (purchaseDate && warrantyPeriod) {
      const [day, month, year] = purchaseDate.split(/[\/\-]/).map(Number);
      let endDate = new Date(year, month - 1, day);
      if (warrantyPeriod.unit.startsWith("year")) {
        endDate.setFullYear(endDate.getFullYear() + warrantyPeriod.value);
      } else if (warrantyPeriod.unit.startsWith("month")) {
        endDate.setMonth(endDate.getMonth() + warrantyPeriod.value);
      }
      warrantyEndDate = endDate.toISOString().slice(0, 10);
    }

    await warranty.create({
      userEmail: req.body.email || "test@gmail.com",
      fileName: req.file.filename,
      originalName:req.file.originalname,
      warrantyEndDate: warrantyEndDate,
      productName: productName,
      notified: false,
    });

    res.status(200).json({
      message: "File uploaded and info extracted",
      purchaseDate,
      warrantyPeriod: warrantyPeriod
        ? `${warrantyPeriod.value} ${warrantyPeriod.unit}`
        : null,
      warrantyEndDate,
      textPreview: text.substring(0, 200),
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error processing file", error: error.message });
  }
});

/// for getting user previously uploaded files
router.get("/myfiles", async (req, res) => {
  try {
    const email = req.query.email;
    if (!email) {
      return res.status(400).json({ message: "email required" });
    }

    const files = await warranty.find({ userEmail: email });
    res.json(files);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
