import rateLimit from "express-rate-limit";
import { v4 as uuid } from "uuid";
export const requestId = (req, res, next) => {
    req.requestId = uuid();
    res.setHeader("x-request-id", req.requestId);
    next();
};
export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 1500,
    standardHeaders: true,
    legacyHeaders: false
});
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 20,
    standardHeaders: true,
    legacyHeaders: false
});
