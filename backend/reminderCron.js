const cron = require('node-cron');
const nodemailer = require('nodemailer');
const Warranty = require('./models/warranty');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'manish795503@gmail.com',
    pass: 'kucl twpo bphd lqvs'
  }
});

cron.schedule('0 0 1 * *', async () => {
  console.log('Cron job running...');
  const now = new Date();
  
  const fourMonthsAgo=new Date(now.getFullYear(),now.getMonth()-4,now.getDate());

  const warranties = await Warranty.find({
    warrantyEndDate: { $gte: now.toISOString().slice(0,10)},
    $or:[
      {lastRemindedAt:{$lte:fourMonthsAgo}},
      {lastRemindedAt:null}
    ]
  });

  console.log('Found warranties:', warranties.length);

  for (const warranty of warranties) {
  // Basic email validation
  if (!warranty.userEmail || !warranty.userEmail.includes('@')) {
    console.log('Skipping invalid email:', warranty.userEmail);
    continue;
  }
  console.log('Sending email to:', warranty.userEmail);
  await transporter.sendMail({
    to: warranty.userEmail,
    subject: 'Warranty Expiry Reminder',
    text: `Hello,\nYour warranty for ${warranty.productName} expires on ${warranty.warrantyEndDate}.\nPlease take necessary action.\n\n- Your Warranty App`
  });
  warranty.lastRemindedAt = now;
  await warranty.save();
}
});