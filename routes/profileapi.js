const express = require('express');
const User = require('../model/User'); // Assuming this is your User model
const authMiddleware = require('../middleware/authMiddleware'); // Authentication middleware

const router = express.Router();

// GET Profile - View User Profile
router.get('/profile', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password'); // Exclude password from response
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user); // Send user data
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// PUT Profile - Update User Profile
router.put('/profile', authMiddleware, async (req, res) => {
    const { name, email } = req.body;

    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update user fields
        if (name) user.name = name;
        if (email) user.email = email;

        await user.save(); // Save updated user data

        res.json({ message: 'Profile updated successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
