// Модуль подключения к БД

import mongoose from "mongoose";

export default function mongoConnect(uri) {
  return mongoose
    .set("strictQuery", false)
    .connect(uri)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error("MongoDB not connected", err));
}
