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

async function getCachedData(key, fetchFunction, ex = 60 * 60 * 24) {
  const cache = await redisClient.get(key);
  if (cache) return JSON.parse(cache);

  const data = await fetchFunction();
  redisClient.set(key, JSON.stringify(data), { EX: ex }).catch(console.error);
  return data;
}
export { redisClient, getCachedData };
