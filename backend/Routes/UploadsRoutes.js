const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const pdfParse = require("pdf-parse");
const tesseract = require("tesseract.js");
const fs = require("fs");
const warranty = require("../models/warranty");

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF, JPEG, and PNG files are allowed."));
    }
  },
});

// Convert number words into numbers
function wordToNumber(word) {
  const numbers = {
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
    seven: 7,
    eight: 8,
    nine: 9,
    ten: 10,
    eleven: 11,
    twelve: 12,
  };

  return numbers[word.toLowerCase()] || null;
}

// Extract product name
function extractProductName(text) {
  const productKeywords = [
    "Refrigerator",
    "Fridge",
    "Refrig",
    "Freezer",
    "Mini Fridge",
    "Double Door",
    "Single Door",
    "Deep Freezer",
    "Cooling Unit",
    "Laptop",
    "Notebook",
    "Ultrabook",
    "MacBook",
    "Computer",
    "Portable Computer",
    "Air Conditioner",
    "Room AC",
    "Split AC",
    "Window AC",
    "Air Cooling Unit",
    "Television",
    "LED TV",
    "LCD TV",
    "Smart TV",
    "Android TV",
    "OLED TV",
    "4K TV",
    "Washing Machine",
    "Washer",
    "Automatic Washer",
    "Front Load",
    "Top Load",
    "Mobile",
    "Smartphone",
    "iPhone",
    "Android Phone",
    "Microwave",
    "Oven",
    "Microwave Oven",
    "Convection Oven",
    "Ceiling Fan",
    "Table Fan",
    "Pedestal Fan",
    "Electric Fan",
    "Air Cooler",
    "Mixer",
    "Mixer Grinder",
    "Grinder",
    "Blender",
    "Juicer",
    "Electric Kettle",
    "Toaster",
    "Printer",
    "Scanner",
    "Monitor",
    "Desktop",
    "Speaker",
    "Soundbar",
    "Headphones",
  ];

  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  for (const keyword of productKeywords) {
    const keyLower = keyword.toLowerCase();

    for (let i = 0; i < lines.length; i++) {
      if (lines[i].toLowerCase().includes(keyLower)) {
        let fullLine = lines[i];

        if (i > 0 && !/qty|price|mrp|amount/i.test(lines[i - 1])) {
          fullLine = lines[i - 1] + " " + fullLine;
        }

        fullLine = fullLine.replace(
          /\b(qty|quantity|price|amount)[:\s]*\d+/gi,
          "",
        );

        fullLine = fullLine.replace(/^\d+\.\s*/, "");
        fullLine = fullLine.replace(/\d+%.*$/, "");
        fullLine = fullLine.replace(/₹.*$/, "");
        fullLine = fullLine.replace(/([A-Za-z])\d+$/, "$1");
        fullLine = fullLine.replace(/\s+/g, " ").trim();

        return {
          fullLine: fullLine,
          productCategory: keyword,
        };
      }
    }
  }

  return {
    fullLine: "unknown",
    productCategory: "unknown",
  };
}

// Upload and extract invoice information
router.post(
  "/upload",
  (req, res, next) => {
    upload.single("file")(req, res, (err) => {
      if (err) {
        if (
          err instanceof multer.MulterError &&
          err.code === "LIMIT_FILE_SIZE"
        ) {
          return res.status(413).json({
            message: "File is too large. Maximum allowed size is 5 MB.",
          });
        }

        return res.status(400).json({
          message: err.message || "This file type is not supported.",
        });
      }

      next();
    });
  },
  async (req, res) => {
    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    let purchaseDate = null;
    let warrantyPeriod = null;
    let warrantyEndDate = null;
    let text = "";

    try {
      if (req.file.mimetype === "application/pdf") {
        const dataBuffer = fs.readFileSync(req.file.path);
        const data = await pdfParse(dataBuffer);
        text = data.text;
      } else if (req.file.mimetype.startsWith("image/")) {
        const result = await tesseract.recognize(req.file.path, "eng");
        text = result.data.text;
      }

      // Extract product name
      const productName = extractProductName(text);

      // Extract purchase date
      let purchaseDateMatch = text.match(/\b\d{2}[/-]\d{2}[/-]\d{4}\b/);

      if (!purchaseDateMatch) {
        purchaseDateMatch = text.match(
          /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{1,2},?\s+\d{4}/i,
        );
      }

      purchaseDate = purchaseDateMatch ? purchaseDateMatch[0] : null;

      // Extract warranty period
      const numYearMatch = text.match(/(\d+)\s*(year|month)s?/i);

      if (numYearMatch) {
        warrantyPeriod = {
          value: parseInt(numYearMatch[1], 10),
          unit: numYearMatch[2],
        };
      } else {
        const wordYearMatch = text.match(
          /(one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve)\s*(year|month)s?/i,
        );

        if (wordYearMatch) {
          const num = wordToNumber(wordYearMatch[1]);

          if (num) {
            warrantyPeriod = {
              value: num,
              unit: wordYearMatch[2],
            };
          }
        }
      }

      // Calculate warranty end date
      if (purchaseDate && warrantyPeriod) {
        let day, month, year;

        const numericDateMatch = purchaseDate.match(
          /^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/,
        );

        if (numericDateMatch) {
          day = Number(numericDateMatch[1]);
          month = Number(numericDateMatch[2]);
          year = Number(numericDateMatch[3]);
        } else {
          const parsedDate = new Date(purchaseDate);

          if (!Number.isNaN(parsedDate.getTime())) {
            day = parsedDate.getUTCDate();
            month = parsedDate.getUTCMonth() + 1;
            year = parsedDate.getUTCFullYear();
          }
        }

        if (day && month && year) {
          const endDate = new Date(Date.UTC(year, month - 1, day));

          if (warrantyPeriod.unit.toLowerCase().startsWith("year")) {
            endDate.setUTCFullYear(
              endDate.getUTCFullYear() + warrantyPeriod.value,
            );
          } else if (warrantyPeriod.unit.toLowerCase().startsWith("month")) {
            endDate.setUTCMonth(endDate.getUTCMonth() + warrantyPeriod.value);
          }

          warrantyEndDate = endDate.toISOString().slice(0, 10);
        }
      }

      return res.status(200).json({
        message: "File uploaded and info extracted",
        productCategory: productName.productCategory,
        productFullName: productName.fullLine,
        purchaseDate,
        warrantyPeriod: warrantyPeriod
          ? `${warrantyPeriod.value} ${warrantyPeriod.unit}`
          : null,
        warrantyEndDate,
        textPreview: text,
      });
    } catch (error) {
      console.error("Error processing uploaded file:", error);

      return res.status(500).json({
        message:
          "Unable to process this file. Please upload a valid PDF or supported image.",
      });
    }
  },
);

// Get user's previously uploaded warranties
router.get("/myfiles", async (req, res) => {
  try {
    const email = req.query.email;

    if (!email) {
      return res.status(400).json({
        message: "email required",
      });
    }

    const files = await warranty.find({
      userEmail: email,
    });

    return res.json(files);
  } catch (err) {
    console.error("FETCH WARRANTIES ERROR:", err);

    return res.status(500).json({
      message: "Server error",
    });
  }
});

// Delete a warranty
router.delete("/delete/:id", async (req, res) => {
  try {
    const fileId = req.params.id;

    const file = await warranty.findById(fileId);

    if (!file) {
      return res.status(404).json({
        message: "Warranty record not found.",
      });
    }

    // Delete invoice file if it exists
    if (file.fileName) {
      const filePath = path.join(
        __dirname,
        "../uploads",
        path.basename(file.fileName),
      );

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await warranty.findByIdAndDelete(fileId);

    return res.status(200).json({
      message: "Warranty deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE ERROR:", error);

    return res.status(500).json({
      message: "Server error while deleting warranty.",
    });
  }
});

// Save warranty information
router.post("/saveWarranty", async (req, res) => {
  try {
    await warranty.create({
      userEmail: req.body.email,
      purchaseDate: req.body.purchaseDate,
      warrantyEndDate: req.body.warrantyEndDate,
      productName: {
        fullLine: req.body.productName,
        productCategory: "manual",
      },
      notified: false,
    });

    return res.json({
      message: "Warranty saved successfully",
    });
  } catch (error) {
    console.error("SAVE WARRANTY ERROR:", error);

    return res.status(500).json({
      message: "Error saving warranty!",
      error: error.message,
    });
  }
});

module.exports = router;
