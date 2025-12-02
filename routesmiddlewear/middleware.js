// Common middleware functions for the application

import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

// Request logging middleware
export const requestLogger = (req, res, next) => {
  const logData = `${new Date().toISOString()} - ${req.method} ${
    req.originalUrl
  }\n`;
  fs.appendFile("./log.txt", logData, (err) => {
    if (err) {
      console.error("Error writing to log file:", err);
    }
  });
  next();
};

// Error handling middleware
export const errorHandler = (err, req, res, next) => {
  console.error("Error occurred:", err);

  if (res.headersSent) {
    return next(err);
  }

  const status = err.status || 500;

  const errorResponse = {
    message: err.message || "Internal Server Error",
    status,
    timestamp: new Date().toISOString(),
  };

  // אם יש פירוט שגיאות מהולידציה
  if (err.details) {
    errorResponse.details = err.details;
  }

  res.status(status).json({ error: errorResponse });
};

// Validation middleware for product operations
export const validateProductData = (req, res, next) => {
  const { name, price, description, imageUrl, inStock, category } = req.body;

  const errors = [];

  // name
  if (!name || typeof name !== "string" || !name.trim()) {
    errors.push("name is required and must be a non-empty string");
  }

  // price
  if (price === undefined || price === null) {
    errors.push("price is required");
  } else if (typeof price !== "number" || Number.isNaN(price)) {
    errors.push("price must be a number");
  } else if (price < 0) {
    errors.push("price must be >= 0");
  }

  // description
  if (!description || typeof description !== "string" || !description.trim()) {
    errors.push("description is required and must be a non-empty string");
  }

  // inStock (אופציונלי, אבל אם נשלח – חייב להיות מספר >= 0)
  if (inStock !== undefined) {
    if (typeof inStock !== "number" || Number.isNaN(inStock)) {
      errors.push("inStock must be a number");
    } else if (inStock < 0) {
      errors.push("inStock must be >= 0");
    }
  }

  // category (אם יש לך שדה כזה בסכמה)
  if (category !== undefined && typeof category !== "string") {
    errors.push("category must be a string");
  }

  // imageUrl – בדיקה מאוד בסיסית
  if (imageUrl !== undefined && typeof imageUrl !== "string") {
    errors.push("imageUrl must be a string");
  }

  if (errors.length > 0) {
    const err = new Error("Product validation failed");
    err.status = 400;
    err.details = errors;
    return next(err);
  }

  next();
};

// Authentication middleware (basic API key auth)
export const authenticate = (req, res, next) => {
  // אם אין API_KEY בקובץ env – לא נכפה כלום (אפשר לשנות אם את רוצה)
  if (!process.env.API_KEY) {
    return next();
  }

  const clientKey = req.header("x-api-key");

  if (!clientKey || clientKey !== process.env.API_KEY) {
    const err = new Error("Unauthorized");
    err.status = 401;
    return next(err);
  }

  next();
};

// middleware/authMiddleware.js
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_me";

export function authMiddleware(req, res, next) {
    try {
     
    // הוצאת הטוקן בצורה בטוחה
    const authHeader = req.headers.authorization;
    let token = null;

    // 1. ניסיון ראשון – מתוך Authorization: Bearer ...
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.slice(7).trim();
    }

    // 2. אם אין Header – לנסות מהקוקי
    if (!token && req.cookies && req.cookies.authToken) {
      token = req.cookies.authToken;
    }

    // 3. אם עדיין אין טוקן – אין גישה
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    // אימות הטוקן
    const payload = jwt.verify(token, JWT_SECRET);

    req.userId = payload.userId;
    next();
  
    } catch (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
}

