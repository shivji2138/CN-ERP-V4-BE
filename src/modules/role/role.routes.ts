import { Router } from "express";
import { requireAuth, requirePermission } from "../../middleware/auth.middleware.js";
import { createCrudController } from "../common/crud.controller.js";
import { crudRoutes } from "../common/crud.routes.js";
import { PERMISSIONS, Role } from "./role.model.js";

const router = Router();
router.get("/permissions", requireAuth, requirePermission("role:read"), (_req, res) => {
  res.json({ success: true, data: PERMISSIONS });
});
router.use("/", crudRoutes("role", createCrudController(Role, "role")));

export default router;
