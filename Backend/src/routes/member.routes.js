import express from "express";
import {
  createMember,
  getMembers,
} from "../controllers/members.controller.js";

const router = express.Router();

router.post("/", createMember);
router.get("/", getMembers);

export default router;