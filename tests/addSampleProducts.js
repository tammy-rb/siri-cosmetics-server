import productDL from '../DL/product.Dl.js';
import mongoose from 'mongoose';
import connectDB from '../DL/connection.Dl.js';
await connectDB();

const sampleProducts = [
    {
        name: 'Hydrating Face Cream',
        description: 'A rich moisturizing cream for all skin types',
        price: 45.99,
        category: 'Skincare',
        imageUrl: 'https://example.com/images/face-cream.jpg',
        stock: 50
    },
    {
        name: 'Matte Lipstick - Ruby Red',
        description: 'Long-lasting matte finish lipstick',
        price: 22.50,
        category: 'Makeup',
        imageUrl: 'https://example.com/images/lipstick-red.jpg',
        stock: 100
    },
    {
        name: 'Vitamin C Serum',
        description: 'Brightening serum with 20% vitamin C',
        price: 65.00,
        category: 'Skincare',
        imageUrl: 'https://example.com/images/vitamin-c-serum.jpg',
        stock: 30
    },
    {
        name: 'Mascara - Volume Boost',
        description: 'Waterproof volumizing mascara',
        price: 28.99,
        category: 'Makeup',
        imageUrl: 'https://example.com/images/mascara.jpg',
        stock: 75
    },
    {
        name: 'Gentle Cleansing Foam',
        description: 'pH-balanced facial cleanser',
        price: 32.00,
        category: 'Skincare',
        imageUrl: 'https://example.com/images/cleanser.jpg',
        stock: 60
    },
    {
        name: 'Eyeshadow Palette - Nude Collection',
        description: '12 versatile nude shades',
        price: 55.00,
        category: 'Makeup',
        imageUrl: 'https://example.com/images/eyeshadow-palette.jpg',
        stock: 40
    },
    {
        name: 'Anti-Aging Night Cream',
        description: 'Retinol-enriched night treatment',
        price: 78.50,
        category: 'Skincare',
        imageUrl: 'https://example.com/images/night-cream.jpg',
        stock: 25
    },
    {
        name: 'Foundation - Natural Beige',
        description: 'Full coverage liquid foundation',
        price: 42.00,
        category: 'Makeup',
        imageUrl: 'https://example.com/images/foundation.jpg',
        stock: 85
    },
    {
        name: 'Rose Water Toner',
        description: 'Refreshing and hydrating toner',
        price: 25.99,
        category: 'Skincare',
        imageUrl: 'https://example.com/images/toner.jpg',
        stock: 70
    },
    {
        name: 'Lip Gloss - Clear Shine',
        description: 'High-shine non-sticky lip gloss',
        price: 18.50,
        category: 'Makeup',
        imageUrl: 'https://example.com/images/lip-gloss.jpg',
        stock: 90
    }
];

async function addSampleProducts() {
    try {
        console.log('Adding sample products...');
        
        for (const product of sampleProducts) {
            await productDL.createProduct(product);
            console.log(`Added: ${product.name}`);
        }
        
        console.log('All sample products added successfully!');
    } catch (error) {
        console.error('Error adding sample products:', error);
    }
}

addSampleProducts();