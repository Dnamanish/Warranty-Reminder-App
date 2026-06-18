const mongoose = require("mongoose");

const WarrantySchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  fileName: { type: String, required: null },
  warrantyEndDate: { type: String, required: null }, 
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
