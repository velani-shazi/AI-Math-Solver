const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
const { sendWelcomeEmail } = require('../services/email.service');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // First check by email to prevent duplicate accounts
        const email = profile.emails[0].value;
        let user = await User.findOne({ $or: [{ ID: profile.id }, { Email: email }] });
        let isNewUser = false;

        if (!user) {
          isNewUser = true;
          user = new User({
            ID: profile.id,
            Name: profile.displayName,
            Email: profile.emails[0].value,
            Image_URL: profile.photos[0]?.value || '',
            Registration_Date: new Date(),
            Google_Linked: true,
            Facebook_Linked: false,
            History: [],
            Library: [],
            isAdmin: false,
            isEmailVerified: true,
          });

          await user.save();
          console.log('New user created:', user.Email);

          // Send welcome email for new Google users
          try {
            await sendWelcomeEmail(email, profile.displayName);
            console.log('Welcome email sent to:', email);
          } catch (emailError) {
            console.error('Failed to send welcome email to new Google user:', emailError);
            // Continue even if email fails
          }
        } else {
          user.Google_Linked = true;
          await user.save();
          console.log('Existing user logged in:', user.Email);
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

module.exports = passport;