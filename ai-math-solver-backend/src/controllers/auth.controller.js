const User = require('../models/User');
const { generateToken } = require('../config/jwt');
const bcrypt = require('bcrypt');

const manualSignup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, Email, and Password are required.' });
    }

    const existingUser = await User.findOne({ Email: email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      ID: crypto.randomUUID(),
      Name: name,
      Email: email,
      Password: hashedPassword,
      Image_URL: null,
      Registration_Date: new Date(),
      Google_Linked: false,
      Facebook_Linked: false,
      isAdmin: false,
      History: [],
      Library: [],
    });

    await user.save();

    const token = generateToken(user);

    return res.status(201).json({
      message: 'Signup successful.',
      token,
      user: {
        ID: user.ID,
        Name: user.Name,
        Email: user.Email,
        Image_URL: user.Image_URL,
        isAdmin: user.isAdmin
      }
    });

  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Signup failed.', error: err.message });
  }
};

const manualLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and Password are required.' });
    }

    const user = await User.findOne({ Email: email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    if (!user.Password) {
      return res.status(400).json({
        message: 'This account does not have a password. Please sign in using Google.',
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.Password);
    if (!passwordMatch) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    user.Last_Login = new Date();
    user.Last_Active = new Date();
    user.Activity_Log.push({
      id: crypto.randomUUID(),
      action: 'login',
      details: { method: 'manual' },
      timestamp: new Date(),
      ip_address: req.ip || req.connection.remoteAddress,
      user_agent: req.headers['user-agent']
    });

    await user.save();

    const token = generateToken(user);

    return res.status(200).json({
      message: 'Login successful.',
      token,
      user: {
        ID: user.ID,
        Name: user.Name,
        Email: user.Email,
        Image_URL: user.Image_URL,
        isAdmin: user.isAdmin
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      message: 'Login failed.',
      error: error.message
    });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findOne({ ID: req.user.ID });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ 
      authenticated: true, 
      user: {
        ID: user.ID,
        Name: user.Name,
        Email: user.Email,
        Image_URL: user.Image_URL,
        Registration_Date: user.Registration_Date,
        Google_Linked: user.Google_Linked,
        Facebook_Linked: user.Facebook_Linked,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    console.error('Auth check error:', error);
    res.status(500).json({ message: 'Error checking authentication', error: error.message });
  }
};

const logout = async (req, res) => {
  try {
    if (req.user && req.user.ID) {
      const user = await User.findOne({ ID: req.user.ID });
      if (user) {
        user.Activity_Log.push({
          id: require('crypto').randomUUID(),
          action: 'logout',
          details: {},
          timestamp: new Date(),
          ip_address: req.ip || req.connection.remoteAddress,
          user_agent: req.headers['user-agent']
        });
        await user.save();
      }
    }
  } catch (error) {
    console.error('Logout logging error:', error);
  }
  
  res.json({ message: 'Logged out successfully. Please remove token from client.' });
};

module.exports = {
  manualLogin,
  manualSignup,
  getCurrentUser,
  logout,
};