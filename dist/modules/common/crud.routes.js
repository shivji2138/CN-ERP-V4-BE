import { Router } from "express";
import { requireAuth, requirePermission } from "../../middleware/auth.middleware.js";
export function crudRoutes(resource, controller) {
    const router = Router();
    router.use(requireAuth);
    router.get("/", requirePermission(`${resource}:read`), controller.list);
    router.get("/:id", requirePermission(`${resource}:read`), controller.getById);
    router.post("/", requirePermission(`${resource}:create`), controller.create);
    router.patch("/:id", requirePermission(`${resource}:update`), controller.update);
    router.delete("/:id", requirePermission(`${resource}:delete`), controller.remove);
    return router;
}
