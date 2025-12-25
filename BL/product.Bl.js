// Business Logic for Product operations
// This will contain the actual business logic implementation
import ProductDL from "../DL/product.Dl.js";
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../public/product_images'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'product-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

class ProductBL {
  // Multer middleware wrapper to ensure it runs properly
  static uploadMiddleware = (req, res, next) => {
    console.log("Multer middleware called");
    upload.single('image')(req, res, (err) => {
      console.log("After multer - req.body:", req.body);
      console.log("After multer - req.file:", req.file);
      if (err) {
        console.error("Multer error:", err);
        return res.status(400).json({ message: err.message });
      }
      next();
    });
  };

  static async createProduct(req, res) {
    try {
      const { name, price, description, category, inStock } = req.body;

      if (!name || price === undefined || price === null || !category) {
        return res.status(400).json({
          message: "name, price and category are required",
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

      const productData = {
        name,
        price: parseFloat(price),
        description: description || '',
        category,
        inStock: parseInt(inStock) || 0,
      };

      // If image was uploaded, set the imageUrl
      if (req.file) {
        productData.imageUrl = `/product_images/${req.file.filename}`;
      }

      const newProduct = await ProductDL.createProduct(productData);

      return res.status(201).json(newProduct);
    } catch (err) {
      console.error("Create product error:", err);
      return res.status(500).json({
        message: err.message || "Error creating product",
      });
    }
  }

  // Get a single product by ID
  static async getProduct(req, res) {
    try {
      const { id } = req.params;
      console.log(id);
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

  // BL/product.Bl.js
static async getAllProducts(req, res) {
  try {
    const { name, category, minPrice, maxPrice, keyword } = req.query;

    const filter = {};

    // Filter by name
    if (name) {
      filter.name = new RegExp(name, "i");
    }

    // Filter by category (case-insensitive)
    if (category) {
      filter.category = new RegExp(category, "i");
    }

    // Price range filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // Keyword search in name OR description
    if (keyword) {
      const keywordRegex = new RegExp(keyword, "i");
      filter.$or = [
        { name: keywordRegex },
        { description: keywordRegex },
      ];
    }

    const products = await ProductDL.getAllProducts(filter);

    return res.status(200).json({
      message: "Get all products successfully",
      endpoint: "GET /api/products",
      availableFilters: ["name", "category", "price_range", "keyword"],
      filtersUsed: { name, category, minPrice, maxPrice, keyword },
      count: products.length,
      data: products,
    });
    } catch (err) {
      console.error("Get all products error:", err);
      return res.status(500).json({
        message: "Error while getting products",
        endpoint: "GET /api/products",
        error: err.message,
      });
    }
  }

  // Update an existing product
  static async updateProduct(req, res) {
    try {
      console.log("=== UPDATE PRODUCT DEBUG ===");
      console.log("req.body:", req.body);
      console.log("req.file:", req.file);
      console.log("req.headers['content-type']:", req.headers['content-type']);
      console.log("========================");
      const { id } = req.params;
      
      const { name, price, description, category, inStock } = req.body;

      const updates = {};

      if (name) updates.name = name;
      if (price !== undefined && price !== null && price !== '') {
        const priceNum = parseFloat(price);
        if (priceNum < 0) {
          return res.status(400).json({
            message: "price must be positive",
          });
        }
        updates.price = priceNum;
      }
      if (description !== undefined && description !== null) updates.description = description;
      if (category) updates.category = category;
      if (inStock !== undefined && inStock !== null && inStock !== '') {
        const stockNum = parseInt(inStock);
        if (stockNum < 0) {
          return res.status(400).json({
            message: "inStock cannot be negative",
          });
        }
        updates.inStock = stockNum;
      }

      // If image was uploaded, set the imageUrl
      if (req.file) {
        updates.imageUrl = `/product_images/${req.file.filename}`;
      }

      console.log("Updates to apply:", updates);

      const updatedProduct = await ProductDL.updateProduct(id, updates);

      if (!updatedProduct) {
        return res.status(404).json({
          message: "Product not found",
        });
      }

      return res.json(updatedProduct);
    } catch (err) {
      console.error("Update product error:", err);
      return res.status(500).json({
        message: err.message || "Error updating product",
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
