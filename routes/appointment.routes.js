import express from "express";
import AppointmentBL from "../BL/appointment.Bl.js";

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

// Get a single appointment by ID - WORKING
router.get("/:id", AppointmentBL.getAppointment);

// Create a new appointment (book) - WORKING
router.post("/", AppointmentBL.createAppointment);

// Update an appointment - WORKING
router.put("/:id", AppointmentBL.updateAppointment);

// Delete an appointment - WORKING
router.delete("/:id", AppointmentBL.removeAppointment);

export default router;
