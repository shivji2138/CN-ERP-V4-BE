import { Redis } from "ioredis";
import { env } from "./env.js";

type SetMode = "EX";

const memoryStore = new Map<string, { value: string; expiresAt?: number }>();
let redisClient: Redis | null = new Redis(env.REDIS_URL, {
  maxRetriesPerRequest: 3,
  enableReadyCheck: true,
  lazyConnect: true
});

function readMemory(key: string) {
  const item = memoryStore.get(key);
  if (!item) return null;
  if (item.expiresAt && item.expiresAt <= Date.now()) {
    memoryStore.delete(key);
    return null;
  }
  return item.value;
}

export const redis = {
  get status() {
    return redisClient?.status ?? "memory";
  },
  async get(key: string) {
    return redisClient ? redisClient.get(key) : readMemory(key);
  },
  async set(key: string, value: string, mode?: SetMode, seconds?: number) {
    if (redisClient) {
      if (mode && seconds) return redisClient.set(key, value, mode, seconds);
      return redisClient.set(key, value);
    }
    memoryStore.set(key, { value, expiresAt: mode === "EX" && seconds ? Date.now() + seconds * 1000 : undefined });
    return "OK";
  },
  async del(key: string) {
    if (redisClient) return redisClient.del(key);
    return memoryStore.delete(key) ? 1 : 0;
  },
  async quit() {
    if (redisClient) return redisClient.quit();
    memoryStore.clear();
    return "OK";
  }
};

export async function connectRedis() {
  if (!redisClient) return;
  try {
    if (redisClient.status === "wait") {
      await redisClient.connect();
    }
    console.log("Redis connected");
  } catch (error) {
    if (env.NODE_ENV === "production" || env.REDIS_REQUIRED) {
      throw error;
    }
    redisClient.disconnect();
    redisClient = null;
    console.warn("Redis unavailable; using in-memory sessions for local development");
  }
}
