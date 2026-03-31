import express from 'express';
import dotenv from 'dotenv';
import connectDB from "./config/db.js";
import cors from "cors";
import cookieParser from 'cookie-parser';
dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let frontendURI = "";
if (process.env.NODE_ENV == "production") {
  frontendURI = process.env.FRONTEND_URI
} else {
  frontendURI = "http://localhost:5173"
}

app.use(cors({
  origin: frontendURI,
  credentials: true,
}));
app.use(cookieParser())

//routers
import authRouter from './routes/auth.router.js';
import messageRouter from './routes/message.router.js';
app.use("/api/v1", authRouter);
app.use("/api/v1", messageRouter);

import groupRouter from './routes/group.router.js';
app.use("/api/v1", groupRouter);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port${PORT}`);

  console.log("uri --->", frontendURI)
});