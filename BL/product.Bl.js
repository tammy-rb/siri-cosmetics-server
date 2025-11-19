// Business Logic for Product operations
// This will contain the actual business logic implementation
import ProductDL from "../DL/product.DL.js";
class ProductBL {
  static async createProduct(req, res) {
    try {
      const { name, price, description, imageUrl, inStock } = req.body;

      if (!name || price === undefined || price === null || !description) {
        return res.status(400).json({
          message: "name, price and description are required",
        });
      }

      if (price < 0) {
        return res.status(400).json({
          message: "price must be positive",
        });
      }

      if (inStock !== undefined && inStock < 0) {
        return res.status(400).json({
          message: "inStock cannot be negative",
        });
      }

      const newProduct = await ProductDL.createProduct({
        name,
        price,
        description,
        imageUrl,
        inStock,
      });

      return res.status(201).json(newProduct);
    } catch (err) {
      console.error("Create product error:", err);
      return res.status(501).json({
        message: "Create product functionality not yet implemented",
        endpoint: "POST /api/products",
      });
    }
  }

  // Get a single product by ID
  static async getProduct(req, res) {
    try {
      const { id } = req.params;

      const product = await ProductDL.getProductById(id);
      if (!product) {
        return res.status(404).json({
          message: "Product not found",
        });
      }

      return res.json(product);
    } catch (err) {
      console.error("Get product error:", err);
      res.status(501).json({
        message: "Get product functionality not yet implemented",
        endpoint: `GET /api/products/product/${id}`,
      });
    }
  }

  // Get all products with optional filters
  static async getAllProducts(req, res) {
    try {
      const { name, category, minPrice, maxPrice } = req.query;

      const filter = {};

      // סינון לפי שם
      if (name) {
        filter.name = new RegExp(name, "i");
      }

      // סינון לפי קטגוריה
      if (category) {
        filter.category = new RegExp(category, "i");
        // או התאמה מדויקת:
        // filter.category = category;
      }

      if (minPrice || maxPrice) {
        filter.price = {};
        if (minPrice) filter.price.$gte = Number(minPrice);
        if (maxPrice) filter.price.$lte = Number(maxPrice);
      }

      const products = await ProductDL.getAllProducts(filter);

      return res.status(200).json({
        message: "Get all products successfully",
        endpoint: "GET /api/products",
        availableFilters: ["name", "category", "price_range"],
        filtersUsed: { name, category, minPrice, maxPrice },
        count: products.length,
        data: products,
      });
    } catch (err) {
      console.error("Get all products error:", err);

      return res.status(500).json({
        message: "Error while getting products",
        endpoint: "GET /api/products",
        availableFilters: ["name", "category", "price_range"],
        error: err.message,
      });
    }
  }

  // Update an existing product
  static async updateProduct(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;

      if (updates.price !== undefined && updates.price < 0) {
        return res.status(400).json({
          message: "price must be positive",
        });
      }

      if (updates.inStock !== undefined && updates.inStock < 0) {
        return res.status(400).json({
          message: "inStock cannot be negative",
        });
      }

      const updatedProduct = await ProductDL.updateProduct(id, updates);

      if (!updatedProduct) {
        return res.status(404).json({
          message: "Product not found",
        });
      }

      return res.json(updatedProduct);
    } catch (err) {
      console.error("Update product error:", err);
     res.status(501).json({
      message: "Update product functionality not yet implemented",
      endpoint: `PUT /api/products/${id}`,
    });
    }
  }

  // Remove a product
  static async removeProduct(req, res) {
    try {
      const { id } = req.params;

      const deletedProduct = await ProductDL.removeProduct(id);

      if (!deletedProduct) {
        return res.status(404).json({
          message: "Product not found",
        });
      }

      return res.json({
        message: "Product deleted",
      });
    } catch (err) {
      console.error("Remove product error:", err);
      res.status(501).json({
      message: "Remove product functionality not yet implemented",
      endpoint: `DELETE /api/products/${id}`,
    });
    }
    
  }
}

export default ProductBL;
