import type { ErrorRequestHandler } from "express";
import mongoose from "mongoose";
import { AppError } from "../utils/errors.js";

export const notFoundHandler = () => {
  throw new AppError(404, "Route not found", "ROUTE_NOT_FOUND");
};

export const errorHandler: ErrorRequestHandler = (error, req, res, _next) => {
  if (error instanceof mongoose.Error.ValidationError) {
    const message = Object.values(error.errors)
      .map((issue) => issue.message)
      .join(", ");
    res.status(400).json({ success: false, error: { code: "VALIDATION_ERROR", message, requestId: req.requestId } });
    return;
  }

  const statusCode = error instanceof AppError ? error.statusCode : 500;
  const code = error instanceof AppError ? error.code : "INTERNAL_ERROR";
  const message = statusCode === 500 ? "Internal server error" : error.message;
  if (statusCode === 500) {
    console.error({ requestId: req.requestId, error });
  }
  res.status(statusCode).json({ success: false, error: { code, message, requestId: req.requestId } });
};
