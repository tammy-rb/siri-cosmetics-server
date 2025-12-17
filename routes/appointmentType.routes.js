import express from "express";
import AppointmentTypeBL from "../BL/appointmentType.Bl.js";

const router = express.Router();

// Get appointment types by price range
router.get("/price-range", AppointmentTypeBL.getAppointmentTypesByPriceRange);

// Get appointment types by duration range
router.get("/duration-range", AppointmentTypeBL.getAppointmentTypesByDuration);

// Get all appointment types (with optional filters via query params)
router.get("/", AppointmentTypeBL.getAllAppointmentTypes);

// Get a single appointment type by ID
router.get("/:id", AppointmentTypeBL.getAppointmentType);

// Create a new appointment type
router.post("/", AppointmentTypeBL.createAppointmentType);

// Update an appointment type
router.put("/:id", AppointmentTypeBL.updateAppointmentType);

// Delete an appointment type
router.delete("/:id", AppointmentTypeBL.removeAppointmentType);

export default router;
