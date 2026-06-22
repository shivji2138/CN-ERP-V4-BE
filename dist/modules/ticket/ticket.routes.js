import { Router } from "express";
import { requireAuth, requirePermission } from "../../middleware/auth.middleware.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { createCrudController } from "../common/crud.controller.js";
import { crudRoutes } from "../common/crud.routes.js";
import { Ticket } from "./ticket.model.js";
const router = Router();
router.patch("/:id/assign", requireAuth, requirePermission("ticket:assign"), asyncHandler(async (req, res) => {
    const ticket = await Ticket.findByIdAndUpdate(req.params.id, { assigneeId: req.body.assigneeId, status: "assigned", updatedBy: req.user?.id }, { new: true, runValidators: true });
    res.json({ success: true, data: ticket });
}));
router.patch("/:id/resolve", requireAuth, requirePermission("ticket:update"), asyncHandler(async (req, res) => {
    const ticket = await Ticket.findByIdAndUpdate(req.params.id, { status: "resolved", resolution: req.body.resolution, resolvedAt: new Date(), updatedBy: req.user?.id }, { new: true, runValidators: true });
    res.json({ success: true, data: ticket });
}));
router.use("/", crudRoutes("ticket", createCrudController(Ticket, "ticket")));
export default router;
