import express from "express";
import { adminDashBoard } from "../controllers/dashboard.controller.js";
import { authenticate, authorize } from "../middlewares/auth.js";

const router = express.Router();

router.get("/dashboard", authenticate, authorize("Admin"), adminDashBoard)

export default router;