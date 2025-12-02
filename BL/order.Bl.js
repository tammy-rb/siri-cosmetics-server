// bl/OrderBL.js
import OrderDL from "../dl/OrderDL.js";

class OrderBL {
  static async createOrder({ userId, items, billingDetails }) {
    if (!items || !items.length) {
      throw new Error("Cart is empty");
    }

    // מחשבים סכום בצד שרת – לא סומכים על הלקוח
    const totalAmount = items.reduce((sum, it) => {
      const price = it.product?.price ?? it.price ?? 0;
      const quantity = it.quantity ?? 1;
      return sum + price * quantity;
    }, 0);

    const normalizedItems = items.map((it) => ({
      productId: it.product?._id || it.productId || null,
      name: it.product?.name || it.name || "",
      price: it.product?.price ?? it.price ?? 0,
      quantity: it.quantity ?? 1,
    }));

    const order = await OrderDL.createOrder({
      userId: userId || null,
      items: normalizedItems,
      totalAmount,
      billingDetails,
      paymentMethod: "paypal",
      paymentStatus: "pending",
    });

    return order;
  }

  static async getUserOrders(userId) {
    return await OrderDL.getOrdersByUser(userId);
  }
}

export default OrderBL;
