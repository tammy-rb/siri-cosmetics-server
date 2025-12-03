// dl/OrderDL.js
import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" }, // אם יש לך מודל מוצרים
   quantity: Number,
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
    items: [orderItemSchema],
    totalAmount: { type: Number, required: true },
    billingDetails: {
      name: String,
      email: String,
      address: String,
    },
    paymentMethod: { type: String, default: "paypal" },
    paymentStatus: { type: String, default: "pending" }, // pending / paid / failed
    paypalOrderId: String, // אם תרצי בעתיד לחבר ל־PayPal אמיתי
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

class OrderDL {
  static async createOrder(data) {
    const order = new Order(data);
    return await order.save();
  }

  static async getOrdersByUser(userId) {
    return await Order.find({ userId }).sort({ createdAt: -1 });
  }

  static async getOrderById(id) {
    return await Order.findById(id);
  }
}

export default OrderDL;
