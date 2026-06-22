import PDFDocument from "pdfkit";
import { Router } from "express";
import { requireAuth, requirePermission } from "../../middleware/auth.middleware.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { createCrudController } from "../common/crud.controller.js";
import { crudRoutes } from "../common/crud.routes.js";
import { Report } from "./report.model.js";

const router = Router();
router.get(
  "/:id/export/:format",
  requireAuth,
  requirePermission("report:export"),
  asyncHandler(async (req, res) => {
    const report = (await Report.findById(req.params.id).lean()) as any;
    if (req.params.format === "csv" || req.params.format === "xlsx") {
      const rows = [
        ["Title", report?.title],
        ["Type", report?.type],
        ["Period", `${report?.periodStart ?? ""} - ${report?.periodEnd ?? ""}`],
        ["Notes", report?.notes ?? ""]
      ];
      const csv = rows.map((row) => row.map((cell) => `"${String(cell ?? "").replaceAll("\"", "\"\"")}"`).join(",")).join("\n");
      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", "attachment; filename=report.csv");
      return res.send(csv);
    }
    const doc = new PDFDocument({ margin: 50 });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=report.pdf");
    doc.pipe(res);
    doc.fontSize(20).text(report?.title ?? "Report");
    doc.moveDown().fontSize(12).text(`Type: ${report?.type ?? ""}`);
    doc.text(`Notes: ${report?.notes ?? ""}`);
    doc.end();
  })
);
router.use("/", crudRoutes("report", createCrudController(Report, "report")));
export default router;
