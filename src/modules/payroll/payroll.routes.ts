import PDFDocument from "pdfkit";
import { Router } from "express";
import { requireAuth, requirePermission } from "../../middleware/auth.middleware.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { createCrudController } from "../common/crud.controller.js";
import { crudRoutes } from "../common/crud.routes.js";
import { Payroll } from "./payroll.model.js";

const router = Router();
router.get(
  "/:id/slip",
  requireAuth,
  requirePermission("payroll:export"),
  asyncHandler(async (req, res) => {
    const payroll = (await Payroll.findById(req.params.id).populate("employeeId", "firstName lastName employeeCode").lean()) as any;
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=salary-slip.pdf");
    const doc = new PDFDocument({ margin: 50 });
    doc.pipe(res);
    doc.fontSize(20).text("Cybernaut ERP Salary Slip");
    doc.moveDown().fontSize(12).text(`Period: ${payroll?.month}/${payroll?.year}`);
    doc.text(`Basic: ${payroll?.basic}`);
    doc.text(`HRA: ${payroll?.hra}`);
    doc.text(`Allowances: ${payroll?.allowances}`);
    doc.text(`Deductions: ${payroll?.deductions}`);
    doc.fontSize(14).text(`Net Pay: ${payroll?.netPay}`);
    doc.end();
  })
);
router.use("/", crudRoutes("payroll", createCrudController(Payroll, "payroll")));
export default router;
