// routes/order.routes.js
import express from "express";
import OrderBL from "../bl/OrderBL.js";
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



export default router;
