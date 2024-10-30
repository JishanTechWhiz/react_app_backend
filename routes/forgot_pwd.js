//Forgot Password Route (Send OTP)

const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../model/User');
const sendOTPEmail = require('../utils/sendEmail');

const router = express.Router();

// Test route for GET request
router.get('/forgot-password', (req, res) => {
    res.send('Forgot Route route is working!');
});

// Generate and send OTP
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'Email not found' });
        }

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
        const otpExpires = Date.now() + 10 * 60 * 1000; // OTP expires in 10 minutes

        user.resetOtp = otp;
        user.otpExpires = otpExpires;
        await user.save();

        // Send OTP to the user's email
        await sendOTPEmail(user, otp);

        res.status(200).json({ message: 'OTP sent to email' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

//OTP Verification Route
// Verify OTP
router.post('/verify-otp', async (req, res) => {
    const { email, otp } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'Email not found' });
        }

        // Check if OTP matches and hasn't expired
        if (user.resetOtp !== otp || user.otpExpires < Date.now()) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        res.status(200).json({ message: 'OTP verified, proceed to reset password' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});



// Reset password
router.post('/reset-password', async (req, res) => {
    const { email, newPassword } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'Email not found' });
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update user's password and clear OTP fields
        user.password = hashedPassword;
        user.resetOtp = undefined;
        user.otpExpires = undefined;
        await user.save();

        res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});



module.exports = router;
