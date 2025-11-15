const express = require('express');
const router = express.Router();
const { getAllUsers, getUserActivityByAdmin, getSystemStats } = require('../controllers/admin.controller');
const { authenticateToken, isAdmin } = require('../middleware/auth');

router.get('/users', authenticateToken, isAdmin, getAllUsers);
router.get('/users/:userId/activity', authenticateToken, isAdmin, getUserActivityByAdmin);
router.get('/stats', authenticateToken, isAdmin, getSystemStats);

module.exports = router;