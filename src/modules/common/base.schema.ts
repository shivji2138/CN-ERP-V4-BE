import { Schema, type SchemaDefinition, type SchemaOptions } from "mongoose";

export const auditFields: SchemaDefinition = {
  createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
  isDeleted: { type: Boolean, default: false, index: true }
};

export const schemaOptions: SchemaOptions = {
  timestamps: true,
  versionKey: false,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
};
