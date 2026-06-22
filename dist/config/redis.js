import { Redis } from "ioredis";
import { env } from "./env.js";
export const redis = new Redis(env.REDIS_URL, {
    maxRetriesPerRequest: 3,
    enableReadyCheck: true,
    lazyConnect: true
});
export async function connectRedis() {
    if (redis.status === "wait") {
        await redis.connect();
    }
    console.log("Redis connected");
}
