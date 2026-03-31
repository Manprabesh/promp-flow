import mongoose from "mongoose";

const connectDB = async () => {
  try {

    const DB_URI =
      process.env.NODE_ENV === "development"
        ? "mongodb://localhost:27017/promptflow"   // ← was "http://", mongodb:// is correct
        : process.env.MONGO_URI;
    const conn = await mongoose.connect( process.env.MONGO_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("DB connection error:", error.message);
    // process.exit(1);
  }
};

export default connectDB;