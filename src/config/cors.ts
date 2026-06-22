import type { CorsOptions } from "cors";
import { env } from "./env.js";

export const allowedOrigins = [
  env.CLIENT_URL,
  "https://cybernaut-erp-dev-dynamos.vercel.app",
  ...(env.ALLOWED_ORIGINS?.split(",").map((origin) => origin.trim()).filter(Boolean) ?? [])
];

function isAllowedOrigin(origin: string) {
  if (allowedOrigins.includes(origin)) return true;
  try {
    const url = new URL(origin);
    return url.hostname === "localhost" || url.hostname === "127.0.0.1" || url.hostname.endsWith(".vercel.app");
  } catch {
    return false;
  }
}

export const corsOptions: CorsOptions = {
  credentials: true,
  origin(origin, callback) {
    if (!origin) return callback(null, true);
    if (isAllowedOrigin(origin)) return callback(null, true);
    return callback(null, false);
  }
};
