import type { Types } from "mongoose";

type AuthUser = {
  id: string;
  roleId?: Types.ObjectId | string;
  panel: "super_admin" | "admin" | "user";
  role: "super_admin" | "admin" | "hr" | "manager" | "employee" | "intern";
  permissions: string[];
  departmentId?: Types.ObjectId | string;
};

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
      requestId?: string;
    }
  }
}

export {};
