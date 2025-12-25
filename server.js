import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import cookieParser from 'cookie-parser';
import { requestLogger, errorHandler } from './routesmiddlewear/middleware.js';
import productRoutes from './routes/product.routes.js';
import userRoutes from './routes/user.routes.js';
import cartRoutes from './routes/cart.routes.js';
import appointmentRoutes from './routes/appointment.routes.js';
import appointmentTypeRoutes from './routes/appointmentType.routes.js';
import clinicScheduleRoutes from './routes/clinicSchedule.routes.js';
import orderRoutes from './routes/order.routes.js';


// Initialize express app
const app = express();

//make possible to send files from server in folder public
app.use(express.static('public'));

// Enable CORS for only the website client at http://localhost:3000
const corsOptions = {
  origin: ["http://localhost:5173", "http://localhost:3000"],
  credentials: true,
};
app.use(cors(corsOptions));

// Note: Don't use bodyParser globally when using multer for file uploads
// Multer will handle parsing FormData, and other routes can use express.json()

// Use cookie-parser middleware
app.use(cookieParser()); 

// Use request logging middleware
app.use(requestLogger);

app.use(express.static(path.join(process.cwd(), "public")));

// Use routes (routes will handle their own body parsing as needed)
app.use('/api/products', productRoutes);
app.use('/api/users', express.json(), userRoutes);
app.use('/api/cart', express.json(), cartRoutes);
app.use('/api/appointments', express.json(), appointmentRoutes);
app.use('/api/appointment-types', express.json(), appointmentTypeRoutes);
app.use('/api/clinic-schedule', express.json(), clinicScheduleRoutes);
app.use('/api/orders', orderRoutes);

// Define homepage route for Siri Cosmetics
app.get("/", (req, res) => {
    res.json({
        message: "Welcome to Siri Cosmetics API",
        description: "Professional cosmetics clinic platform",
        services: [
            "Beauty product browsing and purchasing",
            "Appointment booking for treatments",
            "Personal account management",
            "AI-powered beauty advice"
        ],
        endpoints: {
            products: "/api/products",
            cart: "/api/cart",
            appointments: "/api/appointments",
            appointmentTypes: "/api/appointment-types"
        },
        version: "1.0.0"
    });
});

// Set port and listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});

import mongoose from "mongoose";

console.log('DB State:', mongoose.connection.readyState);
try {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB Connected!");
} catch (error) {
  console.log("MongoDB Connection Error:", error.message);
}