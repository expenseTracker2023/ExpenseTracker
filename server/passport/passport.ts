import passport from 'passport';
import passportGoogle from 'passport-google-oauth20';
import dotenv from 'dotenv';

import User from '../models/Users';

dotenv.config();

const GoogleStrategy = passportGoogle.Strategy;

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID as string,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    callbackURL: `${process.env.SERVER}/auth/redirect/google`,
  },
  async (accessToken, refreshToken, profile, done) => {
    // get profile details
    // save profile details in db
    const user = await User.findOne({ googleId: profile.id });

    if (!user) {
      const newUser = await User.create({
        googleId: profile.id,
        name: profile.displayName,
        email: profile.emails?.[0].value,
        picture: profile.photos?.[0].value,
      });
      if (newUser) {
        done(null, newUser);
      }
    } else {
      done(null, user);
    }
  }
);

export { googleStrategy };
