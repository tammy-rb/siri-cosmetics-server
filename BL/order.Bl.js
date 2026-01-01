// bl/OrderBL.js
import CartDL from "../DL/cart.Dl.js";
import OrderDL from "../DL/order.Dl.js";
import ProductDL from "../DL/product.Dl.js";
import CartBL from "./cart.Bl.js";

class OrderBL {
  static async createOrder({ userId, items, billingDetails, payment }) {
  if (!items || !items.length) {
    throw new Error("Cart is empty");
  }

 let totalAmount = 0;
 let productItems = []; 
  for (const item of items) {
    totalAmount += item.product.price * item.quantity;
    productItems.push({
      productId: item.product._id,
      name: item.product.name,
      quantity: item.quantity,
      price: item.product.price,
    });
  }

  // ✅ חיתוך 4 ספרות אחרונות בלבד
  let cardLast4 = null;
  console.log("Payment details received in BL:", payment, "cardNumber:", payment?.cardNumber);
  if (payment?.cardNumber) {
    const cardStr = String(payment.cardNumber).replace(/\s+/g, "");
    cardLast4 = cardStr.slice(-4);
  }
  

  const order = await OrderDL.createOrder({
  userId,
  items: productItems,
  totalAmount,
  billingDetails,
  payment: {
    method: payment?.method || "credit_card",
    status: "paid",
    transactionId: payment?.transactionId || payment?.paymentRef || null,
    last4: cardLast4, // חובה לפי הסכמה
  },
});

  return order;
}


  static async getAllOrders(filters = {}) {
    return await OrderDL.getAllOrders(filters);
  }

  static async getOrderById(id) {
    return await OrderDL.getOrderById(id);
  }

  static async getOrdersByDate(dateString) {
    const d = new Date(`${dateString}T00:00:00`);
    if (isNaN(d.getTime())) throw new Error("Invalid date format (YYYY-MM-DD)");
    return await OrderDL.getOrdersByDate(d);
  }

  static async getMyOrders(userId) {
    return await OrderDL.getOrdersByUser(userId);
  }
}

export default OrderBL;
