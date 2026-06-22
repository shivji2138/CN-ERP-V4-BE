import { model, Schema } from "mongoose";
import { auditFields, schemaOptions } from "../common/base.schema.js";

const leaveSchema = new Schema(
  {
    employeeId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    type: { type: String, enum: ["casual", "sick", "earned", "unpaid"], required: true },
    startDate: { type: Date, required: true, index: true },
    endDate: { type: Date, required: true },
    reason: String,
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending", index: true },
    approverId: { type: Schema.Types.ObjectId, ref: "User" },
    decisionNote: String,
    decidedAt: Date,
    ...auditFields
  },
  schemaOptions
);

leaveSchema.index({ employeeId: 1, status: 1, startDate: -1 });
export const Leave = model<any>("Leave", leaveSchema);
