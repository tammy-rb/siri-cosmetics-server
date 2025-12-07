// Business Logic for Appointment operations
import AppointmentDL from "../DL/appoitment.Dl.js";
import mongoose from "mongoose";

class AppointmentBL {
  // Create a new appointment (book appointment)
  static async createAppointment(req, res) {
    try {
      const { userId, appointmentTypeId, date, status, notes } = req.body;

      if (!userId || !appointmentTypeId || !date) {
        return res.status(400).json({
          message: "userId, appointmentTypeId and date are required",
        });
      }

      // Validate date is in the future
      const appointmentDate = new Date(date);
      if (appointmentDate < new Date()) {
        return res.status(400).json({
          message: "Appointment date must be in the future",
        });
      }

      // Check if the time slot is available
      const existingAppointment = await AppointmentDL.getAllAppointments({
        date: appointmentDate,
        status: { $in: ['scheduled', 'confirmed'] }
      });

      if (existingAppointment.length > 0) {
        return res.status(400).json({
          message: "This time slot is already booked",
        });
      }

      const newAppointment = await AppointmentDL.createAppointment({
        userId,
        appointmentTypeId,
        date: appointmentDate,
        status: status || 'scheduled',
        notes,
      });

      return res.status(201).json(newAppointment);
    } catch (err) {
      console.error("Create appointment error:", err);
      return res.status(500).json({
        message: "Error creating appointment",
        error: err.message,
      });
    }
  }

  // Get a single appointment by ID
  static async getAppointment(req, res) {
    try {
      const { id } = req.params;
      
      const appointment = await AppointmentDL.getAppointmentById(id);
      
      if (!appointment) {
        return res.status(404).json({
          message: "Appointment not found",
        });
      }

      return res.json(appointment);
    } catch (err) {
      console.error("Get appointment error:", err);
      return res.status(500).json({
        message: "Error getting appointment",
        error: err.message,
      });
    }
  }

  // Get all appointments with optional filters
  static async getAllAppointments(req, res) {
    try {
      const { userId, status, appointmentTypeId } = req.query;

      const filter = {};

      if (userId) {
        filter.userId = userId;
      }

      if (status) {
        filter.status = status;
      }

      if (appointmentTypeId) {
        filter.appointmentTypeId = appointmentTypeId;
      }

      const appointments = await AppointmentDL.getAllAppointments(filter);

      return res.status(200).json({
        message: "Get all appointments successfully",
        count: appointments.length,
        data: appointments,
      });
    } catch (err) {
      console.error("Get all appointments error:", err);
      return res.status(500).json({
        message: "Error getting appointments",
        error: err.message,
      });
    }
  }

  // Get appointments by specific date
  static async getAppointmentsByDate(req, res) {
    try {
      const { date } = req.query;

      if (!date) {
        return res.status(400).json({
          message: "date is required",
        });
      }

      const targetDate = new Date(date);
      const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
      const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

      const appointments = await AppointmentDL.getAllAppointments({
        date: {
          $gte: startOfDay,
          $lte: endOfDay,
        },
      });

      return res.status(200).json({
        message: "Get appointments by date successfully",
        date: date,
        count: appointments.length,
        data: appointments,
      });
    } catch (err) {
      console.error("Get appointments by date error:", err);
      return res.status(500).json({
        message: "Error getting appointments by date",
        error: err.message,
      });
    }
  }

  // Get appointments in a date range
  static async getAppointmentsByDateRange(req, res) {
    try {
      const { startDate, endDate } = req.query;

      if (!startDate || !endDate) {
        return res.status(400).json({
          message: "startDate and endDate are required",
        });
      }

      const start = new Date(startDate);
      const end = new Date(endDate);

      if (start > end) {
        return res.status(400).json({
          message: "startDate must be before endDate",
        });
      }

      const appointments = await AppointmentDL.getAllAppointments({
        date: {
          $gte: start,
          $lte: end,
        },
      });

      return res.status(200).json({
        message: "Get appointments by date range successfully",
        startDate,
        endDate,
        count: appointments.length,
        data: appointments,
      });
    } catch (err) {
      console.error("Get appointments by date range error:", err);
      return res.status(500).json({
        message: "Error getting appointments by date range",
        error: err.message,
      });
    }
  }

  // Get appointments by user
  static async getAppointmentsByUser(req, res) {
    try {
      const { userId } = req.params;

      const appointments = await AppointmentDL.getAllAppointments({
        userId: userId,
      });

      return res.status(200).json({
        message: "Get user appointments successfully",
        userId,
        count: appointments.length,
        data: appointments,
      });
    } catch (err) {
      console.error("Get user appointments error:", err);
      return res.status(500).json({
        message: "Error getting user appointments",
        error: err.message,
      });
    }
  }

  // Update an existing appointment
  static async updateAppointment(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;

      // Validate date if being updated
      if (updates.date) {
        const appointmentDate = new Date(updates.date);
        if (appointmentDate < new Date()) {
          return res.status(400).json({
            message: "Appointment date must be in the future",
          });
        }

        // Check if new time slot is available
        const existingAppointment = await AppointmentDL.getAllAppointments({
          date: appointmentDate,
          status: { $in: ['scheduled', 'confirmed'] },
          _id: { $ne: new mongoose.Types.ObjectId(id) }
        });

        if (existingAppointment.length > 0) {
          return res.status(400).json({
            message: "This time slot is already booked",
          });
        }
      }

      const updatedAppointment = await AppointmentDL.updateAppointment(id, updates);

      if (!updatedAppointment) {
        return res.status(404).json({
          message: "Appointment not found",
        });
      }

      return res.json(updatedAppointment);
    } catch (err) {
      console.error("Update appointment error:", err);
      return res.status(500).json({
        message: "Error updating appointment",
        error: err.message,
      });
    }
  }

  // Cancel an appointment
  static async cancelAppointment(req, res) {
    try {
      const { id } = req.params;

      const updatedAppointment = await AppointmentDL.updateAppointment(id, {
        status: 'canceled'
      });

      if (!updatedAppointment) {
        return res.status(404).json({
          message: "Appointment not found",
        });
      }

      return res.json({
        message: "Appointment canceled successfully",
        data: updatedAppointment,
      });
    } catch (err) {
      console.error("Cancel appointment error:", err);
      return res.status(500).json({
        message: "Error canceling appointment",
        error: err.message,
      });
    }
  }

  // Remove an appointment
  static async removeAppointment(req, res) {
    try {
      const { id } = req.params;

      const deletedAppointment = await AppointmentDL.removeAppointment(id);

      if (!deletedAppointment) {
        return res.status(404).json({
          message: "Appointment not found",
        });
      }

      return res.json({
        message: "Appointment deleted successfully",
      });
    } catch (err) {
      console.error("Remove appointment error:", err);
      return res.status(500).json({
        message: "Error removing appointment",
        error: err.message,
      });
    }
  }
}

export default AppointmentBL;
