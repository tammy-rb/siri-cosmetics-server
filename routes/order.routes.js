// routes/order.routes.js
import mongoose from "mongoose";
import express from "express";
import OrderBL from "../BL/order.Bl.js";
import CartBL from "../BL/cart.Bl.js";
import { authMiddleware } from "../routesmiddlewear/middleware.js"; // לפי הנתיב שלך

const router = express.Router();

// יצירת הזמנה (checkout)
router.post("/checkout", async (req, res, next) => {
  try {
    console.log("Full req.body:", JSON.stringify(req.body, null, 2));
    const { items, billingDetails, payment } = req.body;
    console.log("payment extracted:", payment);

    const order = await OrderBL.createOrder({
      userId: req.userId, // מגיע מה־authMiddleware
      items,
      billingDetails,
      payment: payment
    });

    await CartBL.clearCart(req, res);

    res.status(201).json({
      order,
      message: "Order created successfully (payment pending)",
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// קבלת הזמנות של המשתמש
router.get("/", authMiddleware, async (req, res, next) => {
  try {
    const orders = await OrderBL.getUserOrders(req.userId);

    res.status(200).json({
      message: "Orders retrieved successfully",
      count: orders.length,
      data: orders,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
});






export default router;
