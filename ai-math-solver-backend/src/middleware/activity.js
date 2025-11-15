const User = require('../models/User');
const crypto = require('crypto');

const logActivity = (action) => {
  return async (req, res, next) => {
    try {
      if (req.user && req.user.ID) {
        const user = await User.findOne({ ID: req.user.ID });
        
        if (user) {
          const activityLog = {
            id: crypto.randomUUID(),
            action: action,
            details: {
              path: req.path,
              method: req.method,
              body: sanitizeBody(req.body),
              params: req.params,
              query: req.query
            },
            timestamp: new Date(),
            ip_address: req.ip || req.connection.remoteAddress,
            user_agent: req.headers['user-agent']
          };

          user.Activity_Log.push(activityLog);
          user.Last_Active = new Date();
          
          if (user.Activity_Log.length > 100) {
            user.Activity_Log = user.Activity_Log.slice(-100);
          }

          await user.save();
        }
      }
    } catch (error) {
      console.error('Activity logging error:', error);
    }
    
    next();
  };
};

// Helper function to sanitize sensitive data from body
const sanitizeBody = (body) => {
  const sanitized = { ...body };
  const sensitiveFields = ['password', 'token', 'secret', 'apiKey'];
  
  sensitiveFields.forEach(field => {
    if (sanitized[field]) {
      sanitized[field] = '[REDACTED]';
    }
  });
  
  return sanitized;
};

module.exports = {
  logActivity
};