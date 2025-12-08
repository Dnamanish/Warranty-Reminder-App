const express = require("express");
const multer = require("multer");
const app = express();
const path = require("path");
const router = express.Router();
const pdfParse = require("pdf-parse");
const tesseract = require("tesseract.js");
const fs = require("fs");
const warranty = require("../models/warranty");
const { log } = require("console");

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

// helper function to get product name
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
    "PC",
    "Portable Computer",
    "AC",
    "A/C",
    "Air Conditioner",
    "Room AC",
    "Split AC",
    "Window AC",
    "Air Cooling Unit",
    "Television",
    "TV",
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
    .map((l) => l.trim())
    .filter(Boolean);

  for (const keyword of productKeywords) {
    const keyLower = keyword.toLowerCase();

    for (let i = 0; i < lines.length; i++) {
      if (lines[i].toLowerCase().includes(keyLower)) {
        let fullLine = lines[i];

        if (i > 0 && !lines[i - 1].match(/qty|price|mrp|amount/i)) {
          fullLine = lines[i - 1] + " " + fullLine;
        }

        fullLine = fullLine.replace(
          /\b(qty|quantity|price|amount)[:\s]*\d+/gi,
          ""
        );
        fullLine = fullLine.replace(/\b\d+\s*(pcs|units?)\b/gi, "");
        fullLine = fullLine.replace(/\s+/g, " ").trim();

        return {
          fullLine: fullLine, // full product name
          productCategory: keyword, // matching keyword
        };
      }
    }
  }

  return {
    fullLine: "unknown",
    productCategory: "unknown",
  };
}

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
    const productName = extractProductName(text);

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
      userEmail: req.body.email || "test49754@gmail.com",
      fileName: req.file.filename,
      originalName: req.file.originalname,
      warrantyEndDate: warrantyEndDate,
      purchaseDate,
      productName: {
        fullLine: productName.fullLine,
        productCategory: productName.productCategory,
      },
      notified: false,
    });

    res.status(200).json({
      message: "File uploaded and info extracted",
      productCategory: productName.productCategory,

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

// for deleting previously uploaded files
router.delete("/delete/:id", async (req, res) => {
  try {
    const fileId = req.params.id;
    const file = await warranty.findById(fileId);
    if (!file) {
      return res.status(404).json({message:"File not found !!!!"});
    }

    // delete from uploaded folder
    const filePath = path.join(__dirname, "../uploads", file.fileName);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // delete form db
    await warranty.findByIdAndDelete(fileId);

    res.json({ message: "File deleted successfully" });
  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).json({ message: "Server error while deleting file" });
  }
});

module.exports = router;
