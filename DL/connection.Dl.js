//connection to the DB using mongoose
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

export default connectDB;

//dont forget to call this function in your main server file to establish the connection
//and make sure to set MONGO_URI in your .env file
//now to use mongoose models, you can import mongoose from mongoose and define your schemas and models as needed
//for example:
// const userSchema = new mongoose.Schema({ name: String, email: String });
// const User = mongoose.model('User', userSchema);