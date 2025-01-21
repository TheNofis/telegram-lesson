// Модуль кеширования
import { createClient } from "redis";

const redisClient = await createClient({
  url: "redis://server.thenofis.ru:6379",
})
  .on("error", (err) => console.log("Redis Client Error", err))
  .connect();

export default redisClient;

