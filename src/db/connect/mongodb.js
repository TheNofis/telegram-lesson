// Модуль подключения к БД

import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const mongoUrl = process.env.MONGODB_URI || "mongodb://localhost:27017";

const mongoClient = mongoose
  .set("strictQuery", false)
  .connect(mongoUrl)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB not connected", err));

export default mongoClient;
