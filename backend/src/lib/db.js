import mongoose from "mongoose";

let cachedConnection = null;
let cachedPromise = null;

export const connectDB = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not configured");
  }

  if (cachedConnection && mongoose.connection.readyState === 1) {
    return cachedConnection;
  }

  if (mongoose.connection.readyState === 1) {
    cachedConnection = mongoose.connection;
    return cachedConnection;
  }

  try {
    if (!cachedPromise) {
      cachedPromise = mongoose.connect(process.env.MONGODB_URI, {
        dbName: process.env.MONGODB_DB_NAME || "chat-app-renew",
        serverSelectionTimeoutMS: 10000,
      });
    }

    const conn = await cachedPromise;
    cachedConnection = conn.connection;
    console.log(`MongoDB connected: ${conn.connection.host}`);
    return cachedConnection;
  } catch (error) {
    cachedPromise = null;
    cachedConnection = null;
    console.log("MongoDB connection error:", error);
    throw error;
  }
};
