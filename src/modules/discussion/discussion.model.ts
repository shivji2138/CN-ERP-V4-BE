import { model, Schema } from "mongoose";
import { auditFields, schemaOptions } from "../common/base.schema.js";

const messageSchema = new Schema(
  {
    senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    body: { type: String, required: true },
    attachments: [{ name: String, url: String, size: Number }],
    createdAt: { type: Date, default: Date.now }
  },
  { _id: true }
);

const discussionSchema = new Schema(
  {
    title: { type: String, required: true },
    type: { type: String, enum: ["team", "project"], required: true, index: true },
    departmentId: { type: Schema.Types.ObjectId, ref: "Department", index: true },
    projectId: { type: Schema.Types.ObjectId, ref: "Project", index: true },
    participantIds: [{ type: Schema.Types.ObjectId, ref: "User", index: true }],
    messages: [messageSchema],
    ...auditFields
  },
  schemaOptions
);

discussionSchema.index({ title: "text", "messages.body": "text" });
export const Discussion = model<any>("Discussion", discussionSchema);
