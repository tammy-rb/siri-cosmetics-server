// Utility functions for the Siri Cosmetics application

// Response formatter
export const formatResponse = (success, data, message = null, statusCode = 200) => {
    return {
        success,
        data,
        message,
        timestamp: new Date().toISOString(),
        statusCode
    };
};

// Error response formatter
export const formatError = (message, statusCode = 500, details = null) => {
    return {
        success: false,
        error: {
            message,
            statusCode,
            details,
            timestamp: new Date().toISOString()
        }
    };
};

// Input validation helpers
export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const validatePhone = (phone) => {
    const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
    return phoneRegex.test(phone) && phone.length >= 10;
};

// Date utilities
export const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

export const isValidDate = (dateString) => {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date);
};

// Product utilities
export const generateSKU = (productName, category) => {
    // Simple SKU generator - can be enhanced later
    const prefix = category.substring(0, 3).toUpperCase();
    const suffix = productName.substring(0, 3).toUpperCase();
    const timestamp = Date.now().toString().slice(-4);
    return `${prefix}-${suffix}-${timestamp}`;
};

// Price formatting
export const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(price);
};