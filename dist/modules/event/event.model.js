import { model, Schema } from "mongoose";
import { auditFields, schemaOptions } from "../common/base.schema.js";
const eventSchema = new Schema({
    title: { type: String, required: true },
    description: String,
    location: String,
    startAt: { type: Date, required: true, index: true },
    endAt: Date,
    attendeeIds: [{ type: Schema.Types.ObjectId, ref: "User" }],
    ...auditFields
}, schemaOptions);
eventSchema.index({ title: "text", description: "text", location: "text" });
export const Event = model("Event", eventSchema);
