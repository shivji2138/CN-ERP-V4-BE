import { AppError } from "../utils/errors.js";
export const notFoundHandler = () => {
    throw new AppError(404, "Route not found", "ROUTE_NOT_FOUND");
};
export const errorHandler = (error, req, res, _next) => {
    const statusCode = error instanceof AppError ? error.statusCode : 500;
    const code = error instanceof AppError ? error.code : "INTERNAL_ERROR";
    const message = statusCode === 500 ? "Internal server error" : error.message;
    if (statusCode === 500) {
        console.error({ requestId: req.requestId, error });
    }
    res.status(statusCode).json({ success: false, error: { code, message, requestId: req.requestId } });
};
