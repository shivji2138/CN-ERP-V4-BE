import { model, Schema } from "mongoose";
import { auditFields, schemaOptions } from "../common/base.schema.js";

export const PERMISSIONS = [
  "department:create", "department:read", "department:update", "department:delete",
  "role:create", "role:read", "role:update", "role:delete",
  "employee:create", "employee:read", "employee:update", "employee:delete", "employee:bulk",
  "project:create", "project:read", "project:update", "project:delete",
  "task:create", "task:read", "task:update", "task:delete",
  "report:create", "report:read", "report:export",
  "announcement:create", "announcement:read", "announcement:update", "announcement:delete",
  "discussion:create", "discussion:read", "discussion:update", "discussion:delete",
  "leave:create", "leave:read", "leave:update", "leave:approve",
  "payroll:create", "payroll:read", "payroll:update", "payroll:export",
  "event:create", "event:read", "event:update", "event:delete",
  "ticket:create", "ticket:read", "ticket:update", "ticket:assign",
  "notification:read", "dashboard:read"
] as const;

const roleSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, lowercase: true, trim: true, unique: true },
    description: String,
    permissions: [{ type: String, enum: PERMISSIONS }],
    ...auditFields
  },
  schemaOptions
);

roleSchema.index({ name: "text", slug: "text" });

export const Role = model<any>("Role", roleSchema);
