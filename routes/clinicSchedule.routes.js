import express from "express";
import ClinicScheduleBL from "../BL/clinicSchedule.Bl.js";

const router = express.Router();

// Get clinic schedule for a specific month
router.get("/month", ClinicScheduleBL.getClinicScheduleForMonth);

// Get basic clinic schedule (weekly)
router.get("/basic", ClinicScheduleBL.getBasicSchedule);

//Get special hours and closed days in the future
router.get("/special-days", ClinicScheduleBL.getSpecialHoursAndClosedDays);

// Update clinic schedule for a specific day of week
router.put("/basic", ClinicScheduleBL.updateClinicSchedule);


router.get("/available-slots", ClinicScheduleBL.getAvailableTimeSlots);

// Add special hours for a specific date
router.post("/special-hours", ClinicScheduleBL.addSpecialHours);

// Delete special hours for a specific date
router.delete("/special-hours/:date", ClinicScheduleBL.deleteSpecialHours);

// Add closed day
router.post("/closed-days", ClinicScheduleBL.addClosedDay);

// Delete closed day
router.delete("/closed-days/:date", ClinicScheduleBL.deleteClosedDay);

export default router;
