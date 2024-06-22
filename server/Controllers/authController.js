const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const User = require('../Models/UserModel');
const Roles = require('../Models/RoleModel');
const nodeMailer = require('nodemailer');


const Register = asyncHandler(async (req, res) => {
    const { 
        firstName,
        lastName,
        email,
        password,
        phoneNumber,
        _roles,
    } = req.body;

    // Validate request body
    if (!firstName || !lastName || !email || !password || !phoneNumber || !_roles) {
        return res.status(400).json({ message: 'Please fill all fields' });
    }

    // Check if the user already exists
    const existedUser = await User.findOne({ email });
    if (existedUser) {
        return res.status(400).json({ message: 'User already exists' });
    }

    // Check if the phone number is already used
    const existedPhoneNumber = await User.findOne({ phoneNumber });
    if (existedPhoneNumber) {
        return res.status(400).json({ message: 'Please try another phone number' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Find the role by role name
    const role = await Roles.findOne({ role: _roles });
    if (!role) {
        return res.status(400).json({ message: 'Invalid role' });
    }

    // Create the user
    const user = await User.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        phoneNumber,
        _roles: [role._id]
    });

    // Send response
    if (user) {
        res.status(201).json({ user });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
});


const Login = asyncHandler(async(req, res) => {
    const data = req.body;
    console.log(data)
})


module.exports = { Register , Login };