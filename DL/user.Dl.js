import mongoose from "mongoose";

/*user fields:
id #running automatic
name
email
phone
address*/
class UserDL {

    static cosmeticPreferencesSchema = new mongoose.Schema({
        skinType: {
            type: String,
            enum: ['normal', 'dry', 'oily', 'combination', 'sensitive'],
        },
        allergies: [String],
        preferredTreatments: [String],
        notes: String,
    }, { _id: false });

    static userSchema = new mongoose.Schema({
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        phone: String,
        address: String,
        cosmeticPreferences: UserDL.cosmeticPreferencesSchema 
    }, { timestamps: true });

    static User = mongoose.model("User", UserDL.userSchema); // creates "users" collection
    // Create a new user in database
    static async createUser(userData) {
        const user = new UserDL.User(userData);
        return await user.save();
    }
    // Get a single user by ID from database
    static async getUserById(id) {
        return await UserDL.User.findById(id);
    }
    // Get all users from database with optional filters
    static async getAllUsers(filters = {}) {
        return await UserDL.User.find(filters);
    }
    // Update an existing user in database
    static async updateUser(id, updateData) {
        return await UserDL.User.findByIdAndUpdate(id, updateData, { new: true });
    }
    // Remove a user from database
    static async removeUser(id) {
        return await UserDL.User.findByIdAndDelete(id);
    }
}

export default UserDL;