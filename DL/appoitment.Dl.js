import mongoose from "mongoose";

class AppointmentDL {
    static appointmentSchema = new mongoose.Schema({
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        appointmentTypeId: { type: mongoose.Schema.Types.ObjectId, ref: "AppointmentType", required: true },
        // date and time of the appointment - check the appoinment time is open
        date: { type: Date, required: true, unique: true },
        status: { type: String, enum: ['scheduled', 'completed', 'canceled', 'confirmed'], default: 'scheduled' },
        notes: String
    }, { timestamps: true });

    static Appointment = mongoose.model("Appointment", AppointmentDL.appointmentSchema); // creates "appointments" collection

    // Create a new appointment in database
    static async createAppointment(appointmentData) {
        const appointment = new AppointmentDL.Appointment(appointmentData);
        return await appointment.save();
    }
    // Get a single appointment by ID from database
    static async getAppointmentById(id) {
        return await AppointmentDL.Appointment.findById(id).populate('appointmentTypeId');
    }
    // Get all appointments from database with optional filters
    static async getAllAppointments(filters = {}) {
        return await AppointmentDL.Appointment.find(filters).populate('appointmentTypeId');
    }
    // Update an existing appointment in database
    static async updateAppointment(id, updateData) {
        return await AppointmentDL.Appointment.findByIdAndUpdate(id, updateData, { new: true });
    }
    // Remove an appointment from database
    static async removeAppointment(id) {
        return await AppointmentDL.Appointment.findByIdAndDelete(id);
    }
}

export default AppointmentDL;