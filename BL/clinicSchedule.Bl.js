// Business Logic for Clinic Schedule operations
import ClinicSchduleDL from "../DL/clinicSchdule.Dl.js";
import AppointmentDL from "../DL/appoitment.Dl.js";


class ClinicScheduleBL {

    // Get available time slots for a specific date
    static async getAvailableTimeSlots(req, res) {
        try {
            const { date } = req.query;
            if (!date) {
                return res.status(400).json({ message: "date is required (YYYY-MM-DD)" });
            }
            const day = new Date(`${date}T00:00:00`);
            if (isNaN(day.getTime())) {
                return res.status(400).json({ message: "Invalid date format" });
            }
            const timeSlots = await getTimeSlotsForDate(day);
            const appointmentsForDate = await AppointmentDL.getAllAppointments({ date: { $gte: new Date(day.setHours(0,0,0,0)), $lt: new Date(day.setHours(23,59,59,999)) } });
            // Filter out time slots that are booked
            timeSlots.filter(slot => {
                const dateWithSlotTime = new Date(day);
                const [hour, minute] = slot.from.split(':').map(Number);
                dateWithSlotTime.setHours(hour, minute, 0, 0);
                const isBooked = isTimeSlotBooked(dateWithSlotTime, 15, appointmentsForDate); // assuming 15 minutes duration
                return !isBooked;
            });
            if (!timeSlots.length) {
                return res.status(200).json({
                    message: "Clinic is closed / no time slots for this date",
                    date,
                    data: [],
                });
            }
            return res.status(200).json({
                message: "Available time slots fetched successfully",
                date,
                data: timeSlots,
            });
        } catch (err) {
            console.error("Get available time slots error:", err);
            return res.status(500).json({
                message: "Error getting available time slots",
                error: err.message,
            });
        }
    }

    // Get clinic schedule for a specific month
    static async getClinicScheduleForMonth(req, res) {
        try {
            const { month, year } = req.query;

            if (month === undefined || year === undefined) {
                return res.status(400).json({
                    message: "month and year are required",
                });
            }

            const monthNum = parseInt(month);
            const yearNum = parseInt(year);

            // Validate month
            if (isNaN(monthNum) || monthNum < 0 || monthNum > 11) {
                return res.status(400).json({
                    message: "Invalid month. Must be between 0 (January) and 11 (December)",
                });
            }

            // Validate year
            if (isNaN(yearNum) || yearNum < 2000 || yearNum > 2100) {
                return res.status(400).json({
                    message: "Invalid year. Must be between 2000 and 2100",
                });
            }

            const schedule = await ClinicSchduleDL.getClinicSchdule(monthNum, yearNum);

            return res.status(200).json({
                message: "Get clinic schedule successfully",
                data: schedule,
            });
        } catch (err) {
            console.error("Get clinic schedule error:", err);
            return res.status(500).json({
                message: "Error getting clinic schedule",
                error: err.message,
            });
        }
    }

    static async getAvailableTimeSlots(req, res) {
        try {
            const { date } = req.query;
            console.log("=== GET AVAILABLE TIME SLOTS ===");
            console.log("Received date:", date);
            console.log("Type of date:", typeof date);
            
            if (!date) {
                return res.status(400).json({ message: "date is required (YYYY-MM-DD)" });
            }
            let day = new Date(date);
            console.log("First parse attempt:", day);
            console.log("Is valid:", !isNaN(day.getTime()));
            
            day = isNaN(day.getTime()) ? new Date(`${date}T00:00:00`) : day;
            console.log("Second parse attempt:", day);
            console.log("Is valid:", !isNaN(day.getTime()));
            
            if (isNaN(day.getTime())) {
                return res.status(400).json({ message: "Invalid date format" });
            }

            const timeSlots = await getEmptyTimeSlotsForDate(day);
            if (!timeSlots.length) {
                return res.status(200).json({
                    message: "Clinic is closed / no time slots for this date",
                    date,
                    data: [],
                });
            }

            return res.status(200).json({
                message: "Available time slots fetched successfully",
                date,
                data: timeSlots,
            });
        } catch (err) {
            console.error("Get available time slots error:", err);
            return res.status(500).json({
                message: "Error getting available time slots",
                error: err.message,
            });
        }
    }

    // Get basic clinic schedule (all days of week)
    static async getBasicSchedule(req, res) {
        try {
            const schedule = await ClinicSchduleDL.getClinicSchdule();

            return res.status(200).json({
                message: "Get basic clinic schedule successfully",
                count: schedule.length,
                data: schedule,
            });
        } catch (err) {
            console.error("Get basic schedule error:", err);
            return res.status(500).json({
                message: "Error getting basic schedule",
                error: err.message,
            });
        }
    }

    // Update clinic schedule for a specific day of week
    static async updateClinicSchedule(req, res) {
        try {
            const { dayOfWeek, timeSlots } = req.body;

            if (dayOfWeek === undefined || !timeSlots) {
                return res.status(400).json({
                    message: "dayOfWeek and timeSlots are required",
                });
            }

            // Validate dayOfWeek
            if (typeof dayOfWeek !== 'number' || dayOfWeek < 0 || dayOfWeek > 6) {
                return res.status(400).json({
                    message: "dayOfWeek must be a number between 0 (Sunday) and 6 (Saturday)",
                });
            }

            // Validate timeSlots is an array
            if (!Array.isArray(timeSlots)) {
                return res.status(400).json({
                    message: "timeSlots must be an array",
                });
            }

            // Validate each time slot
            for (const slot of timeSlots) {
                if (!slot.from || !slot.to) {
                    return res.status(400).json({
                        message: "Each time slot must have 'from' and 'to' properties",
                    });
                }

                // Validate time format (HH:MM)
                const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
                if (!timeRegex.test(slot.from) || !timeRegex.test(slot.to)) {
                    return res.status(400).json({
                        message: "Time must be in HH:MM format",
                    });
                }

                // Validate from time is before to time
                const [fromHour, fromMin] = slot.from.split(':').map(Number);
                const [toHour, toMin] = slot.to.split(':').map(Number);
                const fromMinutes = fromHour * 60 + fromMin;
                const toMinutes = toHour * 60 + toMin;

                if (fromMinutes >= toMinutes) {
                    return res.status(400).json({
                        message: "Start time must be before end time",
                    });
                }
            }

            const updatedSchedule = await ClinicSchduleDL.updateClinicSchdule(
                dayOfWeek,
                timeSlots
            );

            return res.status(200).json({
                message: "Clinic schedule updated successfully",
                data: updatedSchedule,
            });
        } catch (err) {
            console.error("Update clinic schedule error:", err);
            return res.status(500).json({
                message: "Error updating clinic schedule",
                error: err.message,
            });
        }
    }

    //get all special hours and closed days in the future
    static async getSpecialHoursAndClosedDays(req, res) {
        try {
            const { specialHours, closedDays } = await ClinicSchduleDL.getAllSpecialHoursAndClosedDays();
            return res.status(200).json({
                message: "Get special hours and closed days successfully",
                data: { specialHours, closedDays }
            });
        } catch (err) {
            console.error("Get special hours and closed days error:", err);
            return res.status(500).json({
                message: "Error getting special hours and closed days",
                error: err.message,
            });
        }
    }


    // Add special hours for a specific date
    static async addSpecialHours(req, res) {
        try {
            const { date, timeSlots, reason } = req.body;

            if (!date || !timeSlots) {
                return res.status(400).json({
                    message: "date and timeSlots are required",
                });
            }

            // Validate date
            const dateObj = new Date(date);
            if (isNaN(dateObj.getTime())) {
                return res.status(400).json({
                    message: "Invalid date format",
                });
            }

            // Validate date is not in the past
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (dateObj < today) {
                return res.status(400).json({
                    message: "Cannot add special hours for past dates",
                });
            }

            // Validate timeSlots
            if (!Array.isArray(timeSlots)) {
                return res.status(400).json({
                    message: "timeSlots must be an array",
                });
            }

            // Validate each time slot
            const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
            for (const slot of timeSlots) {
                if (!slot.from || !slot.to) {
                    return res.status(400).json({
                        message: "Each time slot must have 'from' and 'to' properties",
                    });
                }

                if (!timeRegex.test(slot.from) || !timeRegex.test(slot.to)) {
                    return res.status(400).json({
                        message: "Time must be in HH:MM format",
                    });
                }

                const [fromHour, fromMin] = slot.from.split(':').map(Number);
                const [toHour, toMin] = slot.to.split(':').map(Number);
                const fromMinutes = fromHour * 60 + fromMin;
                const toMinutes = toHour * 60 + toMin;

                if (fromMinutes >= toMinutes) {
                    return res.status(400).json({
                        message: "Start time must be before end time",
                    });
                }
            }

            const specialHours = await ClinicSchduleDL.addSpecialHours(
                dateObj,
                timeSlots,
                reason
            );

            return res.status(201).json({
                message: "Special hours added successfully",
                data: specialHours,
            });
        } catch (err) {
            console.error("Add special hours error:", err);
            if (err.code === 11000) {
                return res.status(400).json({
                    message: "Special hours already exist for this date",
                });
            }
            return res.status(500).json({
                message: "Error adding special hours",
                error: err.message,
            });
        }
    }

    // Delete special hours for a specific date
    static async deleteSpecialHours(req, res) {
        try {
            const { date } = req.params;

            if (!date) {
                return res.status(400).json({
                    message: "date is required",
                });
            }

            const dateObj = new Date(date);
            if (isNaN(dateObj.getTime())) {
                return res.status(400).json({
                    message: "Invalid date format",
                });
            }

            const deleted = await ClinicSchduleDL.deleteSpecialHours(dateObj);

            if (!deleted) {
                return res.status(404).json({
                    message: "Special hours not found for this date",
                });
            }

            return res.status(200).json({
                message: "Special hours deleted successfully",
                data: deleted,
            });
        } catch (err) {
            console.error("Delete special hours error:", err);
            return res.status(500).json({
                message: "Error deleting special hours",
                error: err.message,
            });
        }
    }

    // Add closed day
    static async addClosedDay(req, res) {
        try {
            const { date, reason } = req.body;

            if (!date) {
                return res.status(400).json({
                    message: "date is required",
                });
            }

            // Validate date
            const dateObj = new Date(date);
            if (isNaN(dateObj.getTime())) {
                return res.status(400).json({
                    message: "Invalid date format",
                });
            }

            // Validate date is not in the past
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (dateObj < today) {
                return res.status(400).json({
                    message: "Cannot add closed day for past dates",
                });
            }

            const closedDay = await ClinicSchduleDL.addClosedDay(dateObj, reason);

            return res.status(201).json({
                message: "Closed day added successfully",
                data: closedDay,
            });
        } catch (err) {
            console.error("Add closed day error:", err);
            if (err.code === 11000) {
                return res.status(400).json({
                    message: "Closed day already exists for this date",
                });
            }
            return res.status(500).json({
                message: "Error adding closed day",
                error: err.message,
            });
        }
    }

    // Delete closed day
    static async deleteClosedDay(req, res) {
        try {
            const { date } = req.params;

            if (!date) {
                return res.status(400).json({
                    message: "date is required",
                });
            }

            const dateObj = new Date(date);
            if (isNaN(dateObj.getTime())) {
                return res.status(400).json({
                    message: "Invalid date format",
                });
            }

            const deleted = await ClinicSchduleDL.deleteClosedDay(dateObj);

            if (!deleted) {
                return res.status(404).json({
                    message: "Closed day not found for this date",
                });
            }

            return res.status(200).json({
                message: "Closed day deleted successfully",
                data: deleted,
            });
        } catch (err) {
            console.error("Delete closed day error:", err);
            return res.status(500).json({
                message: "Error deleting closed day",
                error: err.message,
            });
        }
    }
}

//export check if in available hours for a given date and time
export async function isClinicOpen(date, durationMinutes) {
    // Get time in "HH:MM" format from type Date object
    const time = date.toTimeString().slice(0, 5); // "HH:MM"
    const clinicSchedule = await ClinicSchduleDL.getClinicSchdule();
    const dayOfWeek = date.getDay();
    let timeSlots = clinicSchedule.find(s => s.dayOfWeek === dayOfWeek)?.timeSlots || [];

    // Normalize date to start of day for comparison
    const dayKey = new Date(date);
    dayKey.setHours(0, 0, 0, 0);

    // Check special hours for the date
    const specialHours = await ClinicSchduleDL.SpecialHours.findOne({ date: dayKey });
    if (specialHours) {
        timeSlots = specialHours.timeSlots || []; // Use special hours instead
    }
    // Check closed days for the date
    const closedDay = await ClinicSchduleDL.ClosedDays.findOne({ date: dayKey });
    if (closedDay) {
        return false; // Clinic is closed on this day
    }
    const [hour, minute] = time.split(':').map(Number);
    const appointmentStart = hour * 60 + minute;
    const appointmentEnd = appointmentStart + durationMinutes;
    for (const slot of timeSlots) {
        const [fromHour, fromMin] = slot.from.split(':').map(Number);
        const [toHour, toMin] = slot.to.split(':').map(Number);
        const slotStart = fromHour * 60 + fromMin;
        const slotEnd = toHour * 60 + toMin;
        if (appointmentStart >= slotStart && appointmentEnd <= slotEnd) {
            return true;
        }
    }
    return false;
}
export async function isTimeSlotBooked(date, durationMinutes = 30, appointmentsForDate = []) {
    if (!await isClinicOpen(date, durationMinutes)) {
        return false;
    }
    const appointmentDate = new Date(date);
    let existingAppointment;
    if (durationMinutes) {
        const start = new Date(appointmentDate);
        const end = new Date(appointmentDate.getTime() + durationMinutes * 60000);
        existingAppointment = appointmentsForDate.filter(app => {
            const appStart = new Date(app.date);
            const appEnd = new Date(appStart.getTime() + (app.durationMinutes || 30) * 60000);
            return (appStart < end && appEnd > start) && ["scheduled", "confirmed"].includes(app.status);
        });
    } else {
        existingAppointment = appointmentsForDate.filter(app => {
            const appDate = new Date(app.date);
            return appDate.getTime() === appointmentDate.getTime() && ["scheduled", "confirmed"].includes(app.status);
        });
    }
    return existingAppointment.length === 0;
}

//calculate for a specific date if the clinic is fully booked
export async function isDayFullyBooked(date) {
    return (await getEmptyTimeSlotsForDate(date)).length === 0;
}

export async function getEmptyTimeSlotsForDate(date) {
    const targetDate = new Date(date);
    const timeSlots = await getTimeSlotsForDate(targetDate);
    if (timeSlots.length === 0) {
        return []; // Clinic is closed that day
    }
    const emptySlots = [];
    const appointmentsForDate = await AppointmentDL.getAllAppointments({ date: { $gte: new Date(targetDate.setHours(0,0,0,0)), $lt: new Date(targetDate.setHours(23,59,59,999)) } });
    for (const slot of timeSlots) {
        const slotDate = new Date(targetDate);
        const [hour, minute] = slot.split(':').map(Number);
        slotDate.setHours(hour, minute, 0, 0);
        if (!(await isTimeSlotBooked(slotDate, 15, appointmentsForDate))) {
            emptySlots.push(slot);
        }
    }
    return emptySlots;
}

// מחזיר timeSlots לתאריך ספציפי לפי: closedDays -> specialHours -> schedule רגיל
export async function getTimeSlotsForDate(date) {
    const clinicSchedule = await ClinicSchduleDL.getClinicSchdule();
    const dayOfWeek = date.getDay();

    // Normalize date to start of day for comparison
    const dayKey = new Date(date);
    dayKey.setHours(0, 0, 0, 0);
    
    // Closed day?
    const closedDay = await ClinicSchduleDL.ClosedDays.findOne({ date: dayKey });
    if (closedDay) return []; // אין שעות עבודה בכלל

    // Special hours?
    const specialHours = await ClinicSchduleDL.SpecialHours.findOne({ date: dayKey });
    if (specialHours) return specialHours.timeSlots || [];

    // Regular schedule
    const openClinic = clinicSchedule.find(s => s.dayOfWeek === dayOfWeek)?.timeSlots || [];
    let timeSlots = [];
    for (const slot of openClinic) {
        const from = hhmmToMinutes(slot.from);
        const to = hhmmToMinutes(slot.to);
        for (let m = from; m < to; m += 15) {
            timeSlots.push(minutesToHHMM(m));
        }
    }
    return timeSlots;
}

function hhmmToMinutes(hhmm) {
    const [h, m] = hhmm.split(":").map(Number);
    return h * 60 + m;
}

function minutesToHHMM(minutes) {
    const h = String(Math.floor(minutes / 60)).padStart(2, "0");
    const m = String(minutes % 60).padStart(2, "0");
    return `${h}:${m}`;
}




export default ClinicScheduleBL;
