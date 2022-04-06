import passport from "passport";
import { config } from "dotenv";
import { UserModel } from "../model/user.model";
import bcryptjs from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
const GoogleStrategy = require('passport-google-oauth20').Strategy;

config();

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
                done(error, profile);
            });
        } else {
            const token = jsonwebtoken.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
                expiresIn: process.env.JWT_TOKEN_EXPIRE
            });

            done(null, token);
        }
    });
}));

passport.serializeUser(function (token, done) {
    done(null, token);
});

passport.deserializeUser(function (user, done) {
    console.log('error');
    done(null, user);
});
