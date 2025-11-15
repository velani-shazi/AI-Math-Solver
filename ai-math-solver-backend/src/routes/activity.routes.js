const express = require('express');
const router = express.Router();
const { getUserActivity, getUserStats, clearUserActivity } = require('../controllers/activity.controller');
const { authenticateToken } = require('../middleware/auth');

router.get('/', authenticateToken, getUserActivity);
router.get('/stats', authenticateToken, getUserStats);
router.delete('/', authenticateToken, clearUserActivity);

module.exports = router;