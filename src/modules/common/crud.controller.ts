import type { Model } from "mongoose";
import type { RequestHandler } from "express";
import { asyncHandler } from "../../utils/async-handler.js";
import { AppError } from "../../utils/errors.js";
import { paginate } from "../../utils/pagination.js";
import { AuditLog } from "../audit/audit.model.js";

export function createCrudController(model: Model<any>, resource: string) {
  const list: RequestHandler = asyncHandler(async (req, res) => {
    const search = String(req.query.search ?? "");
    const filter: Record<string, unknown> = { isDeleted: false };
    if (search) filter.$text = { $search: search };
    const data = await paginate(model, filter, req.query);
    res.json({ success: true, data });
  });

  const getById: RequestHandler = asyncHandler(async (req, res) => {
    const item = await model.findOne({ _id: req.params.id, isDeleted: false }).lean();
    if (!item) throw new AppError(404, `${resource} not found`, "NOT_FOUND");
    res.json({ success: true, data: item });
  });

  const create: RequestHandler = asyncHandler(async (req, res) => {
    const item = await model.create({ ...req.body, createdBy: req.user?.id, updatedBy: req.user?.id });
    await AuditLog.create({ actorId: req.user?.id, action: `${resource}.create`, entity: resource, entityId: item._id, ip: req.ip });
    res.status(201).json({ success: true, data: item });
  });

  const update: RequestHandler = asyncHandler(async (req, res) => {
    const item = await model.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { ...req.body, updatedBy: req.user?.id },
      { new: true, runValidators: true }
    );
    if (!item) throw new AppError(404, `${resource} not found`, "NOT_FOUND");
    await AuditLog.create({ actorId: req.user?.id, action: `${resource}.update`, entity: resource, entityId: item._id, ip: req.ip });
    res.json({ success: true, data: item });
  });

  const remove: RequestHandler = asyncHandler(async (req, res) => {
    const item = await model.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { isDeleted: true, updatedBy: req.user?.id },
      { new: true }
    );
    if (!item) throw new AppError(404, `${resource} not found`, "NOT_FOUND");
    await AuditLog.create({ actorId: req.user?.id, action: `${resource}.delete`, entity: resource, entityId: item._id, ip: req.ip });
    res.json({ success: true, data: { id: req.params.id } });
  });

  return { list, getById, create, update, remove };
}
