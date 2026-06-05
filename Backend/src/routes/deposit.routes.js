import express from "express";
import {
  getDeposits,createDeposit
} from "../controllers/deposit.controller.js";

const router = express.Router();

router.post("/", createDeposit);
router.get("/", getDeposits);

export default router;