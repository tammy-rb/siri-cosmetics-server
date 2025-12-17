import mongoose from "mongoose";

/*user fields:
id #running automatic
name
email
phone
shippingAddresses - array of address objects*/
class UserDL {

    static addressSchema = new mongoose.Schema({
        country: { type: String, required: true },
        city: { type: String, required: true },
        street: { type: String, required: true },
        number: { type: String, required: true },
        aptNumber: String,
        isDefault: { type: Boolean, default: false }
    }, { _id: true });

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
        address: String, // Keep for backward compatibility
        shippingAddresses: [UserDL.addressSchema],
        cosmeticPreferences: UserDL.cosmeticPreferencesSchema 
    }, { timestamps: true });

    static passwordSchema = new mongoose.Schema({
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        hash: String,
        salt: String
    });

    static User = mongoose.model("User", UserDL.userSchema); // creates "users" collection
    static Password = mongoose.model("Password", UserDL.passwordSchema); // creates "passwords" collection
    
    // Create a new user in database
    static async createUser(userData, hash, salt) {
        const user = new UserDL.User(userData);
        const password = new UserDL.Password({ userId: user._id, hash, salt });
        await password.save();
        return await user.save();
    }
    // Get a single user by ID from database
    static async getUserById(id) {
        return await UserDL.User.findById(id);
    }
    //get password data by user ID
    static async getPasswordByUserId(userId) {
        return await UserDL.Password.findOne({ userId });
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
        await UserDL.Password.deleteMany({ userId: id });
        return await UserDL.User.findByIdAndDelete(id);
    }
}

export default UserDL;