const User = require('../models/User');
const Puzzle = require('../models/Puzzle');

// Get overview stats for the dashboard
exports.getStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({ role: 'student' });
        const totalPuzzles = await Puzzle.countDocuments();
        
        // Aggregate total XP across all students
        const xpStats = await User.aggregate([
            { $match: { role: 'student' } },
            { $group: { _id: null, totalXP: { $sum: "$xp" } } }
        ]);

        res.status(200).json({
            success: true,
            stats: {
                totalUsers,
                totalPuzzles,
                totalSystemXP: xpStats[0]?.totalXP || 0
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all users for the management table
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ role: 'student' }).select('-password');
        res.status(200).json({ success: true, users });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};