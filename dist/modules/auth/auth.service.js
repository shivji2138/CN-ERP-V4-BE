import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env, isProduction } from "../../config/env.js";
import { redis } from "../../config/redis.js";
import { AppError } from "../../utils/errors.js";
import { User } from "../user/user.model.js";
import { Role } from "../role/role.model.js";
const refreshCookieName = "refreshToken";
const accessCookieName = "accessToken";
function signAccessToken(userId, tokenVersion) {
    return jwt.sign({ sub: userId, tokenVersion }, env.JWT_ACCESS_SECRET, { expiresIn: env.JWT_ACCESS_EXPIRES_IN });
}
function signRefreshToken(userId, tokenVersion) {
    return jwt.sign({ sub: userId, tokenVersion }, env.JWT_REFRESH_SECRET, { expiresIn: env.JWT_REFRESH_EXPIRES_IN });
}
function setAuthCookies(res, accessToken, refreshToken) {
    const base = {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        domain: isProduction ? env.COOKIE_DOMAIN : undefined
    };
    res.cookie(accessCookieName, accessToken, { ...base, maxAge: 15 * 60 * 1000 });
    res.cookie(refreshCookieName, refreshToken, { ...base, maxAge: 7 * 24 * 60 * 60 * 1000 });
}
export async function login(email, password, res) {
    const user = (await User.findOne({ email: email.toLowerCase(), isDeleted: false }).select("+passwordHash"));
    if (!user || user.status !== "active")
        throw new AppError(401, "Invalid credentials", "INVALID_CREDENTIALS");
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok)
        throw new AppError(401, "Invalid credentials", "INVALID_CREDENTIALS");
    const accessToken = signAccessToken(String(user._id), user.refreshTokenVersion);
    const refreshToken = signRefreshToken(String(user._id), user.refreshTokenVersion);
    await redis.set(`session:${user._id}:${user.refreshTokenVersion}`, "active", "EX", 7 * 24 * 60 * 60);
    user.lastLoginAt = new Date();
    await user.save();
    setAuthCookies(res, accessToken, refreshToken);
    const role = (user.roleId ? await Role.findById(user.roleId).lean() : undefined);
    return {
        accessToken,
        user: {
            id: String(user._id),
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            panel: user.panel,
            role: user.role,
            permissions: user.role === "super_admin" ? ["*"] : role?.permissions ?? []
        }
    };
}
export async function refresh(refreshToken, res) {
    if (!refreshToken)
        throw new AppError(401, "Refresh token required", "REFRESH_REQUIRED");
    const payload = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET);
    const user = (await User.findById(payload.sub));
    if (!user || user.refreshTokenVersion !== payload.tokenVersion)
        throw new AppError(401, "Invalid refresh token", "INVALID_REFRESH");
    const accessToken = signAccessToken(String(user._id), user.refreshTokenVersion);
    const nextRefreshToken = signRefreshToken(String(user._id), user.refreshTokenVersion);
    await redis.set(`session:${user._id}:${user.refreshTokenVersion}`, "active", "EX", 7 * 24 * 60 * 60);
    setAuthCookies(res, accessToken, nextRefreshToken);
    return { accessToken };
}
export async function logout(userId, res) {
    if (userId) {
        const user = (await User.findById(userId));
        if (user) {
            await redis.del(`session:${user._id}:${user.refreshTokenVersion}`);
            user.refreshTokenVersion += 1;
            await user.save();
        }
    }
    res.clearCookie(accessCookieName);
    res.clearCookie(refreshCookieName);
}
export async function changePassword(userId, currentPassword, newPassword) {
    const user = (await User.findById(userId).select("+passwordHash"));
    if (!user)
        throw new AppError(404, "User not found", "NOT_FOUND");
    const ok = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!ok)
        throw new AppError(400, "Current password is incorrect", "PASSWORD_MISMATCH");
    user.passwordHash = await bcrypt.hash(newPassword, 12);
    user.refreshTokenVersion += 1;
    await user.save();
    await redis.del(`session:${user._id}:${user.refreshTokenVersion - 1}`);
}
