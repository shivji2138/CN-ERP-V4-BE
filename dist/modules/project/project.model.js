import { model, Schema } from "mongoose";
import { auditFields, schemaOptions } from "../common/base.schema.js";
const milestoneSchema = new Schema({
    title: String,
    dueDate: Date,
    status: { type: String, enum: ["pending", "completed"], default: "pending" }
}, { _id: true });
const projectSchema = new Schema({
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, uppercase: true, trim: true, unique: true },
    description: String,
    managerId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    memberIds: [{ type: Schema.Types.ObjectId, ref: "User", index: true }],
    startDate: Date,
    deadline: { type: Date, index: true },
    progress: { type: Number, min: 0, max: 100, default: 0 },
    status: { type: String, enum: ["planned", "active", "on_hold", "completed", "cancelled"], default: "planned", index: true },
    milestones: [milestoneSchema],
    ...auditFields
}, schemaOptions);
projectSchema.index({ name: "text", code: "text", description: "text" });
projectSchema.index({ status: 1, deadline: 1, isDeleted: 1 });
export const Project = model("Project", projectSchema);
