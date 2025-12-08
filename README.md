# Warranty Reminder App

A web app to manage device warranties by uploading purchase invoices or warranty PDFs.  
Extracts product, purchase date and warranty end date — and sends reminders before warranty expiry.

---

## 🧰 Features

- Upload invoice PDF or image for a product  
- Automatic extraction of:
  - Product name / category (AC, Refrigerator, Laptop, etc.)  
  - Purchase date  
  - Warranty end date  
- Store warranty info in database 🗄️  
- Dashboard listing all uploaded warranties  
- Delete uploaded warranties  
- Automatic email reminders (cron + SMTP) for upcoming warranty expiry  

---

## 🚀 Getting Started

### Prerequisites

- Node.js (>= 16)  
- MongoDB instance (local or cloud)  
- Gmail (or other SMTP) for email reminders  

### Setup

```bash
git clone https://github.com/YourUsername/Warranty-Reminder-App.git
cd Warranty-Reminder-App

# Install dependencies for backend and frontend
cd backend
npm install

cd ../frontend
npm install
