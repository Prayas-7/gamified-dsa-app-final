const express = require('express');
const router = express.Router();
const { getStats, getAllUsers } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

const { getDetailedAnalytics } = require('../controllers/analyticsController');

router.get('/analytics', getDetailedAnalytics);
// Dashboard Statistics Route
router.get('/stats',getStats);

// User Management Route
router.get('/users',getAllUsers);

module.exports = router;