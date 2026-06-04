const User = require('../models/User');

// Middleware to protect admin routes
const admin = async (req, res, next) => {
    // req.user is usually attached by your authMiddleware.js
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ 
            success: false, 
            message: "Access denied: Admin privileges required." 
        });
    }
};

module.exports = { admin };