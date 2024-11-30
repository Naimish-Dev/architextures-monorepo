import passport from "passport";
import { excludeFields } from "../utils/helper.js";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import User from "../models/users.model.js";

passport.serializeUser(function (user, done) {
  done(null, user._id);
});

passport.deserializeUser(async function (id, done) {
  try {
    const user = await User.findById(id).lean();
    if (!user) return done(new Error("User not found"), null);

    return done(null, excludeFields(user, ["password", "remember_token"]));
  } catch (error) {
    done(error, null);
  }
});

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async function (email, password, done) {
      try {
        const user = await User.findOne({ email }).lean();
        if (!user || !bcrypt.compareSync(password, user.password)) {
          return done(null, false, { message: "Invalid credentials" });
        }

        return done(null, excludeFields(user, ["password"]));
      } catch (error) {
        done(error);
      }
    }
  )
);

export default passport;
