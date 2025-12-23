import express from "express";
import AppointmentBL from "../BL/appointment.Bl.js";
import ClinicScheduleBL from "../BL/clinicSchedule.Bl.js";

const router = express.Router();

// Get appointments by date range - WORKING
router.get("/date-range", AppointmentBL.getAppointmentsByDateRange);

// Get appointments by specific date - WORKING
router.get("/by-date", AppointmentBL.getAppointmentsByDate);

// Get appointments by user ID - WORKING
router.get("/user/:userId", AppointmentBL.getAppointmentsByUser);

// Cancel an appointment - WORKING
router.patch("/:id/cancel", AppointmentBL.cancelAppointment);

// Get all appointments (with optional filters via query params) - WORKING
router.get("/", AppointmentBL.getAllAppointments);

// Get fully booked days for a given month and year - WORKING
router.get("/fully-booked-days", AppointmentBL.getFullyBookedDays);

// Get available time slots for a specific date - WORKING
router.get("/available-time-slots", ClinicScheduleBL.getAvailableTimeSlots);

// Get a single appointment by ID - WORKING
router.get("/:id", AppointmentBL.getAppointment);

// Create a new appointment (book) - WORKING
router.post("/", AppointmentBL.createAppointment);

// Update an appointment - WORKING
router.put("/:id", AppointmentBL.updateAppointment);

// Delete an appointment - WORKING
router.delete("/:id", AppointmentBL.removeAppointment);

export default router;
