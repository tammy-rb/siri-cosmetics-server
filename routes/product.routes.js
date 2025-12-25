import express from "express";
import ProductBL from "../BL/product.Bl.js";
import {
  authMiddleware,
  requestLogger,
  validateProductData,
  uploadMiddleware,
  authorizeAdmin
} from "../routesmiddlewear/middleware.js";

const router = express.Router();
// Get all products
router.get("/", ProductBL.getAllProducts);
// Get a product by ID
router.get("/:id", ProductBL.getProduct);

// Create a product (with validation & image upload) - uses multer, no JSON parser
router.post("/", uploadMiddleware, authMiddleware, authorizeAdmin, requestLogger, ProductBL.createProduct);

// Update a product - uses multer, no JSON parser
router.put("/:id", uploadMiddleware, authMiddleware, authorizeAdmin, ProductBL.updateProduct);

// Delete a product by ID
router.delete("/:id", authMiddleware, authorizeAdmin, ProductBL.removeProduct);


export default router;

