import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },

    items: { type: [orderItemSchema], required: true },

    totalAmount: { type: Number, required: true },

    billingDetails: {
      name: String,
      email: String,
      address: String,
    },

    payment: {
      method: String,
      status: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },
      transactionId: String, // מזהה עסקה מהספק (אם יש)
      last4: String       // אופציונלי אם את מקבלת מהספק
    },
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

  
  static async getAllOrders(filters = {}) {
    return await Order.find(filters).sort({ createdAt: -1 });
  }

  static async getOrderById(id) {
    return await Order.findById(id);
  }

  static async getOrdersByDate(dateObj) {
    const start = new Date(dateObj);
    start.setHours(0, 0, 0, 0);
    const end = new Date(dateObj);
    end.setHours(23, 59, 59, 999);

    return await Order.find({ createdAt: { $gte: start, $lte: end } }).sort({ createdAt: -1 });
  }
}

export default OrderDL;
