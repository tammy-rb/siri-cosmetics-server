import mongoose from "mongoose";

class AppointmentTypeDL {

    static appointmentTypeSchema = new mongoose.Schema({
        name: { type: String, required: true },
        durationMinutes: { type: Number, required: true },
        price: { type: Number, required: true },
        description: String
    }, { timestamps: true });
    
    static AppointmentType = mongoose.model("AppointmentType", AppointmentTypeDL.appointmentTypeSchema); // creates "appointmenttypes" collection

    // Create a new appointment type in database
    static async createAppointmentType(appointmentTypeData) {
        const appointmentType = new AppointmentTypeDL.AppointmentType(appointmentTypeData);
        return await appointmentType.save();
    }
    // Get a single appointment type by ID from database
    static async getAppointmentTypeById(id) {
        return await AppointmentTypeDL.AppointmentType.findById(id);
    }
    // Get all appointment types from database with optional filters
    static async getAllAppointmentTypes(filters = {}) {
        return await AppointmentTypeDL.AppointmentType.find(filters);
    }
    // Update an existing appointment type in database
    static async updateAppointmentType(id, updateData) {
        return await AppointmentTypeDL.AppointmentType.findByIdAndUpdate(id, updateData, { new: true });
    }
    // Remove an appointment type from database
    static async removeAppointmentType(id) {
        return await AppointmentTypeDL.AppointmentType.findByIdAndDelete(id);
    }
}

export default AppointmentTypeDL;