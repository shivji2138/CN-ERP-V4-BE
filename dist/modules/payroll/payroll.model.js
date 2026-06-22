import { model, Schema } from "mongoose";
import { auditFields, schemaOptions } from "../common/base.schema.js";
const payrollSchema = new Schema({
    employeeId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    month: { type: Number, min: 1, max: 12, required: true },
    year: { type: Number, required: true, index: true },
    basic: { type: Number, required: true },
    hra: { type: Number, default: 0 },
    allowances: { type: Number, default: 0 },
    deductions: { type: Number, default: 0 },
    netPay: { type: Number, required: true },
    status: { type: String, enum: ["draft", "processed", "paid"], default: "draft", index: true },
    paidAt: Date,
    ...auditFields
}, schemaOptions);
payrollSchema.index({ employeeId: 1, month: 1, year: 1 }, { unique: true });
export const Payroll = model("Payroll", payrollSchema);
