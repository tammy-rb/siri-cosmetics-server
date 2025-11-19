//write test code for user here - using user.Dl.js methods
import UserDL from './user.Dl.js';
import connectDB from './connection.Dl.js';

await connectDB();
async function testUserDL() {
    //delete user with email 'jane.doe@example.com' if exists
    const existingUser = await UserDL.User.findOne({ email: 'jane.doe@example.com' });
    if (existingUser) {
        await UserDL.removeUser(existingUser._id);
        console.log('Deleted existing user with email jane.doe@example.com');
    }
    let newUser;
    // Create a new user
    try {
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
        });
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

    // Delete user
    try {
        const deletedUser = await UserDL.removeUser(newUser._id);
        console.log('Deleted User:', deletedUser);
    } catch (error) {
        console.error('Error deleting user:', error.message);
    }
    return;
}

testUserDL();