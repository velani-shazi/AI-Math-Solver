const express = require('express');
const router = express.Router();
const passport = require('passport');
const { generateToken } = require('../config/jwt');
const { manualSignup,manualLogin, getCurrentUser, logout } = require('../controllers/auth.controller');
const { authenticateToken } = require('../middleware/auth');

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  (req, res) => {
    const token = generateToken(req.user);
    res.redirect(`${process.env.FRONTEND_URL}?token=${token}`);
  }
);

router.post('/signup', manualSignup);

router.post('/login', manualLogin);

router.get('/me', authenticateToken, getCurrentUser);

router.post('/logout', authenticateToken, logout);

module.exports = router;