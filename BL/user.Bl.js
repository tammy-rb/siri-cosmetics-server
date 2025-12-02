// bl/UserBL.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import UserDL from "../DL/user.Dl.js";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_me";
const JWT_EXPIRES_IN = "7d";

class UserBL {
    // Register new user
    static async registerUser(userData) {
        const { name, email, phone, address, cosmeticPreferences, password } = userData;

        if (!name || !email || !password) {
            throw new Error("name, email and password are required");
        }

        // Check if user already exists
        const existing = await UserDL.User.findOne({ email });
        if (existing) {
            throw new Error("User with this email already exists");
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        // Create user record + password record via DL
        const user = await UserDL.createUser(
            {
                name,
                email,
                phone,
                address,
                cosmeticPreferences
            },
            hash,
            salt
        );

        const token = this._generateToken(user._id);

        return { user, token };
    }

    // Login
    static async login(email, password) {
        const user = await UserDL.User.findOne({ email });
        if (!user) {
            throw new Error("Invalid email or password");
        }

        const passwordData = await UserDL.getPasswordByUserId(user._id);
        if (!passwordData || !passwordData.hash) {
            throw new Error("Invalid email or password");
        }

        const isMatch = await bcrypt.compare(password, passwordData.hash);
        if (!isMatch) {
            throw new Error("Invalid email or password");
        }

        const token = this._generateToken(user._id);
        return { user, token };
    }

    // Get single user
    static async getUserById(id) {
        const user = await UserDL.getUserById(id);
        if (!user) throw new Error("User not found");
        return user;
    }

    // Get all users
    static async getAllUsers(filters = {}) {
        return await UserDL.getAllUsers(filters);
    }

    // Update user
    static async updateUser(id, updateData) {
        // block email change? up to you – כאן משאיר פתוח
        const updated = await UserDL.updateUser(id, updateData);
        if (!updated) throw new Error("User not found");
        return updated;
    }

    // Delete user
    static async removeUser(id) {
        const deleted = await UserDL.removeUser(id);
        if (!deleted) throw new Error("User not found");
        return deleted;
    }

    // private
    static _generateToken(userId) {
        return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    }
}

export default UserBL;
