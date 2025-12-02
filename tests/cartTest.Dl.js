//test for cart
//add a user for the testing, create a cart using existing items from addSampleProducts.js
//then get the cart, update the cart - remove some items, add some new ones and change amount of existing ones
//then get cart again and delete user and his cart
import UserDL from '../DL/user.Dl.js';
import CartDL from '../DL/cart.Dl.js';
import productDL from '../DL/product.Dl.js';
import connectDB from '../DL/connection.Dl.js';
import mongoose from 'mongoose';
await connectDB();
async function testCartDL() {
    // Create a new user for testing
    const testUser = await UserDL.createUser({
        name: 'Test User',
        email: 'testuser@example.com',
        phone: '555-555-5555',
        address: '999 Test St, Testville, USA'
    }, 'testHash', 'testSalt');
    console.log('Created Test User:', testUser);
    const userId = testUser._id;

    // Get some existing products to add to the cart
    const products = await productDL.getAllProducts();
    if (products.length < 3) {
        console.error('Not enough products in the database to perform the test.');
        return;
    }
    // Create initial cart items
    const initialCartItems = [
        { productId: products[0]._id, quantity: 2 },
        { productId: products[1]._id, quantity: 1 },
        { productId: products[2]._id, quantity: 3 }
    ];
    await CartDL.updateCart(userId, initialCartItems);
    console.log('Initial cart created.');
    // Get the cart and total price
    let cart = await CartDL.getCartByUserId(userId);
    console.log('Cart after initial creation:', cart);
    // Update the cart - remove one item, change quantity of another, add a new item
    const updatedCartItems = [
        { productId: products[0]._id, quantity: 1 }, // changed quantity
        // removed products[1]
        { productId: products[2]._id, quantity: 2 }, // changed quantity
        { productId: products[3]._id, quantity: 4 }  // new item
    ];
    await CartDL.updateCart(userId, updatedCartItems);
    console.log('Cart updated.');
    // Get the updated cart and total price
    cart = await CartDL.getCartByUserId(userId);
    console.log('Cart after update:', cart);
    // Delete the user and their cart
    await CartDL.deleteCartByUserId(userId);
    await UserDL.removeUser(userId);
    console.log('Test user and their cart deleted.');
}

testCartDL().then(() => {
    console.log('CartDL test completed.');
    mongoose.connection.close();
}).catch(error => {
    console.error('Error during CartDL test:', error);
    mongoose.connection.close();
});