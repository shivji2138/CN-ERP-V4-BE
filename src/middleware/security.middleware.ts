import rateLimit from "express-rate-limit";
import { v4 as uuid } from "uuid";
import type { RequestHandler } from "express";
import { env } from "../config/env.js";

export const requestId: RequestHandler = (req, res, next) => {
  req.requestId = uuid();
  res.setHeader("x-request-id", req.requestId);
  next();
};

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: env.NODE_ENV === "production" ? 1500 : 10000,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: { code: "RATE_LIMITED", message: "Too many requests. Please try again shortly." } }
});

export const authLimiter = rateLimit({
  windowMs: env.NODE_ENV === "production" ? 15 * 60 * 1000 : 60 * 1000,
  limit: env.NODE_ENV === "production" ? 100 : 1000,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  message: { success: false, error: { code: "AUTH_RATE_LIMITED", message: "Too many auth requests. Please wait a moment and try again." } }
});
