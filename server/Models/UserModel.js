const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    firstName : {
        type: String,
    },
    lasName : {
        type: String,
    },
    email : {
        type: String,
        unique: true,
    },
    password : {
        type: String,
    },
    phoneNumber: {
        type: String,
    },
    verified: {
        type: Boolean,
        default: false,
    },
    firstVisit: {
        type: Boolean,
        default: true
    },
    _roles : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Role'
        }
    ]
})

module.exports = mongoose.model('User' , userSchema);