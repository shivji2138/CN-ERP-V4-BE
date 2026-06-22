import { Router } from "express";
import { requireAuth, requirePermission } from "../../middleware/auth.middleware.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { createCrudController } from "../common/crud.controller.js";
import { crudRoutes } from "../common/crud.routes.js";
import { Ticket } from "./ticket.model.js";

const router = Router();
router.post(
  "/",
  requireAuth,
  requirePermission("ticket:create"),
  asyncHandler(async (req, res) => {
    const ticket = await Ticket.create({
      ...req.body,
      requesterId: req.user?.id,
      createdBy: req.user?.id,
      updatedBy: req.user?.id
    });
    res.status(201).json({ success: true, data: ticket });
  })
);
router.patch(
  "/:id/assign",
  requireAuth,
  requirePermission("ticket:assign"),
  asyncHandler(async (req, res) => {
    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      { assigneeId: req.body.assigneeId, status: "assigned", updatedBy: req.user?.id },
      { new: true, runValidators: true }
    );
    res.json({ success: true, data: ticket });
  })
);
router.patch(
  "/:id/resolve",
  requireAuth,
  requirePermission("ticket:update"),
  asyncHandler(async (req, res) => {
    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      { status: "resolved", resolution: req.body.resolution, resolvedAt: new Date(), updatedBy: req.user?.id },
      { new: true, runValidators: true }
    );
    res.json({ success: true, data: ticket });
  })
);
router.use("/", crudRoutes("ticket", createCrudController(Ticket, "ticket")));
export default router;
