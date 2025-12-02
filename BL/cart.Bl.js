import CartDL from "../DL/cart.Dl.js";

class CartBL {
  // Get cart for a user
  static async getCart(req, res) {
    try {
      const userId = req.params.userId || req.body.userId || (req.user && req.user.id);

      if (!userId) {
        return res.status(400).json({ message: "userId is required" });
      }

      const { cartItems, totalPrice } = await CartDL.getCartByUserId(userId);

      return res.status(200).json({
        message: "Get cart successfully",
        endpoint: `GET /api/cart/${userId}`,
        count: cartItems.length,
        totalPrice,
        data: cartItems,
      });
    } catch (err) {
      console.error("Get cart error:", err);
      return res.status(500).json({
        message: "Error while getting cart",
        endpoint: "GET /api/cart/:userId",
        error: err.message,
      });
    }
  }

  // Replace the whole cart for a user (items = [{ productId, quantity }])
  static async replaceCart(req, res) {
    try {
      const userId = req.params.userId || req.body.userId || (req.user && req.user.id);
      const items = req.body.items;

      if (!userId) {
        return res.status(400).json({ message: "userId is required" });
      }

      if (!Array.isArray(items)) {
        return res.status(400).json({ message: "items must be an array" });
      }

      const normalized = items.map((it) => {
        const productId = it.productId || it.product || null;
        const quantity = Number(it.quantity) || 0;
        return { productId, quantity };
      }).filter(i => i.productId && i.quantity > 0);

      await CartDL.updateCart(userId, normalized);

      const updated = await CartDL.getCartByUserId(userId);

      return res.status(200).json({
        message: "Cart replaced successfully",
        count: updated.cartItems.length,
        totalPrice: updated.totalPrice,
        data: updated.cartItems,
      });
    } catch (err) {
      console.error("Replace cart error:", err);
      return res.status(500).json({
        message: "Error while replacing cart",
        endpoint: "PUT /api/cart/:userId",
        error: err.message,
      });
    }
  }

  // Clear entire cart for a user
  static async clearCart(req, res) {
    try {
      const userId = req.params.userId || req.body.userId || (req.user && req.user.id);

      if (!userId) {
        return res.status(400).json({ message: "userId is required" });
      }

      await CartDL.deleteCartByUserId(userId);

      return res.status(200).json({ message: "Cart cleared" });
    } catch (err) {
      console.error("Clear cart error:", err);
      return res.status(500).json({
        message: "Error while clearing cart",
        endpoint: "DELETE /api/cart/:userId",
        error: err.message,
      });
    }
  }
}

export default CartBL;
