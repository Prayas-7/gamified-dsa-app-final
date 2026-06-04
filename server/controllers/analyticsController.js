const User = require('../models/User');

exports.getDetailedAnalytics = async (req, res) => {
    try {
        // 1. Calculate Average XP
        const avgXPResult = await User.aggregate([
            { $match: { role: 'student' } },
            { $group: { _id: null, avgXP: { $avg: "$xp" } } }
        ]);

        // 2. Level Distribution (How many students are at each level)
        const levelDist = await User.aggregate([
            { $match: { role: 'student' } },
            { $group: { _id: "$level", count: { $sum: 1 } } },
            { $sort: { "_id": 1 } }
        ]);

        // 3. Activity Timeline (Using updatedAt for mock trend data)
        const activityData = await User.find({ role: 'student' })
            .select('username xp level updatedAt')
            .sort({ updatedAt: 1 });

        res.status(200).json({
            success: true,
            averageXP: Math.round(avgXPResult[0]?.avgXP || 0),
            levelDistribution: levelDist.map(item => ({ level: `Lvl ${item._id}`, students: item.count })),
            performanceTrend: activityData.map(u => ({ name: u.username, xp: u.xp }))
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};