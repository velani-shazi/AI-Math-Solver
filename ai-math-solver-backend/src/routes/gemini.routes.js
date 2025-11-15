const express = require('express');
const router = express.Router();
const { processLatex } = require('../controllers/gemini.controller');
const { authenticateToken } = require('../middleware/auth');

router.post('/process', processLatex);

module.exports = router;