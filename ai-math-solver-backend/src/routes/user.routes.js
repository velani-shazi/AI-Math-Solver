const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile, deleteUserAccount } = require('../controllers/user.controller');
const { authenticateToken } = require('../middleware/auth');
const { logActivity } = require('../middleware/activity');

router.get('/profile', authenticateToken, logActivity('view_profile'), getUserProfile);
router.put('/profile', authenticateToken, logActivity('update_profile'), updateUserProfile);
router.delete('/profile', authenticateToken, logActivity('delete_account'), deleteUserAccount);

module.exports = router;