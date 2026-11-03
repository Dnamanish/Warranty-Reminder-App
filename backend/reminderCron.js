const cron = require("node-cron");
const nodemailer = require("nodemailer");
const Warranty = require("./models/warranty");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const parseWarrantyDate = (value) => {
  if (!value) return null;

  let day, month, year;

  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    [year, month, day] = value.split("-").map(Number);
  } else if (/^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
    [day, month, year] = value.split("/").map(Number);
  } else {
    return null;
  }

  const date = new Date(Date.UTC(year, month - 1, day));

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }

  return date;
};

cron.schedule("0 0 1 * *", async () => {
  try {
    const now = new Date();

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const fourMonthsAgo = new Date();
    fourMonthsAgo.setMonth(fourMonthsAgo.getMonth() - 4);

    const allWarranties = await Warranty.find({});


    const warranties = allWarranties.filter((item) => {
      const expiryDate = parseWarrantyDate(item.warrantyEndDate);

      if (!expiryDate || expiryDate < today) return false;

      return (
        !item.lastRemindedAt || new Date(item.lastRemindedAt) <= fourMonthsAgo
      );
    });


    for (const warranty of warranties) {
      if (
        !warranty.userEmail ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(warranty.userEmail)
      ) {
        // console.log("Skipping invalid email:", warranty.userEmail);
        continue;
      }

      const productName =
        warranty.productName?.fullLine ||
        warranty.productName?.productCategory ||
        "your product";

      // console.log("Sending reminder to:", warranty.userEmail);

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: warranty.userEmail,
        subject: "Friendly Reminder: Your Warranty is Ending Soon",
        text: `Hi there,

Just a quick heads-up! The warranty for ${productName} is set to expire on ${warranty.warrantyEndDate}.

We recommend checking your coverage and preparing any service requests if needed.

– Warranty Reminder App`,
      });

      warranty.lastRemindedAt = now;
      await warranty.save();

      // console.log("Reminder sent successfully:", warranty.userEmail);
    }
  } catch (error) {
    console.error("REMINDER CRON ERROR:", error);
  }
});
