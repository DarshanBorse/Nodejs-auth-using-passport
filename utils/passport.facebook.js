import bcryptjs from "bcryptjs";
import { config } from "dotenv";
import passport from "passport";
import { UserModel } from "../model/user.model";
const FacebookStrategy = require('passport-facebook').Strategy;

config();

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:4000/auth/facebook/callback",
    profileFields: ['emails', 'displayName'],
    enableProof: true
},
    function (accessToken, refreshToken, profile, cb) {
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
                    return cb(error, profile);
                });
            } else {
                return cb(null, profile);
            }
        });
    }
));