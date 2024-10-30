const express = require('express');
const nodemailer = require('nodemailer');
require('dotenv').config(); // Load environment variables

const router = express.Router();

// Email sending route and logic in the same file
router.post('/send-pdf', (req, res) => {
    const { email, pdfData } = req.body;

    // Validate request
    if (!email || !pdfData) {
        return res.status(400).send('Email or PDF data missing.');
    }

    // Configure nodemailer transport
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER, // From environment variables
            pass: process.env.EMAIL_PASS,
        },
    });

    // Email message
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your Todo List PDF',
        text: 'Here is your requested Todo List PDF.',
        attachments: [
            {
                filename: 'TodoList.pdf',
                content: pdfData, // base64 encoded PDF content
                encoding: 'base64',
            },
        ],
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            return res.status(500).send('Error sending email.');
        }
        res.send('Email sent successfully: ' + info.response);
    });
});

module.exports = router;
