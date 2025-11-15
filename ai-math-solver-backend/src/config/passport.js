const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ ID: profile.id });

        if (!user) {
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
          });

          await user.save();
          console.log('New user created:', user.Email);
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