import productDL from "../DL/product.Dl.js";
import mongoose from "mongoose";
import connectDB from "../DL/connection.Dl.js";

await connectDB();

/**
 * Local images live in:
 * server/public/product_images/
 *
 * imageUrl is stored as RELATIVE PATH
 */
const sampleProducts = [
  {
    name: "Hydrating Face Cream",
    description: "A rich moisturizing cream for all skin types",
    price: 45.99,
    category: "Skincare",
    imageUrl: "product_images/cream.png",
    inStock: 50,
  },
  {
    name: "Matte Lipstick - Ruby Red",
    description: "Long-lasting matte finish lipstick",
    price: 22.5,
    category: "Makeup",
    imageUrl: "product_images/lipstick.png",
    inStock: 100,
  },
  {
    name: "Vitamin C Serum",
    description: "Brightening serum with 20% vitamin C",
    price: 65.0,
    category: "Skincare",
    imageUrl: "product_images/serum.jpg",
    inStock: 30,
  },
  {
    name: "Mascara - Volume Boost",
    description: "Waterproof volumizing mascara",
    price: 28.99,
    category: "Makeup",
    imageUrl: "product_images/mascara.jpg",
    inStock: 75,
  },
  {
    name: "Eyeshadow Palette - Nude Collection",
    description: "12 versatile nude shades",
    price: 55.0,
    category: "Makeup",
    imageUrl: "product_images/palette.png",
    inStock: 40,
  },
];

async function seedProducts() {
  try {
    console.log("🧹 Clearing existing products...");
    const removed = await productDL.Product.deleteMany({});
    console.log(`Removed ${removed.deletedCount} products`);

    console.log("➕ Adding products...");
    for (const product of sampleProducts) {
      await productDL.createProduct(product);
      console.log(`Added: ${product.name}`);
    }

    console.log("✅ Seeding finished successfully");
  } catch (error) {
    console.error("❌ Error seeding products:", error);
  } finally {
    await mongoose.connection.close();
  }
}

seedProducts();
