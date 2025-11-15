// Data Layer for Product operations
// This will contain database operations and data access logic
import mongoose from "mongoose";

class ProductDL {

    static productSchema = new mongoose.Schema({
        name: { type: String, required: true },
        price: { type: Number, required: true },
        description: String,
        imageUrl: String,
        inStock: { type: Number, default: 0 }
    }, { timestamps: true });

    static Product = mongoose.model("Product", ProductDL.productSchema); // creates "products" collection


    // Create a new product in database
    static async createProduct(productData) {
        const product = new ProductDL.Product(productData);
        return await product.save();
    }

    // Get a single product by ID from database
    static async getProductById(id) {
        return await ProductDL.Product.findById(id);
    }

    // Get all products from database with optional filters
    static async getAllProducts(filters = {}) {
        return await ProductDL.Product.find(filters);
    }

    // Update an existing product in database
    static async updateProduct(id, updateData) {
        return await ProductDL.Product.findByIdAndUpdate(id, updateData, { new: true });
    }

    // Remove a product from database
    static async removeProduct(id) {
        return await ProductDL.Product.findByIdAndDelete(id);
    }
    
}

export default ProductDL;