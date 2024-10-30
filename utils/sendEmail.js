//Set up Nodemailer for sending OTP emails

const nodemailer = require('nodemailer');
require('dotenv').config(); // Load environment variables

const transporter = nodemailer.createTransport({
    service: 'gmail', // Use your email provider
    auth: {
        user: process.env.EMAIL_USER, // From environment variables
        pass: process.env.EMAIL_PASS,
    },
});

const sendOTPEmail = async (user, otp) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: 'Password Reset OTP',
        text: `Your OTP for password reset is: ${otp}`,
    };

    return await transporter.sendMail(mailOptions);
};

module.exports = sendOTPEmail;
