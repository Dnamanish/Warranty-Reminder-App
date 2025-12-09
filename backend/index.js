const express = require("express");
const app = express();
require("dotenv").config();
require("./models/Db");
const bodyParser = require("body-parser");
const cors = require("cors");
const AuthRouter = require("./Routes/AuthRouter");
const UploadRouter = require("./Routes/UploadsRoutes");
const warranty = require("./models/warranty");
require("./reminderCron");

app.use("/uploads", express.static("uploads"));

const PORT = process.env.PORT || 8080;
app.use(bodyParser.json());

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173", 
      "https://warranty-reminder-app.vercel.app/", 
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use("/auth", AuthRouter);

// app.get('/',(req,res)=>{
//     res.send('pong')
// })

app.use("/dashboard", UploadRouter);

app.listen(PORT, () => {
  console.log(`server is running ${PORT}`);
});
