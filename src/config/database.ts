import mongoose from "mongoose";
import { env } from "./env.js";

export async function connectDatabase() {
  mongoose.set("strictQuery", true);
  await mongoose.connect(env.MONGODB_URI, {
    maxPoolSize: 100,
    minPoolSize: 10,
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000
  });
  console.log("MongoDB connected");
}
