import mongoose from "mongoose";

class CartDL {
    static cartItemSchema = new mongoose.Schema({
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true, min: 1 }
    });
    static CartItem = mongoose.model("CartItem", CartDL.cartItemSchema); // creates "cartitems" collection

    //get cart items by user ID and the total sum of the cart price
    static async getCartByUserId(userId) {
        let cartItems = await CartDL.CartItem.find({ userId });
        let totalPrice = 0;
        for (let item of cartItems) {
            const product = await mongoose.model('Product').findById(item.productId);
            totalPrice += product.price * item.quantity;
        }
        return { cartItems, totalPrice };
    }

    // update cart - gets a user Id and an array of items (productId and quantity)
    static async updateCart(userId, items) {
        // First, remove existing cart items for the user
        await CartDL.deleteCartByUserId(userId);
        // Then, add the new items to the cart
        const cartItems = items.map(item => ({
            userId,
            productId: item.productId,
            quantity: item.quantity
        }));
        return await CartDL.CartItem.insertMany(cartItems);
    }

    //delete cart by user ID
    static async deleteCartByUserId(userId) {
        return await CartDL.CartItem.deleteMany({ userId });
    }
}

export default CartDL;