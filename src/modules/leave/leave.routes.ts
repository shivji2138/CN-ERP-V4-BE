import { Router } from "express";
import { requireAuth, requirePermission } from "../../middleware/auth.middleware.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { createCrudController } from "../common/crud.controller.js";
import { crudRoutes } from "../common/crud.routes.js";
import { Leave } from "./leave.model.js";

const controller = createCrudController(Leave, "leave");
const router = Router();
router.post(
  "/",
  requireAuth,
  requirePermission("leave:create"),
  asyncHandler(async (req, res) => {
    const leave = await Leave.create({
      ...req.body,
      employeeId: req.user?.panel === "user" ? req.user.id : req.body.employeeId ?? req.user?.id,
      createdBy: req.user?.id,
      updatedBy: req.user?.id
    });
    res.status(201).json({ success: true, data: leave });
  })
);
router.patch(
  "/:id/decision",
  requireAuth,
  requirePermission("leave:approve"),
  asyncHandler(async (req, res) => {
    const leave = await Leave.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status, decisionNote: req.body.decisionNote, approverId: req.user?.id, decidedAt: new Date() },
      { new: true, runValidators: true }
    );
    res.json({ success: true, data: leave });
  })
);
router.use("/", crudRoutes("leave", controller));
export default router;
