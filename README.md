# Warranty Reminder App

A full-stack web application that helps users manage product warranties in one place. Upload purchase invoices, extract warranty details, track expiry dates, and receive automated email reminders before warranties expire.

## Live Demo

**Live Website:** https://warranty-reminder-app.vercel.app/

## Features

- **User Authentication** – Register and log in securely using JWT authentication.
- **Invoice Upload** – Upload PDF, JPG, and PNG invoices (up to 5 MB).
- **Automatic Data Extraction** – Extract product information, purchase dates, and warranty details from uploaded invoices.
- **OCR Support** – Process image-based invoices using OCR.
- **Warranty Dashboard** – View and manage all registered warranties in one place.
- **Expiry Tracking** – Automatically classify warranties as Active, Expiring Soon, or Expired.
- **Warranty Management** – Add, review, edit extracted details before saving, and delete warranty records.
- **Email Reminders** – Send automated warranty expiry reminders using Node Cron and Nodemailer.

## Tech Stack

| Category            | Technologies                        |
| ------------------- | ----------------------------------- |
| Frontend            | React.js, CSS                       |
| Backend             | Node.js, Express.js                 |
| Database            | MongoDB, Mongoose                   |
| Authentication      | JSON Web Token (JWT), bcrypt        |
| File Upload         | Multer                              |
| Text Extraction     | PDF Parsing, Tesseract OCR          |
| Email Notifications | Nodemailer                          |
| Scheduling          | node-cron                           |
| Deployment          | Vercel (Frontend), Render (Backend) |

## Project Structure

```text
Warranty-Reminder-App/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   ├── middleware/
│   └── server.js
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── utils/
│       └── App.js
│
└── README.md
```

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js (16 or later)
- npm
- MongoDB (local instance or MongoDB Atlas)
- Gmail account or another SMTP provider for email reminders

### 1. Clone the Repository

```bash
git clone https://github.com/Dnamanish/Warranty-Reminder-App.git

cd Warranty-Reminder-App
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Start the backend:

```bash
npm start
```

### 3. Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
```

Create or update `.env.development` inside the `frontend` directory:

```env
REACT_APP_API_BASE_URL=http://localhost:8080
```

Start the frontend:

```bash
npm start
```

The application will be available at:

```text
http://localhost:3000
```

## Deployment

| Component | Platform |
| --------- | -------- |
| Frontend  | Vercel   |
| Backend   | Render   |
| Database  | MongoDB  |

For production deployment, configure the frontend API URL using the `REACT_APP_API_BASE_URL` environment variable and set the required backend environment variables in Render.

## Environment Variables

**Backend**

| Variable     | Description                 |
| ------------ | --------------------------- |
| `PORT`       | Backend server port         |
| `MONGO_CONN` | MongoDB connection string   |
| `JWT_SECRET` | Secret used for JWT signing |
| `EMAIL_USER` | SMTP email address          |
| `EMAIL_PASS` | SMTP app password           |

**Frontend**

| Variable                 | Description          |
| ------------------------ | -------------------- |
| `REACT_APP_API_BASE_URL` | Backend API base URL |

## Future Improvements

- Improve invoice extraction accuracy across different invoice formats.
- Add reminder history and notification preferences.
- Move invoice storage to cloud storage.
- Improve background email processing for larger numbers of users.

## Author

**Manish**

GitHub: [@Dnamanish](https://github.com/Dnamanish)
