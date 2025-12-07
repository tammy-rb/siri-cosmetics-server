// Business Logic for AppointmentType operations
import AppointmentTypeDL from "../DL/appoitmentType.Dl.js";

class AppointmentTypeBL {
  // Create a new appointment type
  static async createAppointmentType(req, res) {
    try {
      const { name, durationMinutes, price, description } = req.body;

      if (!name || !durationMinutes || price === undefined || price === null) {
        return res.status(400).json({
          message: "name, durationMinutes and price are required",
        });
      }

      // Validate duration is positive
      if (durationMinutes <= 0) {
        return res.status(400).json({
          message: "Duration must be a positive number",
        });
      }

      // Validate price is non-negative
      if (price < 0) {
        return res.status(400).json({
          message: "Price cannot be negative",
        });
      }

      // Check if appointment type with same name already exists
      const existingType = await AppointmentTypeDL.getAllAppointmentTypes({
        name: name,
      });

      if (existingType.length > 0) {
        return res.status(400).json({
          message: "Appointment type with this name already exists",
        });
      }

      const newAppointmentType = await AppointmentTypeDL.createAppointmentType({
        name,
        durationMinutes,
        price,
        description,
      });

      return res.status(201).json(newAppointmentType);
    } catch (err) {
      console.error("Create appointment type error:", err);
      return res.status(500).json({
        message: "Error creating appointment type",
        error: err.message,
      });
    }
  }

  // Get a single appointment type by ID
  static async getAppointmentType(req, res) {
    try {
      const { id } = req.params;

      const appointmentType = await AppointmentTypeDL.getAppointmentTypeById(id);

      if (!appointmentType) {
        return res.status(404).json({
          message: "Appointment type not found",
        });
      }

      return res.json(appointmentType);
    } catch (err) {
      console.error("Get appointment type error:", err);
      return res.status(500).json({
        message: "Error getting appointment type",
        error: err.message,
      });
    }
  }

  // Get all appointment types with optional filters
  static async getAllAppointmentTypes(req, res) {
    try {
      const { name } = req.query;

      const filter = {};

      if (name) {
        filter.name = new RegExp(name, "i");
      }

      const appointmentTypes = await AppointmentTypeDL.getAllAppointmentTypes(filter);

      return res.status(200).json({
        message: "Get all appointment types successfully",
        count: appointmentTypes.length,
        data: appointmentTypes,
      });
    } catch (err) {
      console.error("Get all appointment types error:", err);
      return res.status(500).json({
        message: "Error getting appointment types",
        error: err.message,
      });
    }
  }

  // Get appointment types by price range
  static async getAppointmentTypesByPriceRange(req, res) {
    try {
      const { minPrice, maxPrice } = req.query;

      if (!minPrice || !maxPrice) {
        return res.status(400).json({
          message: "minPrice and maxPrice are required",
        });
      }

      const min = Number(minPrice);
      const max = Number(maxPrice);

      if (min < 0 || max < 0) {
        return res.status(400).json({
          message: "Price cannot be negative",
        });
      }

      if (min > max) {
        return res.status(400).json({
          message: "Minimum price cannot be greater than maximum price",
        });
      }

      const appointmentTypes = await AppointmentTypeDL.getAllAppointmentTypes({
        price: { $gte: min, $lte: max },
      });

      return res.status(200).json({
        message: "Get appointment types by price range successfully",
        minPrice: min,
        maxPrice: max,
        count: appointmentTypes.length,
        data: appointmentTypes,
      });
    } catch (err) {
      console.error("Get appointment types by price range error:", err);
      return res.status(500).json({
        message: "Error getting appointment types by price range",
        error: err.message,
      });
    }
  }

  // Get appointment types by duration range
  static async getAppointmentTypesByDuration(req, res) {
    try {
      const { minDuration, maxDuration } = req.query;

      if (!minDuration || !maxDuration) {
        return res.status(400).json({
          message: "minDuration and maxDuration are required",
        });
      }

      const min = Number(minDuration);
      const max = Number(maxDuration);

      if (min <= 0 || max <= 0) {
        return res.status(400).json({
          message: "Duration must be positive",
        });
      }

      if (min > max) {
        return res.status(400).json({
          message: "Minimum duration cannot be greater than maximum duration",
        });
      }

      const appointmentTypes = await AppointmentTypeDL.getAllAppointmentTypes({
        durationMinutes: { $gte: min, $lte: max },
      });

      return res.status(200).json({
        message: "Get appointment types by duration successfully",
        minDuration: min,
        maxDuration: max,
        count: appointmentTypes.length,
        data: appointmentTypes,
      });
    } catch (err) {
      console.error("Get appointment types by duration error:", err);
      return res.status(500).json({
        message: "Error getting appointment types by duration",
        error: err.message,
      });
    }
  }

  // Update an existing appointment type
  static async updateAppointmentType(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;

      // Validate duration if being updated
      if (updates.durationMinutes !== undefined && updates.durationMinutes <= 0) {
        return res.status(400).json({
          message: "Duration must be a positive number",
        });
      }

      // Validate price if being updated
      if (updates.price !== undefined && updates.price < 0) {
        return res.status(400).json({
          message: "Price cannot be negative",
        });
      }

      // Check if name is being changed to an existing name
      if (updates.name) {
        const existingType = await AppointmentTypeDL.getAllAppointmentTypes({
          name: updates.name,
        });

        // Check if the existing type is not the one being updated
        if (existingType.length > 0 && existingType[0]._id.toString() !== id) {
          return res.status(400).json({
            message: "Appointment type with this name already exists",
          });
        }
      }

      const updatedAppointmentType = await AppointmentTypeDL.updateAppointmentType(id, updates);

      if (!updatedAppointmentType) {
        return res.status(404).json({
          message: "Appointment type not found",
        });
      }

      return res.json(updatedAppointmentType);
    } catch (err) {
      console.error("Update appointment type error:", err);
      return res.status(500).json({
        message: "Error updating appointment type",
        error: err.message,
      });
    }
  }

  // Remove an appointment type
  static async removeAppointmentType(req, res) {
    try {
      const { id } = req.params;

      const deletedAppointmentType = await AppointmentTypeDL.removeAppointmentType(id);

      if (!deletedAppointmentType) {
        return res.status(404).json({
          message: "Appointment type not found",
        });
      }

      return res.json({
        message: "Appointment type deleted successfully",
      });
    } catch (err) {
      console.error("Remove appointment type error:", err);
      return res.status(500).json({
        message: "Error removing appointment type",
        error: err.message,
      });
    }
  }
}

export default AppointmentTypeBL;
