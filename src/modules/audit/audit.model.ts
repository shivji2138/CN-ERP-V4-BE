import { model, Schema } from "mongoose";
import { schemaOptions } from "../common/base.schema.js";

const auditLogSchema = new Schema(
  {
    actorId: { type: Schema.Types.ObjectId, ref: "User", index: true },
    action: { type: String, required: true, index: true },
    entity: { type: String, required: true, index: true },
    entityId: { type: Schema.Types.ObjectId, index: true },
    ip: String,
    userAgent: String,
    metadata: Schema.Types.Mixed
  },
  schemaOptions
);

auditLogSchema.index({ createdAt: -1 });

export const AuditLog = model<any>("AuditLog", auditLogSchema);
