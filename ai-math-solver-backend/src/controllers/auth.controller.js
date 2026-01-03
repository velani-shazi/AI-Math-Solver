const User = require('../models/User');
const { generateToken } = require('../config/jwt');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { generateVerificationToken, sendVerificationEmail, sendPasswordResetEmail, sendWelcomeEmail } = require('../services/email.service');

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
    const verificationToken = generateVerificationToken();

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
      isEmailVerified: false,
      emailVerificationToken: verificationToken,
      emailVerificationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    });

    await user.save();

    // Send verification email and welcome email
    let verificationEmailSent = false;
    let welcomeEmailSent = false;

    try {
      await sendVerificationEmail(email, verificationToken, name);
      verificationEmailSent = true;
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
    }

    try {
      await sendWelcomeEmail(email, name);
      welcomeEmailSent = true;
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
    }

    if (!verificationEmailSent) {
      return res.status(201).json({
        message: 'Signup successful. Please check your email to verify your account.',
        user: {
          ID: user.ID,
          Name: user.Name,
          Email: user.Email,
          Image_URL: user.Image_URL,
          isAdmin: user.isAdmin,
          isEmailVerified: user.isEmailVerified
        },
        warning: 'Verification email could not be sent. Please request a new one.'
      });
    }

    return res.status(201).json({
      message: 'Signup successful. Please verify your email to complete registration.',
      user: {
        ID: user.ID,
        Name: user.Name,
        Email: user.Email,
        Image_URL: user.Image_URL,
        isAdmin: user.isAdmin,
        isEmailVerified: user.isEmailVerified
      }
    });

  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Signup failed.', error: err.message });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: 'Verification token is required.' });
    }

    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired verification token.' });
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;

    await user.save();

    return res.status(200).json({
      message: 'Email verified successfully. You can now login.',
      user: {
        ID: user.ID,
        Name: user.Name,
        Email: user.Email,
        Image_URL: user.Image_URL,
        isAdmin: user.isAdmin,
        isEmailVerified: user.isEmailVerified
      }
    });

  } catch (error) {
    console.error('Email verification error:', error);
    return res.status(500).json({ message: 'Email verification failed.', error: error.message });
  }
};

const resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required.' });
    }

    const user = await User.findOne({ Email: email });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ message: 'Email is already verified.' });
    }

    const verificationToken = generateVerificationToken();
    user.emailVerificationToken = verificationToken;
    user.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await user.save();

    try {
      await sendVerificationEmail(email, verificationToken, user.Name);
      return res.status(200).json({ message: 'Verification email sent successfully.' });
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      return res.status(500).json({ message: 'Failed to send verification email.' });
    }

  } catch (error) {
    console.error('Resend verification error:', error);
    return res.status(500).json({ message: 'Failed to resend verification email.', error: error.message });
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

    if (!user.isEmailVerified) {
      return res.status(403).json({
        message: 'Please verify your email before logging in.',
        emailUnverified: true,
        email: user.Email
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

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required.' });
    }

    const user = await User.findOne({ Email: email });

    if (!user) {
      // Don't reveal if email exists or not for security reasons
      return res.status(200).json({ message: 'If the email exists, a password reset link has been sent.' });
    }

    const resetToken = generateVerificationToken();
    user.passwordResetToken = resetToken;
    user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await user.save();

    try {
      await sendPasswordResetEmail(email, resetToken, user.Name);
      return res.status(200).json({ message: 'Password reset email sent successfully.' });
    } catch (emailError) {
      console.error('Failed to send password reset email:', emailError);
      return res.status(500).json({ message: 'Failed to send password reset email.' });
    }

  } catch (error) {
    console.error('Forgot password error:', error);
    return res.status(500).json({ message: 'Failed to process password reset request.', error: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ message: 'Reset token and new password are required.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
    }

    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token.' });
    }

    // Check if user has verified their email (unless using OAuth)
    if (!user.isEmailVerified && !user.Google_Linked && !user.Facebook_Linked) {
      return res.status(403).json({
        message: 'Please verify your email before resetting your password.',
        emailUnverified: true
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.Password = hashedPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    return res.status(200).json({
      message: 'Password has been reset successfully. You can now login with your new password.'
    });

  } catch (error) {
    console.error('Reset password error:', error);
    return res.status(500).json({ message: 'Password reset failed.', error: error.message });
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
        isAdmin: user.isAdmin,
        isEmailVerified: user.isEmailVerified
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
          id: crypto.randomUUID(),
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
  verifyEmail,
  resendVerificationEmail,
  forgotPassword,
  resetPassword,
  getCurrentUser,
  logout,
};
