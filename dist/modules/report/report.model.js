import { model, Schema } from "mongoose";
import { auditFields, schemaOptions } from "../common/base.schema.js";
const reportSchema = new Schema({
    title: { type: String, required: true },
    type: { type: String, enum: ["weekly", "monthly", "employee", "team", "project"], required: true, index: true },
    employeeId: { type: Schema.Types.ObjectId, ref: "User", index: true },
    teamId: { type: Schema.Types.ObjectId, ref: "Department", index: true },
    projectId: { type: Schema.Types.ObjectId, ref: "Project", index: true },
    periodStart: Date,
    periodEnd: Date,
    metrics: Schema.Types.Mixed,
    notes: String,
    ...auditFields
}, schemaOptions);
reportSchema.index({ title: "text", notes: "text" });
export const Report = model("Report", reportSchema);
