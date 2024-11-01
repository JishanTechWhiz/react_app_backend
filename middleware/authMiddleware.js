const jwt = require('jsonwebtoken');
require('dotenv').config(); // Load environment variables

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Replace 'jwtSecretKey' with your actual secret
        req.user = decoded; // Attach user info to request object
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

module.exports = authMiddleware;
