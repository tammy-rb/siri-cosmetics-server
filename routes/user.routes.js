// routes/userRoutes.js
import express from "express";
import UserBL from "../BL/user.Bl.js";
import { authMiddleware } from "../routesmiddlewear/middleware.js";

const router = express.Router();

// POST /api/users/register
router.post("/register", async (req, res, next) => {
    try {
        const result = await UserBL.registerUser(req.body);
         // Set the token in an HTTP-Only cookie
        res.cookie('authToken', result.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days, same as JWT expiration
        });

        res.status(201).json({
            user: result.user,
            token: result.token, // Also send token in response body
            message: "User registered and logged in successfully"
        });
    } catch (err) {
        // למשל דוא"ל כפול – נחזיר 400
        if (err.message.includes("exists")) {
            return res.status(400).json({ message: err.message });
        }
        next(err);
    }
});

// POST /api/users/login
router.post("/login", async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const result = await UserBL.login(email, password);
        
        // Set the token in an HTTP-Only cookie
        res.cookie('authToken', result.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.json({
            user: result.user,
            token: result.token, // Also send token in response body
            message: "Logged in successfully"
        });
    } catch (err) {
        // שגיאת התחברות -> 401
        if (err.message.includes("Invalid email or password")) {
            return res.status(401).json({ message: err.message });
        }
        next(err);
    }
});

// GET /api/users  (protected)
router.get("/", authMiddleware, async (req, res, next) => {
    try {
        const filters = req.query || {};
        const users = await UserBL.getAllUsers(filters);
        res.json(users);
    } catch (err) {
        next(err);
    }
});

// GET /api/users/:id  (protected)
router.get("/:id", authMiddleware, async (req, res, next) => {
    try {
        const user = await UserBL.getUserById(req.params.id);
        res.json(user);
    } catch (err) {
        if (err.message === "User not found") {
            return res.status(404).json({ message: err.message });
        }
        next(err);
    }
});

// PUT /api/users/:id  (protected)
router.put("/:id", authMiddleware, async (req, res, next) => {
    try {
        const updated = await UserBL.updateUser(req.params.id, req.body);
        res.json(updated);
    } catch (err) {
        if (err.message === "User not found") {
            return res.status(404).json({ message: err.message });
        }
        next(err);
    }
});

// DELETE /api/users/:id  (protected)
router.delete("/:id", authMiddleware, async (req, res, next) => {
    try {
        const deleted = await UserBL.removeUser(req.params.id);
        res.json(deleted);
    } catch (err) {
        if (err.message === "User not found") {
            return res.status(404).json({ message: err.message });
        }
        next(err);
    }
});

export default router;
