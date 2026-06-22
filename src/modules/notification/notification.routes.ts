import { Router } from "express";
import { requireAuth, requirePermission } from "../../middleware/auth.middleware.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { Notification } from "./notification.model.js";

const router = Router();
router.get(
  "/",
  requireAuth,
  requirePermission("notification:read"),
  asyncHandler(async (req, res) => {
    const items = await Notification.find({ userId: req.user?.id }).sort({ createdAt: -1 }).limit(50).lean();
    res.json({ success: true, data: items });
  })
);
router.patch(
  "/:id/read",
  requireAuth,
  requirePermission("notification:read"),
  asyncHandler(async (req, res) => {
    const item = await Notification.findOneAndUpdate({ _id: req.params.id, userId: req.user?.id }, { readAt: new Date() }, { new: true });
    res.json({ success: true, data: item });
  })
);
export default router;
