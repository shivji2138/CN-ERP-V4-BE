import { Router } from "express";
import { requireAuth, requirePermission } from "../../middleware/auth.middleware.js";
import { summary } from "./dashboard.controller.js";

const router = Router();
router.get("/summary", requireAuth, requirePermission("dashboard:read"), summary);
export default router;
