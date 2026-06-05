import express from "express";
import { getSummary } from "../controllers/summary.controller.js";

const router = express.Router();

router.get("/", getSummary);

export default router;