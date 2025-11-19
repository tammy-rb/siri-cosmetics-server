// Common middleware functions for the application

import fs from 'fs';

// Request logging middleware
export const requestLogger = (req, res, next) => {
    const logData = `${new Date().toISOString()} - ${req.method} ${req.originalUrl}\n`;
    fs.appendFile('./log.txt', logData, (err) => {
        if (err) {
            console.error('Error writing to log file:', err);
        }
    });
    next();
};

// Error handling middleware
export const errorHandler = (err, req, res, next) => {
    console.error('Error occurred:', err);
    
    if (res.headersSent) {
        return next(err);
    }
    
    res.status(err.status || 500).json({
        error: {
            message: err.message || 'Internal Server Error',
            status: err.status || 500,
            timestamp: new Date().toISOString()
        }
    });
};

// Validation middleware for product operations
export const validateProductData = (req, res, next) => {
    // TODO: Implement product data validation
    next();
};

// Authentication middleware (placeholder)
export const authenticate = (req, res, next) => {
    // TODO: Implement authentication logic
    next();
};