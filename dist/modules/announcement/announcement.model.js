import { model, Schema } from "mongoose";
import { auditFields, schemaOptions } from "../common/base.schema.js";
const announcementSchema = new Schema({
    title: { type: String, required: true },
    body: { type: String, required: true },
    scope: { type: String, enum: ["company", "department"], default: "company", index: true },
    departmentId: { type: Schema.Types.ObjectId, ref: "Department", index: true },
    publishAt: { type: Date, default: Date.now, index: true },
    expiresAt: Date,
    ...auditFields
}, schemaOptions);
announcementSchema.index({ title: "text", body: "text" });
export const Announcement = model("Announcement", announcementSchema);
