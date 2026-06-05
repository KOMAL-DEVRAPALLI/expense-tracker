import express from "express";
import { generatePdfReport } from "../controllers/report.controller.js";

const router = express.Router();

router.get("/pdf", generatePdfReport);

export default router;