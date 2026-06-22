import { model, Schema } from "mongoose";
import { schemaOptions } from "../common/base.schema.js";
const notificationSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true },
    body: { type: String, required: true },
    type: { type: String, enum: ["info", "success", "warning", "error"], default: "info" },
    readAt: Date,
    data: Schema.Types.Mixed
}, schemaOptions);
notificationSchema.index({ userId: 1, readAt: 1, createdAt: -1 });
export const Notification = model("Notification", notificationSchema);
