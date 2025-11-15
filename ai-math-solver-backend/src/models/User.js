const mongoose = require('mongoose');
const crypto = require('crypto');

const historyItemSchema = new mongoose.Schema({
  id: { type: String, default: () => crypto.randomUUID() },
  problem: String,
  solution: String,
  timestamp: { type: Date, default: Date.now }
});

const libraryItemSchema = new mongoose.Schema({
  id: { type: String, default: () => crypto.randomUUID() },
  problem: String,
  solution: String,
  title: { type: String, default: 'Untitled' },
  timestamp: { type: Date, default: Date.now }
});

const activityLogSchema = new mongoose.Schema({
  id: { type: String, default: () => crypto.randomUUID() },
  action: { type: String, required: true }, // e.g., 'login', 'logout', 'view_page', 'add_to_library'
  details: { type: mongoose.Schema.Types.Mixed }, // Additional context
  timestamp: { type: Date, default: Date.now },
  ip_address: String,
  user_agent: String
});

const userSchema = new mongoose.Schema({
  ID: { type: String, required: true, unique: true },
  Name: String,
  Email: { type: String, required: true },
  Image_URL: String,
  Registration_Date: { type: Date, default: Date.now },
  Google_Linked: { type: Boolean, default: false },
  Facebook_Linked: { type: Boolean, default: false },
  Password: { type: String },
  History: [historyItemSchema],
  Library: [libraryItemSchema],
  isAdmin: { type: Boolean, default: false },
  Activity_Log: [activityLogSchema],
  Last_Login: { type: Date },
  Last_Active: { type: Date }
});

module.exports = mongoose.model('User', userSchema);