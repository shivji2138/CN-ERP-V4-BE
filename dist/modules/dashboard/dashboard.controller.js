import { asyncHandler } from "../../utils/async-handler.js";
import { Department } from "../department/department.model.js";
import { Leave } from "../leave/leave.model.js";
import { Project } from "../project/project.model.js";
import { Task } from "../task/task.model.js";
import { User } from "../user/user.model.js";
export const summary = asyncHandler(async (req, res) => {
    const userFilter = req.user?.panel === "user" ? { _id: req.user.id, isDeleted: false } : { isDeleted: false };
    const [employeeCount, departmentCount, activeProjects, pendingLeaves, internCount, taskStats] = await Promise.all([
        User.countDocuments({ ...userFilter, role: { $in: ["employee", "manager", "hr"] }, status: "active" }),
        Department.countDocuments({ isDeleted: false }),
        Project.countDocuments({ isDeleted: false, status: "active" }),
        Leave.countDocuments({ isDeleted: false, status: "pending" }),
        User.countDocuments({ isDeleted: false, role: "intern", status: "active" }),
        Task.aggregate([{ $match: { isDeleted: false } }, { $group: { _id: "$status", count: { $sum: 1 } } }])
    ]);
    const assignedProjects = req.user?.panel === "user"
        ? await Project.find({ isDeleted: false, memberIds: req.user.id }).select("name code progress status deadline").lean()
        : [];
    res.json({
        success: true,
        data: { employeeCount, departmentCount, activeProjects, pendingLeaves, internCount, taskStats, assignedProjects }
    });
});
