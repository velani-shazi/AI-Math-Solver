const nodemailer = require('nodemailer');
const crypto = require('crypto');
const path = require('path');

// Initialize nodemailer transporter
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Verify transporter connection
transporter.verify((error, success) => {
  if (error) {
    console.error('Email service error:', error);
  } else {
    console.log('Email service ready');
  }
});

/**
 * Generate a verification token
 */
const generateVerificationToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

/**
 * Get professional email header with logo
 */
const getEmailHeader = () => {
  const logoPath = path.join(__dirname, '../../build/logo.png');
  return `
    <table style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; border-collapse: collapse;">
      <tr>
        <td style="padding: 20px; text-align: center; background-color: #ffffff; border-bottom: 3px solid #db3f59;">
          <img src="cid:logo" alt="AI Math Solver" style="max-width: 150px; height: auto;" />
        </td>
      </tr>
      <tr>
        <td style="padding: 30px; background-color: #ffffff;">
  `;
};

/**
 * Get professional email footer
 */
const getEmailFooter = () => {
  return `
        </td>
      </tr>
      <tr>
        <td style="padding: 20px; text-align: center; background-color: #f5f5f5; border-top: 1px solid #ddd; font-size: 12px; color: #666;">
          <p style="margin: 5px 0;">
            <strong>AI Math Solver</strong><br>
            Making mathematics easier for everyone
          </p>
          <p style="margin: 10px 0; color: #999;">
            If you have any questions, please contact our support team.
          </p>
          <p style="margin: 5px 0; color: #999;">
            © ${new Date().getFullYear()} AI Math Solver. All rights reserved.
          </p>
        </td>
      </tr>
    </table>
  `;
};

/**
 * Get logo attachment
 */
const getLogoAttachment = () => {
  const logoPath = path.join(__dirname, '../../build/logo.png');
  return {
    filename: 'logo.png',
    path: logoPath,
    cid: 'logo'
  };
};

/**
 * Send email verification
 */
const sendVerificationEmail = async (email, verificationToken, userName) => {
  const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

  const mailOptions = {
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to: email,
    subject: 'Verify Your Email Address - AI Math Solver',
    html: `
      ${getEmailHeader()}
      <h2 style="color: #333; margin-top: 0;">Welcome to AI Math Solver, ${userName}!</h2>
      <p style="color: #555; line-height: 1.6; font-size: 14px;">
        Thank you for registering with us. We're excited to help you master mathematics with the power of AI.
      </p>
      <p style="color: #555; line-height: 1.6; font-size: 14px;">
        To get started, please verify your email address by clicking the button below:
      </p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${verificationLink}" style="display: inline-block; padding: 12px 30px; background-color: #db3f59; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 14px;">
          Verify Email Address
        </a>
      </div>
      <p style="color: #666; line-height: 1.6; font-size: 13px;">
        <strong>Or copy this link:</strong><br>
        <a href="${verificationLink}" style="color: #db3f59; text-decoration: none; word-break: break-all;">
          ${verificationLink}
        </a>
      </p>
      <p style="color: #999; font-size: 12px; margin-top: 20px; border-top: 1px solid #eee; padding-top: 15px;">
        <strong>⏰ This link expires in 24 hours.</strong>
      </p>
      <p style="color: #666; line-height: 1.6; font-size: 13px;">
        If you didn't create this account, please ignore this email or contact our support team.
      </p>
      ${getEmailFooter()}
    `,
    attachments: [getLogoAttachment()]
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Verification email sent to ${email}`);
    return true;
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw new Error('Failed to send verification email');
  }
};

/**
 * Send password reset email
 */
const sendPasswordResetEmail = async (email, resetToken, userName) => {
  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

  const mailOptions = {
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to: email,
    subject: 'Reset Your Password - AI Math Solver',
    html: `
      ${getEmailHeader()}
      <h2 style="color: #333; margin-top: 0;">Password Reset Request</h2>
      <p style="color: #555; line-height: 1.6; font-size: 14px;">
        Hi ${userName},
      </p>
      <p style="color: #555; line-height: 1.6; font-size: 14px;">
        We received a request to reset your password. If you made this request, click the button below to create a new password:
      </p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetLink}" style="display: inline-block; padding: 12px 30px; background-color: #db3f59; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 14px;">
          Reset Password
        </a>
      </div>
      <p style="color: #666; line-height: 1.6; font-size: 13px;">
        <strong>Or copy this link:</strong><br>
        <a href="${resetLink}" style="color: #db3f59; text-decoration: none; word-break: break-all;">
          ${resetLink}
        </a>
      </p>
      <p style="color: #999; font-size: 12px; margin-top: 20px; border-top: 1px solid #eee; padding-top: 15px;">
        <strong>⏰ This link expires in 1 hour.</strong>
      </p>
      <p style="color: #c0392b; line-height: 1.6; font-size: 13px; background-color: #fff5f5; padding: 15px; border-left: 4px solid #c0392b; border-radius: 3px;">
        <strong>⚠️ For your security:</strong> If you didn't request a password reset, please ignore this email or contact our support team immediately.
      </p>
      ${getEmailFooter()}
    `,
    attachments: [getLogoAttachment()]
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Password reset email sent to ${email}`);
    return true;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw new Error('Failed to send password reset email');
  }
};

/**
 * Send welcome email for new account creation (Google OAuth)
 */
const sendWelcomeEmail = async (email, userName) => {
  const appUrl = process.env.FRONTEND_URL || 'https://ai-math-solver.com';

  const mailOptions = {
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to: email,
    subject: 'Welcome to AI Math Solver - Your Account is Ready!',
    html: `
      ${getEmailHeader()}
      <h2 style="color: #333; margin-top: 0;">Welcome to AI Math Solver, ${userName}! 🎉</h2>
      <p style="color: #555; line-height: 1.6; font-size: 14px;">
        We're thrilled to have you on board! Your account has been successfully created and you're all set to start solving math problems with the power of AI.
      </p>
      
      <div style="background-color: #f0f8ff; border-left: 4px solid #db3f59; padding: 15px; margin: 20px 0; border-radius: 3px;">
        <h3 style="color: #db3f59; margin-top: 0;">🚀 Get Started Now</h3>
        <p style="color: #555; line-height: 1.6; font-size: 14px; margin: 10px 0;">
          <a href="${appUrl}" style="display: inline-block; padding: 10px 20px; background-color: #db3f59; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; margin-top: 10px;">
            Go to AI Math Solver
          </a>
        </p>
      </div>

      <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3 style="color: #333; margin-top: 0;">✨ What You Can Do</h3>
        <ul style="color: #555; line-height: 1.8; font-size: 14px;">
          <li><strong>Solve Math Problems:</strong> Get AI-powered solutions and step-by-step explanations</li>
          <li><strong>Save Solutions:</strong> Bookmark your solutions for quick access later</li>
          <li><strong>View History:</strong> Keep track of all problems you've solved</li>
          <li><strong>Manage Your Profile:</strong> Update your information anytime</li>
        </ul>
      </div>

      <p style="color: #666; line-height: 1.6; font-size: 13px;">
        If you have any questions or need assistance, our support team is always here to help!
      </p>
      
      <p style="color: #999; font-size: 12px; margin-top: 20px; border-top: 1px solid #eee; padding-top: 15px;">
        <strong>💡 Tip:</strong> Check out our FAQ section in the app for helpful guides and tutorials.
      </p>
      ${getEmailFooter()}
    `,
    attachments: [getLogoAttachment()]
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Welcome email sent to ${email}`);
    return true;
  } catch (error) {
    console.error('Error sending welcome email:', error);
    throw new Error('Failed to send welcome email');
  }
};

module.exports = {
  generateVerificationToken,
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendWelcomeEmail,
};
