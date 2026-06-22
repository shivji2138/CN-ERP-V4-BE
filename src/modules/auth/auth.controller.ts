import { asyncHandler } from "../../utils/async-handler.js";
import { Role } from "../role/role.model.js";
import { User } from "../user/user.model.js";
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
  const user = (await User.findById(req.user?.id).select("-passwordHash").lean()) as any;
  const role = (user?.roleId ? await Role.findById(user.roleId).lean() : await Role.findOne({ slug: user?.role }).lean()) as any;
  res.json({
    success: true,
    data: {
      id: String(user?._id ?? req.user?.id),
      email: user?.email,
      firstName: user?.firstName,
      lastName: user?.lastName,
      panel: user?.panel ?? req.user?.panel,
      role: user?.role ?? req.user?.role,
      permissions: user?.role === "super_admin" ? ["*"] : role?.permissions ?? req.user?.permissions ?? []
    }
  });
});

export const changePassword = asyncHandler(async (req, res) => {
  await authService.changePassword(req.user!.id, req.body.currentPassword, req.body.newPassword);
  res.json({ success: true });
});
