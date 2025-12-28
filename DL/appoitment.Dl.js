// DL/appoitment.Dl.js
import mongoose from "mongoose";

class AppointmentDL {
  static appointmentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    appointmentTypeId: { type: mongoose.Schema.Types.ObjectId, ref: "AppointmentType", required: true },
    date: { type: Date, required: true },
    status: { type: String, enum: ["scheduled", "confirmed", "cancelled", "completed"], default: "scheduled" },
    notes: { type: String }
  }, { timestamps: true });

  static Appointment = mongoose.models.Appointment || mongoose.model("Appointment", AppointmentDL.appointmentSchema);

  // Create a new appointment
  static async createAppointment(appointmentData) {
    const appointment = new AppointmentDL.Appointment(appointmentData);
    return await appointment.save();
  }

  // Get appointment by ID
  static async getAppointmentById(id, options = {}) {
    let query = AppointmentDL.Appointment.findById(id);
    
    if (options.includeUsers) {
      query = query.populate("userId");
    }
    if (options.includeAppointmentTypes) {
      query = query.populate("appointmentTypeId");
    }
    
    return await query.lean();
  }

  // Get all appointments with optional filters
  static async getAllAppointments(filter = {}, options = {}) {
    let query = AppointmentDL.Appointment.find(filter);
    
    if (options.includeUsers) {
      query = query.populate("userId");
    }
    if (options.includeAppointmentTypes) {
      query = query.populate("appointmentTypeId");
    }
    
    return await query.lean();
  }

  // Get appointments raw (without population) - for internal use
  static async getAppointmentsRaw(filter = {}) {
    return await AppointmentDL.Appointment.find(filter).lean();
  }

  // Update appointment
  static async updateAppointment(id, updates) {
    return await AppointmentDL.Appointment.findByIdAndUpdate(
      id,
      updates,
      { new: true }
    ).lean();
  }

  // Remove/delete appointment
  static async removeAppointment(id) {
    return await AppointmentDL.Appointment.findByIdAndDelete(id).lean();
  }
}

export default AppointmentDL;
