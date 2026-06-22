import { model, Schema } from "mongoose";
import { auditFields, schemaOptions } from "../common/base.schema.js";

const departmentSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    code: { type: String, required: true, uppercase: true, trim: true, unique: true },
    description: String,
    managerId: { type: Schema.Types.ObjectId, ref: "User", index: true },
    ...auditFields
  },
  schemaOptions
);

departmentSchema.index({ name: "text", code: "text" });

export const Department = model<any>("Department", departmentSchema);
