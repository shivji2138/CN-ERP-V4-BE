import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { redis } from "../config/redis.js";
import { AppError } from "../utils/errors.js";
import { User } from "../modules/user/user.model.js";
import { Role } from "../modules/role/role.model.js";
export const requireAuth = async (req, _res, next) => {
    const bearer = req.headers.authorization?.startsWith("Bearer ") ? req.headers.authorization.slice(7) : undefined;
    const token = req.cookies?.accessToken ?? bearer;
    if (!token)
        throw new AppError(401, "Authentication required", "AUTH_REQUIRED");
    try {
        const payload = jwt.verify(token, env.JWT_ACCESS_SECRET);
        const cached = await redis.get(`session:${payload.sub}:${payload.tokenVersion}`);
        if (!cached)
            throw new AppError(401, "Session expired", "SESSION_EXPIRED");
        const user = (await User.findById(payload.sub).lean());
        if (!user || user.isDeleted || user.status !== "active") {
            throw new AppError(401, "User is not active", "USER_INACTIVE");
        }
        const role = (user.roleId ? await Role.findById(user.roleId).lean() : undefined);
        req.user = {
            id: String(user._id),
            roleId: user.roleId,
            panel: user.panel,
            role: user.role,
            departmentId: user.departmentId,
            permissions: user.role === "super_admin" ? ["*"] : (role?.permissions ?? [])
        };
        next();
    }
    catch (error) {
        if (error instanceof AppError)
            throw error;
        throw new AppError(401, "Invalid token", "INVALID_TOKEN");
    }
};
export const requirePermission = (permission) => (req, _res, next) => {
    if (!req.user)
        throw new AppError(401, "Authentication required", "AUTH_REQUIRED");
    if (req.user.permissions.includes("*") || req.user.permissions.includes(permission))
        return next();
    throw new AppError(403, "You do not have permission for this action", "FORBIDDEN");
};
export const requirePanel = (...panels) => (req, _res, next) => {
    if (!req.user)
        throw new AppError(401, "Authentication required", "AUTH_REQUIRED");
    if (panels.includes(req.user.panel))
        return next();
    throw new AppError(403, "Panel access denied", "PANEL_FORBIDDEN");
};
