// Модуль подключения к БД

import mongoose from "mongoose";

export default function mongoConnect() {
  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";
  return mongoose
    .set("strictQuery", false)
    .connect(uri)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error("MongoDB not connected", err));
}
