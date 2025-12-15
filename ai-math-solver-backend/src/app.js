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

// Serve the React app for all GET requests (SPA catch-all)
// This handles all frontend routes and lets React Router handle 404s
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'build', 'index.html'));
});

// 404 handler for non-GET requests to API routes
app.use((req, res) => {
  res.status(404).json({ 
    message: 'Not Found',
    path: req.originalUrl,
    error: 'The requested resource does not exist'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ 
    message: err.message || 'Something went wrong!', 
    error: process.env.NODE_ENV === 'development' ? err.stack : 'Internal server error'
  });
});

module.exports = app;