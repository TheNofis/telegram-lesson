// Модуль кеширования

import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

const redisUrl = process.env.REDIS_URL || "redis://server.thenofis.ru:6379";
const redisClient = await createClient({
  url: redisUrl,
})
  .on("error", (err) => console.log("Redis Client Error", err))
  .on("ready", () => console.log("Redis connected"))
  .connect();

export default redisClient;