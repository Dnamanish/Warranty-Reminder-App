const mongoose = require("mongoose");

const WarrantySchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  fileName: { type: String, required: true },
  warrantyEndDate: { type: String, required: true }, // or { type: Date } if you want to store as Date
  notified: { type: Boolean, default: false },
  lastRemindedAt: { type: Date, default: null },
  purchaseDate: { type: String, default: null },
  productName: {
    fullLine: String,
    productCategory: String,
  },
  originalName: String,
});

module.exports = mongoose.model("Warranty", WarrantySchema);
