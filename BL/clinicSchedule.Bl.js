// Business Logic for Clinic Schedule operations
import ClinicSchduleDL from "../DL/clinicSchdule.Dl.js";

class ClinicScheduleBL {
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
export async function isInAvailableHours(date, time, durationMinutes) {
    const clinicSchedule = await ClinicSchduleDL.getClinicSchdule();
    const dayOfWeek = date.getDay();
    const timeSlots = clinicSchedule.find(s => s.dayOfWeek === dayOfWeek)?.timeSlots || [];

    // Check special hours for the date
    const specialHours = await ClinicSchduleDL.SpecialHours.findOne({ date: new Date(date.getFullYear(), date.getMonth(), date.getDate()) });
    if (specialHours) {
        timeSlots.length = 0; // Clear regular time slots
        timeSlots.push(...specialHours.timeSlots);
    }
    // Check closed days for the date
    const closedDay = await ClinicSchduleDL.ClosedDays.findOne({ date: new Date(date.getFullYear(), date.getMonth(), date.getDate()) });    
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

export default ClinicScheduleBL;
