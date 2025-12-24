import express from "express";
import ProductBL from "../BL/product.Bl.js";
import {
  authenticate,
  requestLogger,
  validateProductData,
} from "../routesmiddlewear/middleware.js";
import { authMiddleware } from "../routesmiddlewear/middleware.js";


const router = express.Router();

// Create a product (with validation & image upload)
router.post("/", ProductBL.createProduct);

// Get a product by ID
router.get("/:id", ProductBL.getProduct);

// Get all products (optional name, category, and price filters)
router.get("/", ProductBL.getAllProducts);

// Update a product 
router.put("/:id", authMiddleware, ProductBL.updateProduct);

// Delete a product by ID
router.delete("/:id", ProductBL.removeProduct);

router.get("/", authenticate, requestLogger, ProductBL.getAllProducts);
router.post("/", authenticate, requestLogger, validateProductData, ProductBL.createProduct);


export default router;

