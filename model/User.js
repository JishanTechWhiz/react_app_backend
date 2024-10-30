const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    resetOtp: { 
        type: String,  // Optional field to store the OTP for password reset
        default: null  // Initialize as null by default
    },
    otpExpires: { 
        type: Date,    // Optional field to store when the OTP expires
        default: null  // Initialize as null by default
    },
});

module.exports = mongoose.model('User', userSchema);
