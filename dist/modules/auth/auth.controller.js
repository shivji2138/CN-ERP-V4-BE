import { asyncHandler } from "../../utils/async-handler.js";
import * as authService from "./auth.service.js";
export const login = asyncHandler(async (req, res) => {
    const data = await authService.login(req.body.email, req.body.password, res);
    res.json({ success: true, data });
});
export const refresh = asyncHandler(async (req, res) => {
    const data = await authService.refresh(req.cookies?.refreshToken, res);
    res.json({ success: true, data });
});
export const logout = asyncHandler(async (req, res) => {
    await authService.logout(req.user?.id, res);
    res.json({ success: true });
});
export const me = asyncHandler(async (req, res) => {
    res.json({ success: true, data: req.user });
});
export const changePassword = asyncHandler(async (req, res) => {
    await authService.changePassword(req.user.id, req.body.currentPassword, req.body.newPassword);
    res.json({ success: true });
});
