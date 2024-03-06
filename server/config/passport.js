import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import UserSchema from '../models/user.js';
import dotenv from 'dotenv';

dotenv.config();

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

export const passportConfig = passport => {
  passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      const user = await UserSchema.findById(jwt_payload.user.id);
      if (user) {
        return done(null, user);
      }
      return done(null, false);
    } catch (err) {
      console.error(err);
    }
  }));
};
