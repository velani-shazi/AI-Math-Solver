const express = require('express');
const cors = require('cors');
const path = require('path');
const passport = require('passport');

const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const libraryRoutes = require('./routes/library.routes');
const adminRoutes = require('./routes/admin.routes');
const activityRoutes = require('./routes/activity.routes');
const geminiRoutes = require('./routes/gemini.routes');

require('./config/passport');

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..', 'build')));

app.use(passport.initialize());

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/users/library', libraryRoutes);
app.use('/users/activity', activityRoutes);
app.use('/admin', adminRoutes);
app.use('/gemini',geminiRoutes);

const spaRoutes = ['/', '/login', '/solutions', '/bookmarks', '/account'];
spaRoutes.forEach(route => {
  app.get(route, (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'build', 'index.html'));
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!', 
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

module.exports = app;