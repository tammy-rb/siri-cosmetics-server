import mongoose from "mongoose";

class ClinicSchduleDL {
    static clinicSchduleSchema = new mongoose.Schema({
        dayOfWeek: { type: Number, required: true }, // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
        //timeSlots: [ {from:time, to:time}, ...]
        timeSlots: [{ from: String, to: String }],
    });
    static ClinicSchdule = mongoose.models.ClinicSchdule || mongoose.model("ClinicSchdule", ClinicSchduleDL.clinicSchduleSchema); // creates "clinicschdules" collection

    static specialHoursSchema = new mongoose.Schema({
        date: { type: Date, required: true, unique: true },
        timeSlots: [{ from: String, to: String }],
        reason: { type: String }
    })
    static SpecialHours = mongoose.models.SpecialHours || mongoose.model("SpecialHours", ClinicSchduleDL.specialHoursSchema); // creates "specialhours" collection

    static closedDaysSchema = new mongoose.Schema({
        date: { type: Date, required: true, unique: true },
        reason: { type: String }
    })
    static ClosedDays = mongoose.models.ClosedDays || mongoose.model("ClosedDays", ClinicSchduleDL.closedDaysSchema); // creates "closeddays" collection
    
    //get all clinic schdules per month 
    static async getClinicSchduleForMonth(month, year) {
        const basic = await ClinicSchduleDL.ClinicSchdule.find({});
        //all special hours for the month
        const specialHours = await ClinicSchduleDL.SpecialHours.find({
            date: {
                $gte: new Date(year, month, 1),
                $lte: new Date(year, month + 1, 0)
            }
        });
        //all closed days for the month
        const closedDays = await ClinicSchduleDL.ClosedDays.find({
            date: {
                $gte: new Date(year, month, 1),
                $lte: new Date(year, month + 1, 0)
            }
        });
        return { basic, specialHours, closedDays }; 
    }

    //get clinic schdule
    static async getClinicSchdule() {
        return await ClinicSchduleDL.ClinicSchdule.find({});
    }

    //update clinic schdule
    static async updateClinicSchdule(dayOfWeek, timeSlots) {
        return await ClinicSchduleDL.ClinicSchdule.findOneAndUpdate(
            { dayOfWeek },
            { timeSlots },
            { new: true, upsert: true }
        );
    }

    //add special hours
    static async addSpecialHours(date, timeSlots, reason) {
        const specialHours = new ClinicSchduleDL.SpecialHours({ date, timeSlots, reason });
        return await specialHours.save();
    }

    //get all special hours and closed days in the future
    static async getAllSpecialHoursAndClosedDays() {
        const now = new Date();
        //$gte: greater than or equal
        const specialHours = await ClinicSchduleDL.SpecialHours.find({ date: { $gte: now } });
        const closedDays = await ClinicSchduleDL.ClosedDays.find({ date: { $gte: now } });
        return { specialHours, closedDays };
    }

    //delete special hours
    static async deleteSpecialHours(date) {
        return await ClinicSchduleDL.SpecialHours.findOneAndDelete({ date });
    }

    //add closed day
    static async addClosedDay(date, reason) {
        const closedDay = new ClinicSchduleDL.ClosedDays({ date, reason });
        return await closedDay.save();
    }

    //delete closed day
    static async deleteClosedDay(date) {
        return await ClinicSchduleDL.ClosedDays.findOneAndDelete({ date });
    }
}

export default ClinicSchduleDL;