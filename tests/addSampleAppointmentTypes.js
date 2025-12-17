import mongoose from "mongoose";
import AppointmentTypeDL from "../DL/appoitmentType.Dl.js";
import connectDB from "../DL/connection.Dl.js";
await connectDB();
async function addSampleAppointmentTypes() {
    const sampleTypes = [
        { name: "Facial", durationMinutes: 60, price: 80, description: "A relaxing facial treatment." },
        { name: "Manicure", durationMinutes: 45, price: 50, description: "A professional manicure service." },
        { name: "Pedicure", durationMinutes: 50, price: 60, description: "A soothing pedicure treatment." },
        { name: "Massage", durationMinutes: 90, price: 120, description: "A therapeutic full-body massage." },
        { name: "Hair Styling", durationMinutes: 30, price: 40, description: "Professional hair styling service." },
        { name: "Makeup Application", durationMinutes: 60, price: 70, description: "Expert makeup application for special occasions." },
        { name: "Facial Waxing", durationMinutes: 30, price: 40, description: "Gentle facial waxing service eyebrows and mustache." },
        { name: "Laser Hair Removal", durationMinutes: 45, price: 100, description: "Effective laser hair removal treatment." }
    ];  
    for (const typeData of sampleTypes) {
        const existing = await AppointmentTypeDL.AppointmentType.findOne({ name: typeData.name });
        if (existing) {
            console.log(`Appointment type "${typeData.name}" already exists, skipping.`);
            continue;
        }
        const createdType = await AppointmentTypeDL.createAppointmentType(typeData);
        console.log(`Created appointment type:`, createdType);
    }
}
await addSampleAppointmentTypes();
mongoose.connection.close();
process.exit(0);