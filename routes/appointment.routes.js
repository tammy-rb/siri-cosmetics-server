import express from "express";
import AppointmentBL from "../BL/appointment.Bl.js";

const router = express.Router();

// Get appointments by date range
router.get("/date-range", AppointmentBL.getAppointmentsByDateRange);

// Get appointments by specific date
router.get("/by-date", AppointmentBL.getAppointmentsByDate);

// Get appointments by user
router.get("/user/:userId", AppointmentBL.getAppointmentsByUser);

// Cancel an appointment
router.patch("/:id/cancel", AppointmentBL.cancelAppointment);

// Get all appointments (with optional filters via query params)
router.get("/", AppointmentBL.getAllAppointments);

// Get a single appointment by ID
router.get("/:id", AppointmentBL.getAppointment);

// Create a new appointment (book)
router.post("/", AppointmentBL.createAppointment);

// Update an appointment
router.put("/:id", AppointmentBL.updateAppointment);

// Delete an appointment
router.delete("/:id", AppointmentBL.removeAppointment);

export default router;
