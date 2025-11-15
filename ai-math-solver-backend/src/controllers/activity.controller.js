const User = require('../models/User');

const getUserActivity = async (req, res) => {
  try {
    const user = await User.findOne({ ID: req.user.ID });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { limit = 50, offset = 0, action } = req.query;
    
    let activityLog = user.Activity_Log || [];
    
    if (action) {
      activityLog = activityLog.filter(log => log.action === action);
    }
    
    activityLog = activityLog.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    const paginatedLog = activityLog.slice(parseInt(offset), parseInt(offset) + parseInt(limit));
    
    res.json({
      total: activityLog.length,
      limit: parseInt(limit),
      offset: parseInt(offset),
      activities: paginatedLog
    });
  } catch (error) {
    console.error('Activity fetch error:', error);
    res.status(500).json({ message: 'Error fetching activity', error: error.message });
  }
};

const getUserStats = async (req, res) => {
  try {
    const user = await User.findOne({ ID: req.user.ID });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const activityLog = user.Activity_Log || [];
    
    const stats = {
      total_activities: activityLog.length,
      last_login: user.Last_Login,
      last_active: user.Last_Active,
      registration_date: user.Registration_Date,
      history_items: user.History.length,
      library_items: user.Library.length,
      activity_by_action: {}
    };
    
    activityLog.forEach(log => {
      stats.activity_by_action[log.action] = (stats.activity_by_action[log.action] || 0) + 1;
    });
    
    res.json(stats);
  } catch (error) {
    console.error('Stats fetch error:', error);
    res.status(500).json({ message: 'Error fetching stats', error: error.message });
  }
};

const clearUserActivity = async (req, res) => {
  try {
    const user = await User.findOne({ ID: req.user.ID });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.Activity_Log = [];
    await user.save();

    res.json({ message: 'Activity log cleared successfully' });
  } catch (error) {
    console.error('Activity clear error:', error);
    res.status(500).json({ message: 'Error clearing activity', error: error.message });
  }
};

module.exports = {
  getUserActivity,
  getUserStats,
  clearUserActivity
};