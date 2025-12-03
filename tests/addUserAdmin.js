import UserDL from '../DL/user.Dl.js';
import connectDB from '../DL/connection.Dl.js';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

await connectDB();
async function addUserAdmin() {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash("SiriAdminPswd", salt);
    UserDL.createUser({
        name: 'Siri Admin',
        email: 'yokheved.rose@gmail.com',
        phone: '111-222-3333',
        address: '1 Admin St, Admincity, IL',
        cosmeticPreferences: null
    }, hash, salt).then((user) => {
        console.log('Admin User created:', user);
    }).catch((error) => {
        console.error('Error creating admin user:', error);
    });
}

addUserAdmin()
    .then(() => {
        console.log('addUserAdmin finished, closing DB connection.');
        mongoose.connection.close();
    })
    .catch((err) => {
        console.error('addUserAdmin failed:', err);
        mongoose.connection.close();
        process.exit(1);
    });