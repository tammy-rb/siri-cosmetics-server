import express from "express";
import ProductBL from "../BL/product.Bl.js";
import {
  authMiddleware,
  requestLogger,
  validateProductData,
  uploadMiddleware
} from "../routesmiddlewear/middleware.js";

const router = express.Router();

// Create a product (with validation & image upload)
router.post("/", authMiddleware, requestLogger, uploadMiddleware, ProductBL.createProduct);

// Get a product by ID
router.get("/:id", ProductBL.getProduct);

// Create a product (with validation & image upload) - uses multer, no JSON parser
router.post("/", uploadMiddleware, authMiddleware, requestLogger, ProductBL.createProduct);

// Update a product - uses multer, no JSON parser
router.put("/:id", uploadMiddleware, authMiddleware, ProductBL.updateProduct);

// Delete a product by ID
router.delete("/:id", authMiddleware, ProductBL.removeProduct);


export default router;

