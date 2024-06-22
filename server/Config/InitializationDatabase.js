const connectDb = require('./databaseConfig');
const bcrypt = require('bcryptjs');
const roleModel = require('../Models/RoleModel');
const userModel = require('../Models/UserModel');
const roles = process.env.ROLES?.split(',')

const defaultAdmin = {
    firstName: process.env.AdminFirstName,
    lastName: process.env.AdminlastName,
    email: process.env.Adminemail,
    password: process.env.Adminpassword,
    phoneNumber: process.env.AdminphoneNumber,
    verified: false,
    firstVisit: true,
    _roles: process.env.AdmineRole
}

const defaultUser = {
    firstName: process.env.userFirstName,
    lastName: process.env.userlastName,
    email: process.env.useremail,
    password: process.env.userpassword,
    phoneNumber: process.env.userphoneNumber,
    verified: false,
    firstVisit: true,
    _roles: process.env.usereRole
}

// create default roles :
async function createDefaultRoles() {
    try {
        const count = await roleModel.countDocuments({});
        if (count === 0) {
            const rolePromises = roles.map(role => {
                const newRole = new roleModel({ role });
                return newRole.save();
            });
            await Promise.all(rolePromises);
            console.log('Default roles created successfully.');
        } else {
            console.log('Roles already exist in the database.');
        }
    } catch (err) {
        console.error("Error ==> ", err);
        process.exit(1);
    }
}

// create admin account 
async function createDefaultAdmin() {
    try {
        const admin = await userModel.findOne({ email: defaultAdmin.email });
        if (!admin) {
            const salt = bcrypt.genSaltSync(10);
            defaultAdmin.password = await bcrypt.hash(defaultAdmin.password, salt);
            
            const adminRole = await roleModel.findOne({ role: 'admin' }); // Adjust to find the correct role
            if (adminRole) {
                defaultAdmin._roles = [adminRole._id];
                const newAdmin = new userModel(defaultAdmin);
                await newAdmin.save();
                console.log('Default admin created successfully.');
            } else {
                console.error('Admin role not found.');
                process.exit(1);
            }
        } else {
            console.log('Admin already exists.');
        }
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

// create user account
async function createDefaultUser() {
    try {
        const user = await userModel.findOne({ email: defaultUser.email });
        if (!user) {
            const salt = bcrypt.genSaltSync(10);
            defaultUser.password = await bcrypt.hash(defaultUser.password, salt);
            
            const userRole = await roleModel.findOne({ role: 'user' }); // Finding role with name 'User'
            if (userRole) {
                defaultUser._roles = [userRole._id];
                const newUser = new userModel(defaultUser);
                await newUser.save();
                console.log('Default user created successfully.');
            } else {
                console.error('User role not found.');
                process.exit(1);
            }
        } else {
            console.log('Default user already exists.');
        }
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}


async function initializationDatabase() {
    await connectDb();
    await createDefaultRoles();
    await createDefaultAdmin();
    await createDefaultUser();
}


module.exports = initializationDatabase;