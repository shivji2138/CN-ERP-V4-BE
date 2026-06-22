import { model, Schema } from "mongoose";
import { auditFields, schemaOptions } from "../common/base.schema.js";

const taskSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: String,
    projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true, index: true },
    assigneeId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    reporterId: { type: Schema.Types.ObjectId, ref: "User", index: true },
    priority: { type: String, enum: ["low", "medium", "high", "urgent"], default: "medium", index: true },
    status: { type: String, enum: ["pending", "in_progress", "review", "completed"], default: "pending", index: true },
    dueDate: { type: Date, index: true },
    attachments: [{ name: String, url: String, size: Number }],
    ...auditFields
  },
  schemaOptions
);

taskSchema.index({ title: "text", description: "text" });
taskSchema.index({ assigneeId: 1, status: 1, isDeleted: 1 });

export const Task = model<any>("Task", taskSchema);
