import express from "express";
import { getOrders, getUserOrders, placeOrder, updateOrderStatus } from "../controllers/order.controller.js";
import { authenticate, authorize } from "../middlewares/auth.js";

const router = express.Router();


router.post("/place-order", authenticate, placeOrder);
router.get("/user-orders/:userId", authenticate, getUserOrders);
router.get("/user-orders", authenticate, authorize("Admin"), getOrders);
router.patch("/update-status/:orderId", authenticate, authorize("Admin"), updateOrderStatus);


export default router;