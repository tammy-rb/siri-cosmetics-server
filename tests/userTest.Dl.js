//write test code for user here - using user.Dl.js methods
import UserDL from '../DL/user.Dl.js';
import connectDB from '../DL/connection.Dl.js';
import mongoose from 'mongoose';

await connectDB();
async function testUserDL() {
    //delete user with email 'jane.doe@example.com' if exists
    const existingUser = await UserDL.User.findOne({ email: 'jane.doe@example.com' });
    if (existingUser) {
        await UserDL.removeUser(existingUser._id);
        console.log('Deleted existing user with email jane.doe@example.com');
    }
    let newUser;
    // Create a new user with password
    try {
        const mockHash = 'mockHashValue123456789';
        const mockSalt = 'mockSaltValue123456789';
        
        newUser = await UserDL.createUser({
            name: 'Jane Doe',
            email: 'jane.doe@example.com',
            phone: '123-456-7890',
            address: '123 Main St, Anytown, USA',
            cosmeticPreferences: {
                skinType: 'combination',
                allergies: ['peanuts'],
                preferredTreatments: ['facials', 'chemical peels'],
                notes: 'Prefers natural ingredients'
            }
        }, mockHash, mockSalt);
        console.log('Created User:', newUser);
    } catch (error) {
        console.error('Error creating user:', error.message);
    }

    // Get user by ID
    try {
        const fetchedUser = await UserDL.getUserById(newUser._id);
        console.log('Fetched User by ID:', fetchedUser);
    } catch (error) {
        console.error('Error fetching user:', error.message);
    }

    // Get password by user ID
    try {
        const userPassword = await UserDL.getPasswordByUserId(newUser._id);
        console.log('Fetched Password:', {
            userId: userPassword.userId,
            hash: userPassword.hash,
            salt: userPassword.salt
        });
    } catch (error) {
        console.error('Error fetching password:', error.message);
    }
    
    // Update user
    try {
        const updatedUser = await UserDL.updateUser(newUser._id, {
            phone: '987-654-3210',
            address: '456 Elm St, Othertown, USA'
        });
        console.log('Updated User:', updatedUser);
    } catch (error) {
        console.error('Error updating user:', error.message);
    }

    // Verify password still exists after user update
    try {
        const passwordAfterUpdate = await UserDL.getPasswordByUserId(newUser._id);
        console.log('Password still exists after update:', passwordAfterUpdate ? 'Yes' : 'No');
    } catch (error) {
        console.error('Error verifying password after update:', error.message);
    }

    // Delete user (should also delete password)
    try {
        const deletedUser = await UserDL.removeUser(newUser._id);
        console.log('Deleted User:', deletedUser);
    } catch (error) {
        console.error('Error deleting user:', error.message);
    }

    // Verify password was deleted with user
    try {
        const passwordAfterDelete = await UserDL.getPasswordByUserId(newUser._id);
        console.log('Password deleted with user:', passwordAfterDelete ? 'No (still exists!)' : 'Yes');
    } catch (error) {
        console.error('Error verifying password deletion:', error.message);
    }
    return;
}

// Run the test once and close the mongoose connection when done
testUserDL()
    .then(() => {
        console.log('userTest.Dl finished, closing DB connection.');
        mongoose.connection.close();
    })
    .catch((err) => {
        console.error('userTest.Dl failed:', err);
        mongoose.connection.close();
        process.exit(1);
    });