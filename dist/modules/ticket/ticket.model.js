import { model, Schema } from "mongoose";
import { auditFields, schemaOptions } from "../common/base.schema.js";
const ticketSchema = new Schema({
    subject: { type: String, required: true },
    description: { type: String, required: true },
    requesterId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    assigneeId: { type: Schema.Types.ObjectId, ref: "User", index: true },
    priority: { type: String, enum: ["low", "medium", "high", "urgent"], default: "medium", index: true },
    status: { type: String, enum: ["open", "assigned", "resolved", "closed"], default: "open", index: true },
    resolution: String,
    attachments: [{ name: String, url: String, size: Number }],
    resolvedAt: Date,
    ...auditFields
}, schemaOptions);
ticketSchema.index({ subject: "text", description: "text" });
export const Ticket = model("Ticket", ticketSchema);
