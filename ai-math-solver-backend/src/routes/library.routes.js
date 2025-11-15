const express = require('express');
const router = express.Router();
const { getLibrary, addToLibrary, removeFromLibrary, clearLibrary } = require('../controllers/library.controller');
const { authenticateToken } = require('../middleware/auth');
const { logActivity } = require('../middleware/activity');

router.get('/', authenticateToken, logActivity('view_library'), getLibrary);
router.post('/', authenticateToken, logActivity('add_to_library'), addToLibrary);
router.delete('/:itemId', authenticateToken, logActivity('remove_from_library'), removeFromLibrary);
router.delete('/', authenticateToken, logActivity('clear_library'), clearLibrary);

module.exports = router;