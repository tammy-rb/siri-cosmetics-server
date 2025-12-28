// routes/order.routes.js
import mongoose from "mongoose";
import express from "express";
import OrderBL from "../BL/order.Bl.js";
<<<<<<< HEAD
import CartBL from "../BL/cart.Bl.js";
=======
>>>>>>> 6966bfa4d58a0e26066b569417c92df8660ccf95
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

<<<<<<< HEAD
/**
 * GET /api/orders/my
 * הזמנות של המשתמש המחובר
 */
router.get("/my", authMiddleware, async (req, res, next) => {
  try {
    const orders = await OrderBL.getMyOrders(req.userId);
    res.json({ count: orders.length, data: orders });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/orders/by-date?date=YYYY-MM-DD
 * (למנהל/דוחות - אפשר לשמור מוגן)
 */
router.get("/by-date", authMiddleware, async (req, res, next) => {
  try {
    const { date } = req.query;
    const orders = await OrderBL.getOrdersByDate(date);
    res.json({ date, count: orders.length, data: orders });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/orders/:id
 */
router.get("/:id", authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid order id" });
    }

    const order = await OrderBL.getOrderById(id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json(order);
  } catch (err) {
    next(err);
  }
});



/**
 * GET /api/orders
 * כל ההזמנות (בפיתוח / אדמין)
 */
router.get("/", authMiddleware, async (req, res, next) => {
  try {
    const orders = await OrderBL.getAllOrders();
    res.json({ count: orders.length, data: orders });
  } catch (err) {
=======
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
>>>>>>> 6966bfa4d58a0e26066b569417c92df8660ccf95
    next(err);
  }
});

<<<<<<< HEAD



=======
>>>>>>> 6966bfa4d58a0e26066b569417c92df8660ccf95


export default router;
