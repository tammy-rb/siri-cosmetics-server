import express from "express";
import CartBL from "../BL/cart.Bl.js";

const router = express.Router();

// Get cart for a user
router.get("/:userId", CartBL.getCart);

// Replace entire cart for a user (body: { items: [{ productId, quantity }] })
router.put("/:userId", CartBL.replaceCart);

// Clear entire cart for a user
router.delete("/:userId", CartBL.clearCart);

export default router;
