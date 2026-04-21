import "dotenv/config";

const defaultOrigins = [
  "http://localhost:5173",
  "https://my-chat-app-74fw.vercel.app",
];

export const allowedOrigins = (process.env.CLIENT_URL || defaultOrigins.join(","))
  .split(",")
  .map((origin) => origin.trim().replace(/\/$/, ""))
  .filter(Boolean);
