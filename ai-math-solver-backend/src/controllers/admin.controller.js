const User = require('../models/User');

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    console.error('Admin users fetch error:', error);
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};

const getUserActivityByAdmin = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findOne({ ID: userId });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { limit = 50, offset = 0 } = req.query;
    const activityLog = user.Activity_Log || [];
    
    const sortedLog = activityLog.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    const paginatedLog = sortedLog.slice(parseInt(offset), parseInt(offset) + parseInt(limit));
    
    res.json({
      user: {
        ID: user.ID,
        Name: user.Name,
        Email: user.Email,
        Last_Login: user.Last_Login,
        Last_Active: user.Last_Active
      },
      total: activityLog.length,
      activities: paginatedLog
    });
  } catch (error) {
    console.error('Admin activity fetch error:', error);
    res.status(500).json({ message: 'Error fetching user activity', error: error.message });
  }
};

const getSystemStats = async (req, res) => {
  try {
    const users = await User.find({});
    
    const stats = {
      total_users: users.length,
      active_users_24h: 0,
      active_users_7d: 0,
      total_activities: 0,
      total_history_items: 0,
      total_library_items: 0
    };
    
    const now = new Date();
    const oneDayAgo = new Date(now - 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
    
    users.forEach(user => {
      if (user.Last_Active) {
        if (new Date(user.Last_Active) > oneDayAgo) {
          stats.active_users_24h++;
        }
        if (new Date(user.Last_Active) > sevenDaysAgo) {
          stats.active_users_7d++;
        }
      }
      
      stats.total_activities += (user.Activity_Log || []).length;
      stats.total_history_items += (user.History || []).length;
      stats.total_library_items += (user.Library || []).length;
    });
    
    res.json(stats);
  } catch (error) {
    console.error('System stats error:', error);
    res.status(500).json({ message: 'Error fetching system stats', error: error.message });
  }
};

module.exports = {
  getAllUsers,
  getUserActivityByAdmin,
  getSystemStats
};