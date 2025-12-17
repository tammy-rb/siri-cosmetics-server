import mongoose from "mongoose";

class AppointmentDL {
  static appointmentSchema = new mongoose.Schema(
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      appointmentTypeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "AppointmentType",
        required: true,
      },
      // date and time of the appointment - check the appointment time is open
      date: { type: Date, required: true },
      status: {
        type: String,
        enum: ["scheduled", "completed", "canceled", "confirmed"],
        default: "scheduled",
      },
      notes: String,
    },
    { timestamps: true }
  );

  static Appointment = mongoose.model(
    "Appointment",
    AppointmentDL.appointmentSchema
  ); // creates "appointments" collection

  // Create a new appointment in database
  static async createAppointment(appointmentData) {
    const appointment = new AppointmentDL.Appointment(appointmentData);
    return await appointment.save();
  }

  /**
   * Get a single appointment by ID from database
   * @param {string} id
   * @param {Object} options
   * @param {boolean} options.includeUser - whether to populate userId
   */
  static async getAppointmentById(id, { includeUser = false } = {}) {
    let query = AppointmentDL.Appointment
      .findById(id)
      .populate("appointmentTypeId");

    if (includeUser) {
      query = query.populate("userId");
    }

    return await query;
  }

  /**
   * Get all appointments from database with optional filters
   * @param {Object} filters - mongoose find filters
   * @param {Object} options
   * @param {boolean} options.includeUsers - whether to populate userId
   */
  static async getAllAppointments(filters = {}, { includeUsers = false } = {}) {
    let query = AppointmentDL.Appointment
      .find(filters)
      .populate("appointmentTypeId");

    if (includeUsers) {
      query = query.populate("userId");
    }

    return await query;
  }

  // Update an existing appointment in database
  static async updateAppointment(id, updateData) {
    return await AppointmentDL.Appointment
      .findByIdAndUpdate(id, updateData, { new: true })
      .populate("appointmentTypeId");
  }

  // Remove an appointment from database
  static async removeAppointment(id) {
    return await AppointmentDL.Appointment.findByIdAndDelete(id);
  }

  // (Optional) keep convenience methods if you like:
  static async getAppointmentByIdWithUsers(id) {
    return await AppointmentDL.getAppointmentById(id, { includeUser: true });
  }

  static async getAllAppointmentsWithUsers(filters = {}) {
    return await AppointmentDL.getAllAppointments(filters, {
      includeUsers: true,
    });
  }
}

export default AppointmentDL;
