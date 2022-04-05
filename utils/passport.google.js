import passport from "passport";
import { config } from "dotenv";
import { UserModel } from "../model/user.model";
import bcryptjs from "bcryptjs";
const GoogleStrategy = require('passport-google-oauth20').Strategy;

config();

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_REDIRECT_URL,
    passReqToCallback: true
}, function (request, accessToken, refreshToken, profile, done) {
    UserModel.findOne({ email: profile._json.email }, (err, user) => {
        if (err) {
            return done(err);
        }

        if (!user) {
            let newUser = new UserModel({
                name: profile._json.name,
                email: profile._json.email,
                password: bcryptjs.hashSync(Math.random().toString(), 8)
            });
            newUser.save((error, profile) => {
                return done(error, profile);
            });
        } else {
            return done(null, accessToken)
        }
    });
}));