// BL/clinicSchedule.Bl.js
import ClinicSchduleDL from "../DL/clinicSchdule.Dl.js";
import AppointmentDL from "../DL/appoitment.Dl.js";

class ClinicScheduleBL {
  // Get available time slots for a specific date (SINGLE definition - fixed)
  static async getAvailableTimeSlots(req, res) {
    try {
      const { date, durationMinutes } = req.query;

      if (!date) return res.status(400).json({ message: "date is required (YYYY-MM-DD)" });

      const day = new Date(`${date}T00:00:00`);
      if (isNaN(day.getTime())) return res.status(400).json({ message: "Invalid date format" });

      const duration = durationMinutes ? Number(durationMinutes) : 30;

      const timeSlots = await getEmptyTimeSlotsForDate(day, duration);

      return res.status(200).json({
        message: "Available time slots fetched successfully",
        date,
        durationMinutes: duration,
        data: timeSlots,
      });
    } catch (err) {
      console.error("Get available time slots error:", err);
      return res.status(500).json({ message: "Error getting available time slots", error: err.message });
    }
  }

  // Get clinic schedule for a specific month
  static async getClinicScheduleForMonth(req, res) {
    try {
      const { month, year } = req.query;

      if (month === undefined || year === undefined) {
        return res.status(400).json({ message: "month and year are required" });
      }

      const monthNum = parseInt(month, 10);
      const yearNum = parseInt(year, 10);

      if (isNaN(monthNum) || monthNum < 0 || monthNum > 11) {
        return res.status(400).json({
          message: "Invalid month. Must be between 0 (January) and 11 (December)",
        });
      }

      if (isNaN(yearNum) || yearNum < 2000 || yearNum > 2100) {
        return res.status(400).json({
          message: "Invalid year. Must be between 2000 and 2100",
        });
      }

      const schedule = await ClinicSchduleDL.getClinicSchduleForMonth(monthNum, yearNum);

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

  // Get basic clinic schedule (weekly)
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
        return res.status(400).json({ message: "dayOfWeek and timeSlots are required" });
      }

      if (typeof dayOfWeek !== "number" || dayOfWeek < 0 || dayOfWeek > 6) {
        return res.status(400).json({
          message: "dayOfWeek must be a number between 0 (Sunday) and 6 (Saturday)",
        });
      }

      if (!Array.isArray(timeSlots)) {
        return res.status(400).json({ message: "timeSlots must be an array" });
      }

      const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
      for (const slot of timeSlots) {
        if (!slot.from || !slot.to) {
          return res.status(400).json({
            message: "Each time slot must have 'from' and 'to' properties",
          });
        }
        if (!timeRegex.test(slot.from) || !timeRegex.test(slot.to)) {
          return res.status(400).json({ message: "Time must be in HH:MM format" });
        }

        const fromMinutes = hhmmToMinutes(slot.from);
        const toMinutes = hhmmToMinutes(slot.to);
        if (fromMinutes >= toMinutes) {
          return res.status(400).json({ message: "Start time must be before end time" });
        }
      }

      const updatedSchedule = await ClinicSchduleDL.updateClinicSchdule(dayOfWeek, timeSlots);

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

  // Get all special hours and closed days in the future
  static async getSpecialHoursAndClosedDays(req, res) {
    try {
      const { specialHours, closedDays } = await ClinicSchduleDL.getAllSpecialHoursAndClosedDays();
      return res.status(200).json({
        message: "Get special hours and closed days successfully",
        data: { specialHours, closedDays },
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
        return res.status(400).json({ message: "date and timeSlots are required" });
      }

      const dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) {
        return res.status(400).json({ message: "Invalid date format" });
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      dateObj.setHours(0, 0, 0, 0);
      if (dateObj < today) {
        return res.status(400).json({ message: "Cannot add special hours for past dates" });
      }

      if (!Array.isArray(timeSlots)) {
        return res.status(400).json({ message: "timeSlots must be an array" });
      }

      const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
      for (const slot of timeSlots) {
        if (!slot.from || !slot.to) {
          return res.status(400).json({
            message: "Each time slot must have 'from' and 'to' properties",
          });
        }
        if (!timeRegex.test(slot.from) || !timeRegex.test(slot.to)) {
          return res.status(400).json({ message: "Time must be in HH:MM format" });
        }
        if (hhmmToMinutes(slot.from) >= hhmmToMinutes(slot.to)) {
          return res.status(400).json({ message: "Start time must be before end time" });
        }
      }

      const specialHours = await ClinicSchduleDL.addSpecialHours(dateObj, timeSlots, reason);

      return res.status(201).json({
        message: "Special hours added successfully",
        data: specialHours,
      });
    } catch (err) {
      console.error("Add special hours error:", err);
      if (err.code === 11000) {
        return res.status(400).json({ message: "Special hours already exist for this date" });
      }
      return res.status(500).json({ message: "Error adding special hours", error: err.message });
    }
  }

  // Delete special hours for a specific date
  static async deleteSpecialHours(req, res) {
    try {
      const { date } = req.params;
      if (!date) return res.status(400).json({ message: "date is required" });

      const dateObj = new Date(date);
      dateObj.setHours(0, 0, 0, 0);
      if (isNaN(dateObj.getTime())) return res.status(400).json({ message: "Invalid date format" });

      const deleted = await ClinicSchduleDL.deleteSpecialHours(dateObj);
      if (!deleted) return res.status(404).json({ message: "Special hours not found for this date" });

      return res.status(200).json({
        message: "Special hours deleted successfully",
        data: deleted,
      });
    } catch (err) {
      console.error("Delete special hours error:", err);
      return res.status(500).json({ message: "Error deleting special hours", error: err.message });
    }
  }

  // Add closed day
  static async addClosedDay(req, res) {
    try {
      const { date, reason } = req.body;
      if (!date) return res.status(400).json({ message: "date is required" });

      const dateObj = new Date(date);
      dateObj.setHours(0, 0, 0, 0);
      if (isNaN(dateObj.getTime())) return res.status(400).json({ message: "Invalid date format" });

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (dateObj < today) {
        return res.status(400).json({ message: "Cannot add closed day for past dates" });
      }

      const closedDay = await ClinicSchduleDL.addClosedDay(dateObj, reason);

      return res.status(201).json({
        message: "Closed day added successfully",
        data: closedDay,
      });
    } catch (err) {
      console.error("Add closed day error:", err);
      if (err.code === 11000) {
        return res.status(400).json({ message: "Closed day already exists for this date" });
      }
      return res.status(500).json({ message: "Error adding closed day", error: err.message });
    }
  }

  // Delete closed day
  static async deleteClosedDay(req, res) {
    try {
      const { date } = req.params;
      if (!date) return res.status(400).json({ message: "date is required" });

      const dateObj = new Date(date);
      dateObj.setHours(0, 0, 0, 0);
      if (isNaN(dateObj.getTime())) return res.status(400).json({ message: "Invalid date format" });

      const deleted = await ClinicSchduleDL.deleteClosedDay(dateObj);
      if (!deleted) return res.status(404).json({ message: "Closed day not found for this date" });

      return res.status(200).json({
        message: "Closed day deleted successfully",
        data: deleted,
      });
    } catch (err) {
      console.error("Delete closed day error:", err);
      return res.status(500).json({ message: "Error deleting closed day", error: err.message });
    }
  }
}

// -------- Helpers (no schema changes) --------

// Fetch day configuration once (basic schedule + special/closed)
async function getDayConfig(date) {
  const dayKey = new Date(date);
  dayKey.setHours(0, 0, 0, 0);

  const [basicSchedule, closedDay, specialHours] = await Promise.all([
    ClinicSchduleDL.getClinicSchdule(),
    ClinicSchduleDL.ClosedDays.findOne({ date: dayKey }).lean(),
    ClinicSchduleDL.SpecialHours.findOne({ date: dayKey }).lean(),
  ]);

  if (closedDay) return { closed: true, timeSlots: [] };
  if (specialHours) return { closed: false, timeSlots: specialHours.timeSlots || [] };

  const dayOfWeek = dayKey.getDay();
  const regular = basicSchedule.find(s => s.dayOfWeek === dayOfWeek)?.timeSlots || [];
  return { closed: false, timeSlots: regular };
}

// Check if clinic open at a given Date + duration (uses getDayConfig once)
export async function isClinicOpen(date, durationMinutes) {
  const { closed, timeSlots } = await getDayConfig(date);
  if (closed) return false;

  const time = date.toTimeString().slice(0, 5);
  const [hour, minute] = time.split(":").map(Number);
  const appointmentStart = hour * 60 + minute;
  const appointmentEnd = appointmentStart + durationMinutes;

  for (const slot of timeSlots) {
    const slotStart = hhmmToMinutes(slot.from);
    const slotEnd = hhmmToMinutes(slot.to);
    if (appointmentStart >= slotStart && appointmentEnd <= slotEnd) return true;
  }
  return false;
}

// Slot availability (fast path query; still correct for "no overlap" inside [start,end))
export async function isTimeSlotAvailable(date, durationMinutes = 30) {
  if (!(await isClinicOpen(date, durationMinutes))) return false;

  const start = new Date(date);
  const end = new Date(start.getTime() + durationMinutes * 60000);

  const existing = await AppointmentDL.getAppointmentsRaw({
    date: { $gte: start, $lt: end },
    status: { $in: ["scheduled", "confirmed"] },
  });

  return existing.length === 0;
}

// Fully booked day = no empty slots for default duration
export async function isDayFullyBooked(date) {
  return (await getEmptyTimeSlotsForDate(date, 30)).length === 0;
}

function dayBounds(date) {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  return { start, end };
}

function intervalsOverlap(aStart, aEnd, bStart, bEnd) {
  return aStart < bEnd && aEnd > bStart;
}

// Get empty slots for a date (optimized: one appointments query)
export async function getEmptyTimeSlotsForDate(date, durationMinutes = 30) {
  const targetDate = new Date(date);

  const slots = await getTimeSlotsForDate(targetDate);
  if (slots.length === 0) return [];

  const { start, end } = dayBounds(targetDate);

  const appts = await AppointmentDL.getAppointmentsRaw({
    date: { $gte: start, $lt: end },
    status: { $in: ["scheduled", "confirmed"] },
  });

  // NOTE: without schema change we do NOT know real appointment durations.
  // We conservatively block using the requested durationMinutes.
  const blocked = appts.map(a => {
    const d = new Date(a.date);
    const startMin = d.getHours() * 60 + d.getMinutes();
    const endMin = startMin + durationMinutes;
    return [startMin, endMin];
  });

  const free = [];
  for (const hhmm of slots) {
    const slotStart = hhmmToMinutes(hhmm);
    const slotEnd = slotStart + durationMinutes;

    const isTaken = blocked.some(([bStart, bEnd]) =>
      intervalsOverlap(slotStart, slotEnd, bStart, bEnd)
    );

    if (!isTaken) free.push(hhmm);
  }

  return free;
}

// Returns candidate 15-min slots for date (closed -> special -> regular) using getDayConfig once
export async function getTimeSlotsForDate(date) {
  const { closed, timeSlots } = await getDayConfig(date);
  if (closed) return [];
  if (!timeSlots || timeSlots.length === 0) return [];

  // If special hours exist, timeSlots is [{from,to},...], same as regular.
  const out = [];
  for (const slot of timeSlots) {
    const from = hhmmToMinutes(slot.from);
    const to = hhmmToMinutes(slot.to);
    for (let m = from; m < to; m += 15) out.push(minutesToHHMM(m));
  }
  return out;
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
