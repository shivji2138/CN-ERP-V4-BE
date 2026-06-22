import { Router } from "express";
import { z } from "zod";
import { authLimiter } from "../../middleware/security.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import { requireAuth } from "../../middleware/auth.middleware.js";
import * as controller from "./auth.controller.js";

const router = Router();

router.post(
  "/login",
  authLimiter,
  validate(z.object({ body: z.object({ email: z.string().email(), password: z.string().min(8) }) })),
  controller.login
);
router.post("/refresh", authLimiter, controller.refresh);
router.post("/logout", controller.logout);
router.get("/me", requireAuth, controller.me);
router.patch(
  "/change-password",
  requireAuth,
  validate(z.object({ body: z.object({ currentPassword: z.string().min(8), newPassword: z.string().min(8) }) })),
  controller.changePassword
);

export default router;
