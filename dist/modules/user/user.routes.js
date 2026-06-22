import bcrypt from "bcryptjs";
import { Router } from "express";
import { requireAuth, requirePermission } from "../../middleware/auth.middleware.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { AppError } from "../../utils/errors.js";
import { paginate } from "../../utils/pagination.js";
import { User } from "./user.model.js";
const router = Router();
router.use(requireAuth);
router.get("/", requirePermission("employee:read"), asyncHandler(async (req, res) => {
    const filter = { isDeleted: false };
    if (req.query.departmentId)
        filter.departmentId = req.query.departmentId;
    if (req.query.role)
        filter.role = req.query.role;
    if (req.query.status)
        filter.status = req.query.status;
    if (req.query.search)
        filter.$text = { $search: String(req.query.search) };
    const data = await paginate(User, filter, req.query, { passwordHash: 0 });
    res.json({ success: true, data });
}));
router.get("/export", requirePermission("employee:bulk"), asyncHandler(async (_req, res) => {
    const users = await User.find({ isDeleted: false }).select("-passwordHash").lean();
    const header = ["Employee Code", "First Name", "Last Name", "Email", "Role", "Status"];
    const rows = users.map((user) => [user.employeeCode, user.firstName, user.lastName, user.email, user.role, user.status]);
    const csv = [header, ...rows].map((row) => row.map((cell) => `"${String(cell ?? "").replaceAll("\"", "\"\"")}"`).join(",")).join("\n");
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=employees.csv");
    res.send(csv);
}));
router.post("/bulk", requirePermission("employee:bulk"), asyncHandler(async (req, res) => {
    if (!Array.isArray(req.body.employees))
        throw new AppError(400, "employees must be an array", "VALIDATION_ERROR");
    const records = await Promise.all(req.body.employees.map(async (employee) => ({
        ...employee,
        passwordHash: await bcrypt.hash(employee.password ?? "ChangeMe123!", 12),
        panel: employee.panel ?? "user",
        status: employee.status ?? "active",
        createdBy: req.user?.id,
        updatedBy: req.user?.id
    })));
    const result = await User.insertMany(records, { ordered: false });
    res.status(201).json({ success: true, data: { inserted: result.length } });
}));
router.post("/", requirePermission("employee:create"), asyncHandler(async (req, res) => {
    const passwordHash = await bcrypt.hash(req.body.password ?? "ChangeMe123!", 12);
    const user = await User.create({ ...req.body, passwordHash, createdBy: req.user?.id, updatedBy: req.user?.id });
    const safe = user.toObject();
    delete safe.passwordHash;
    res.status(201).json({ success: true, data: safe });
}));
router.get("/:id", requirePermission("employee:read"), asyncHandler(async (req, res) => {
    const user = await User.findOne({ _id: req.params.id, isDeleted: false }).select("-passwordHash").lean();
    if (!user)
        throw new AppError(404, "Employee not found", "NOT_FOUND");
    res.json({ success: true, data: user });
}));
router.patch("/:id", requirePermission("employee:update"), asyncHandler(async (req, res) => {
    const patch = { ...req.body, updatedBy: req.user?.id };
    delete patch.password;
    const user = await User.findOneAndUpdate({ _id: req.params.id, isDeleted: false }, patch, { new: true, runValidators: true }).select("-passwordHash");
    res.json({ success: true, data: user });
}));
router.delete("/:id", requirePermission("employee:delete"), asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(req.params.id, { isDeleted: true, updatedBy: req.user?.id });
    res.json({ success: true });
}));
export default router;
