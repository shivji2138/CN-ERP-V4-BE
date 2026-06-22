import { model, Schema } from "mongoose";
import { auditFields, schemaOptions } from "../common/base.schema.js";
const salarySchema = new Schema({
    basic: { type: Number, default: 0 },
    hra: { type: Number, default: 0 },
    allowances: { type: Number, default: 0 },
    deductions: { type: Number, default: 0 }
}, { _id: false });
const userSchema = new Schema({
    employeeCode: { type: String, uppercase: true, trim: true, sparse: true, index: true },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true, unique: true },
    phone: String,
    avatarUrl: String,
    passwordHash: { type: String, required: true, select: false },
    panel: { type: String, enum: ["super_admin", "admin", "user"], required: true, index: true },
    role: { type: String, enum: ["super_admin", "admin", "hr", "manager", "employee", "intern"], required: true, index: true },
    roleId: { type: Schema.Types.ObjectId, ref: "Role", index: true },
    departmentId: { type: Schema.Types.ObjectId, ref: "Department", index: true },
    managerId: { type: Schema.Types.ObjectId, ref: "User", index: true },
    designation: String,
    joiningDate: Date,
    status: { type: String, enum: ["active", "inactive", "suspended"], default: "active", index: true },
    salary: salarySchema,
    lastLoginAt: Date,
    refreshTokenVersion: { type: Number, default: 0 },
    ...auditFields
}, schemaOptions);
userSchema.index({ firstName: "text", lastName: "text", email: "text", employeeCode: "text" });
userSchema.index({ departmentId: 1, status: 1, isDeleted: 1 });
export const User = model("User", userSchema);
