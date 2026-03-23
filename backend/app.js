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
app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true,               
}));
app.use(cookieParser())

//routers
import authRouter from './routes/auth.router.js';
import messageRouter from './routes/message.router.js';
app.use("/api/v1",authRouter);
app.use("/api/v1",messageRouter);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});