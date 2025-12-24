// routes/order.routes.js
import express from "express";
import OrderBL from "../BL/order.Bl.js";
import { authMiddleware } from "../routesmiddlewear/middleware.js"; // לפי הנתיב שלך

const router = express.Router();

// יצירת הזמנה (checkout)
router.post("/checkout", authMiddleware, async (req, res, next) => {
  try {
    const { items, billingDetails } = req.body;

    const order = await OrderBL.createOrder({
      userId: req.userId, // מגיע מה־authMiddleware
      items,
      billingDetails,
    });

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
